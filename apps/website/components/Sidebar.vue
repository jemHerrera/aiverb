<script setup lang="ts">
import { useCookie, useState, navigateTo } from "nuxt/app";
import type server from "../server/types";

const user = useState<server.UserResponseData | null>("user");

const logout = async (): Promise<void> => {
  const sessionCookie = useCookie("aiverb-session");

  if (user.value) {
    user.value = null;
    sessionCookie.value = null;

    navigateTo("/login");
  }
};
</script>

<template>
  <!-- <div v-if="user" class="side-bar h-full bg-gray-100"> -->
  <div
    class="z-10 side-bar fixed top-0 left-0 w-screen flex justify-end px-4 py-2"
  >
    <UDropdown
      :items="[
        [
          {
            label: 'Sign out',
            color: 'red',
            icon: 'i-heroicons-arrow-right-start-on-rectangle-20-solid',
            click: logout,
          },
        ],
      ]"
      :popper="{ placement: 'bottom-start' }"
    >
      <UButton
        variant="ghost"
        color="gray"
        class="flex gap-2 hover:bg-gray-100"
      >
        <UAvatar
          alt="Jem Herrera"
          size="md"
          :ui="{
            background: 'bg-gray-800',
            placeholder: 'text-white',
          }"
        />
        <p class="hidden md:block">Jem Herrera</p>
      </UButton>
    </UDropdown>
  </div>
</template>
