import express from "express";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";
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
