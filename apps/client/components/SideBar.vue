import type user from '../../server/src/router/user'; import type {
stringifyQuery } from 'vue-router';
<script setup lang="ts">
import { useCookie, useState, navigateTo } from "nuxt/app";
import type server from "../server/types";

const user = useState<server.UserGetOwnResponse | null>("user");

const logout = async (): Promise<void> => {
  const sessionCookie = useCookie("aiverb-session");

  if (user.value) {
    user.value = null;
    sessionCookie.value = null;

    await navigateTo("/login");
  }
};
</script>

<template>
  <div v-if="user" class="side-bar">
    <h1>This is a sidebar</h1>
    <p>Logged in as: {{ user.username }}</p>
    <button @click="logout">Logout</button>
  </div>
</template>
