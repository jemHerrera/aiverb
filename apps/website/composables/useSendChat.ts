import type server from "../utils/server";

export const useSendChat = async (
  body: server.ChatSendRequest,
  auth: string
) => {
  const { data, error } = await useFetch<server.ChatSendResponse>(
    `${useRuntimeConfig().public.serverPort}/chat/send`,
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
