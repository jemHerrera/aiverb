import express from "express";
import { DI } from "..";
import { Chat, User } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";
import { Loaded } from "@mikro-orm/core";
import { gpt35TurboConversational } from "../utils/aiModels/gpt35TurboConversational";
import { gpt35Turbo } from "../utils/aiModels/gpt35Turbo";
import { ChatResponseData } from "../utils/types/ChatResponseData";

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

    // let chat: Loaded<Chat, never> | null;

    // if (!chatId) {
    //   chat = em.create(Chat, {
    //     user,
    //     topic: "",
    //     messages: [],
    //   });
    // } else {
    //   chat = await em.findOne(Chat, {
    //     id: chatId,
    //     user: user.id,
    //   });
    // }

    // if (!chat) return res.sendStatus(500);

    // Do AI Stuff
    // Check if this is the first chat of the day
    //

    const aiMessage = await gpt35TurboConversational(userMessage);

    const chat = em.create(Chat, {
      user,
      userMessage,
      aiMessage,
    });

    await em.flush();

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
