import express from "express";
import { DI } from "..";
import { Chat, User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";
import { ChatResponseData } from "../utils/types/ChatResponseData";
import { useVectorStore } from "../db/_config/vectorStore";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { kaori, kaoriStyle } from "../utils/aiPrompts/kaori";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

import { summarizeChat } from "../utils/summarizeChat";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { tts } from "../utils/tts";

export const ChatSendRequest = z
  .object({
    userMessage: z.string(),
  })
  .strict();

export type ChatSendRequest = z.infer<typeof ChatSendRequest>;
export type ChatSendResponse = ChatResponseData;

export const chatSend = async (
  req: AuthenticatedRequest<{}, {}, ChatSendRequest>,
  res: express.Response<ChatSendResponse>
) => {
  try {
    const { em } = DI;
    if (!req.user) return res.sendStatus(500);

    const invalidRequestBody = !ChatSendRequest.safeParse(req.body).success;
    if (invalidRequestBody) return res.sendStatus(406);

    const { id } = req.user;

    const user = await em.findOne(User, { id });
    if (!user) return res.sendStatus(500);

    const { userMessage } = req.body;

    const chatsCount = await em.count(Chat, { user: id });

    const HISTORY_SIZE = 3;
    const SUMMARIZE_INTERVAL = 1;

    // Get the last x chats + current chat and use this to retrieve y number of relevant documents
    const previousChats = await em.find(
      Chat,
      { user: id },
      {
        orderBy: { createdAt: "ASC" },
        limit: HISTORY_SIZE,
        offset: Math.max(chatsCount - HISTORY_SIZE, 0),
      }
    );

    const vectorStore = await useVectorStore();
    const outputParser = new StringOutputParser();
    const chatModel = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chatHistory: (HumanMessage | AIMessage)[] = [];

    previousChats.forEach((chat) => {
      chatHistory.push(new HumanMessage(chat.userMessage));
      chatHistory.push(new AIMessage(chat.aiMessage));
    });

    chatHistory.push(new HumanMessage(userMessage));

    const historyPrompt = ChatPromptTemplate.fromMessages([
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
      [
        "user",
        "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
      ],
    ]);

    const retriever = await createHistoryAwareRetriever({
      llm: chatModel,
      retriever: vectorStore.asRetriever(8, { userId: user.id }),
      rephrasePrompt: historyPrompt,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", kaori],
      [
        "system",
        `Relevant pieces of previous conversation:

        {context}

        (You do not need to use these pieces of information if not relevant)
        `,
      ],
      new MessagesPlaceholder("chat_history"),
      ["user", "{input}"],
    ]);

    const combineDocsChain = await createStuffDocumentsChain({
      llm: chatModel,
      prompt,
    });

    const conversationChain = await createRetrievalChain({
      retriever,
      combineDocsChain,
    });

    const aiMessage = await conversationChain.invoke({
      input: userMessage,
      chat_history: chatHistory,
    });

    // Create new Chat. (use userMessage and ai message)
    const chat = em.create(Chat, {
      user,
      userMessage,
      aiMessage: aiMessage.answer,
    });

    // Summarize chat and add to the vector database.
    summarizeChat(chat, "Kaori", user.username).then((summary) => {
      console.log(summary);

      vectorStore.addDocuments([
        {
          pageContent: summary,
          metadata: { userId: id },
        },
      ]);
    });

    em.flush();

    return res
      .status(200)
      .json({
        id: chat.id,
        userId: chat.user.id,
        userMessage: chat.userMessage,
        aiMessage: chat.aiMessage,
        createdAt: chat.createdAt,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
