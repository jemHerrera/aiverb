import type server from "../utils/server";

export const useListChat = async (
  body: server.ChatListOwnRequest,
  auth: string
) => {
  const { data, error } = await useFetch<server.ChatListOwnResponse>(
    `${useRuntimeConfig().public.serverPort}/chat`,
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
