import { useGetUser } from "../composables/useGetUser";
import type server from "../utils/server";

import { useCookie, useState } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useState<server.UserResponseData | null>("user");

  if (to.path === "/") {
    const sessionCookie = useCookie("aiverb-session");
    if (!sessionCookie.value) return navigateTo("/login");
    const { data, error } = await useGetUser(sessionCookie.value);
    if (error.value) return navigateTo("/login");
    user.value = data.value;
  }
});
