import type server from "./types";

export const userGetOwn = async (auth: string) => {
  const { data, error } = await useFetch<server.UserGetOwnResponse>(
    `${useRuntimeConfig().public.serverPort}/get`,
    {
      body: {},
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${auth}`,
      },
    }
  );
  return { data, error };
};
