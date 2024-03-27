import express from "express";
import { chatSend } from "../controllers/chatSend";
import { chatListOwn } from "../controllers/chatListOwn";
import { userAuthenticate } from "../middlewares/userAuthenticate";
import { textToSpeech } from "../controllers/textToSpeech";
import { speechToText } from "../controllers/speechToText";

export default (router: express.Router) => {
  router.post("/chat/send", userAuthenticate, chatSend);
  router.post("/chat", userAuthenticate, chatListOwn);
  router.post("/chat/tts", userAuthenticate, textToSpeech);
  router.post("/chat/stt", userAuthenticate, speechToText);
};
