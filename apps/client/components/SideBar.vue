<script setup lang="ts">
import { useCookie } from "nuxt/app";

const logout = (): void => {
  const sessionCookie = useCookie("aiverb-session");
  sessionCookie.value = null;
  // Check if logged in first
  // delete sessionCookie
};
</script>

<template>
  <div class="side-bar">
    <h1>This is a sidebar</h1>
    <p>Logged in as:</p>
    <button @click="logout">Logout</button>
  </div>
</template>
