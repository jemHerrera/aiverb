import express from "express";
import { DI } from "..";
import { Chat } from "../db/entities";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";
import { ChatResponseData } from "../utils/types/ChatResponseData";

export const ChatListOwnRequest = z
  .object({
    limit: z.number().optional(),
    offset: z.number().optional(),
  })
  .strict();

export type ChatListOwnRequest = z.infer<typeof ChatListOwnRequest>;
export type ChatListOwnResponse = {
  messages: ChatResponseData[];
  limit: number;
  offset: number;
  total: number;
};

export const chatListOwn = async (
  req: AuthenticatedRequest<{}, {}, ChatListOwnRequest>,
  res: express.Response<ChatListOwnResponse>
) => {
  try {
    const { em } = DI;

    if (!req.user) return res.sendStatus(500);

    const { limit = 10, offset = 0 } = req.body;

    const [chats, total] = await em.findAndCount(
      Chat,
      {
        user: req.user.id,
      },
      {
        limit: Math.min(limit, 10),
        offset,
      }
    );

    if (chats == null) return res.sendStatus(500);

    const messages: ChatResponseData[] = chats.map((chat) => {
      return {
        id: chat.id,
        userId: chat.user.id,
        userMessage: chat.userMessage,
        aiMessage: chat.aiMessage,
        createdAt: chat.createdAt,
      };
    });

    return res
      .status(200)
      .json({
        messages,
        limit,
        offset,
        total,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
