import express from "express";
import { AuthenticatedRequest } from "../middlewares/userAuthenticate";
import { z } from "zod";
import { writeFile, readFileSync } from "fs";
import { SpeechClient } from "@google-cloud/speech";
export const SpeechToTextRequest = z
  .object({
    speech: z.any(),
  })
  .strict();

export type SpeechToTextRequest = z.infer<typeof SpeechToTextRequest>;
export type SpeechToTextResponse = { text: string };

export const speechToText = async (
  req: AuthenticatedRequest<{}, {}, SpeechToTextRequest>,
  res: express.Response<SpeechToTextResponse>
) => {
  try {
    if (!req.user) return res.sendStatus(500);

    const invalidRequestBody = !SpeechToTextRequest.safeParse(req.body).success;

    if (invalidRequestBody) return res.sendStatus(406);

    const base64Data = req.body.speech.split(",")[1];

    const client = new SpeechClient();

    const audio = {
      content: base64Data,
    };

    const config = {
      encoding: "WEBM_OPUS" as const,
      languageCode: "ja-JP",
      alternativeLangugeCodes: ["en-US"],
    };

    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await client.recognize(request);

    if (!response.results) {
      console.error("Error transcribing speech.");
      return;
    }

    const transcription = response.results
      .map((result) => {
        if (!result.alternatives) return "";
        return result.alternatives[0].transcript;
      })
      .join("\n");

    return res
      .status(200)
      .json({
        text: transcription,
      })
      .end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
