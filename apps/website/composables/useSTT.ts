import type server from "../utils/server";

export const useSTT = async (
  body: server.SpeechToTextRequest,
  auth: string
) => {
  const { data, error } = await useFetch<server.SpeechToTextResponse>(
    `${useRuntimeConfig().public.serverPort}/chat/stt`,
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
