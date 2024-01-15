import type server from "./types";

export const chatListOwn = async (
  body: server.ChatListOwnRequest,
  auth: string
): Promise<{
  data: Ref<server.ChatListOwnResponse | null>;
  error: Ref<any | null>;
}> => {
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
