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
import { TextToSpeechResponseData } from "../utils/types/TextToSpeechResponseData";

export const TextToSpeechRequest = z
  .object({
    text: z.string(),
  })
  .strict();

export type TextToSpeechRequest = z.infer<typeof TextToSpeechRequest>;
export type TextToSpeechResponse = TextToSpeechResponseData;

export const textToSpeech = async (
  req: AuthenticatedRequest<{}, {}, TextToSpeechRequest>,
  res: express.Response<TextToSpeechResponse>
) => {
  try {
    const { em } = DI;
    if (!req.user) return res.sendStatus(500);

    const invalidRequestBody = !TextToSpeechRequest.safeParse(req.body).success;

    if (invalidRequestBody) return res.sendStatus(406);

    return res
      .status(200)
      .json({
        speech: await tts(req.body.text),
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
