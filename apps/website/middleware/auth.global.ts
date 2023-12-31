import { userGetOwn } from "../server/userGet";
import type server from "../server/types";

import { useCookie, useState } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useState<server.UserGetOwnResponse | null>("user");

  if (to.path === "/") {
    const sessionCookie = useCookie("aiverb-session");

    if (!sessionCookie.value) return navigateTo("/login");

    const { data, error } = await userGetOwn(sessionCookie.value);

    if (error.value) return navigateTo("/login");

    user.value = data.value;
  }
});
