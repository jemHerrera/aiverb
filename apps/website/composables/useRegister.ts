import type server from "../utils/server";

export const useRegister = async (body: server.UserCreateRequest) => {
  const { data, error } = await useFetch<server.UserResponseData>(
    `${useRuntimeConfig().public.serverPort}/auth/register`,
    {
      body,
      method: "post",
      headers: { "Content-Type": "application/json" },
    }
  );
  return { data, error };
};
