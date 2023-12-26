<script setup lang="ts">
import { userGetOwn } from "./server/userGet";
import type server from "./server/types";

import { useCookie, useState } from "nuxt/app";

const user = useState<server.UserGetOwnResponse | null>("user", () => null);

const getUser = async () => {
  const sessionCookie = useCookie("aiverb-session");

  console.log(sessionCookie.value);

  if (!sessionCookie.value) return;

  const { data, error } = await userGetOwn(sessionCookie.value);
  // Issue: I could not make a GET request with a body
  // Solution 1: Change the api to be able to accept a body
  // Solution 2: Change the request to post request
  // Solution 3: Find a way with nuxt's useFetch() to be able to accept GET request with a body
  if (error.value) console.error(error.value);

  user.value = data.value;
};

getUser();
</script>

<template>
  <NuxtLoadingIndicator />
  <div>
    <SideBar />
    <NuxtPage />
  </div>
</template>
