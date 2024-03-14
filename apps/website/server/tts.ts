import type server from "./types";

export const tts = async (body: server.TextToSpeechRequest, auth: string) => {
  const { data, error } = await useFetch<server.TextToSpeechResponse>(
    `${useRuntimeConfig().public.serverPort}/chat/tts`,
    {
      body,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${auth}`,
      },
    }
  );
  return { data, error };
};
