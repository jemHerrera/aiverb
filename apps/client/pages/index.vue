<script setup lang="ts">
import { navigateTo, useState } from "nuxt/app";
import { watch } from "vue";

const user = useState("user");

watch(user, async (u) => {
  if (u === null) await navigateTo("/login");
  else await navigateTo("/chat");
});
</script>

<template>
  <h1>Homepage</h1>
  <NuxtLink to="/register">Register</NuxtLink>
  <NuxtLink to="/login">Login</NuxtLink>
</template>
