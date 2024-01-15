<script setup lang="ts">
import { useState, useCookie } from "nuxt/app";
import { ref } from "vue";
import type server from "../server/types";
import type { Message } from "../utils/types/Message";

import { chatListOwn } from "../server/chatListOwn";
import { chatSend } from "../server/chatSend";

const sessionToken = useCookie("aiverb-session");

const userText = ref("");
const messages = ref<Message[]>([]);
const error = ref<boolean>(false);

const getChat = async (): Promise<void> => {
  if (!sessionToken.value) {
    error.value = true;
    return;
  }

  const { data, error: err } = await chatListOwn({}, sessionToken.value);

  if (err.value || !data.value) {
    console.error(err.value);
    error.value = true;
    return;
  }

  (data.value.messages as server.ChatResponseData[]).forEach((message) => {
    messages.value = [
      ...messages.value,
      { from: "user", message: message.userMessage },
      { from: "ai", message: message.aiMessage },
    ];
  });
};

getChat();

const sendMessage = async (): Promise<void> => {
  if (!sessionToken.value) {
    error.value = true;
    return;
  }

  messages.value.push({
    from: "user",
    message: userText.value,
  });

  const userMessage = userText.value;

  userText.value = "";

  const { data, error: err } = await chatSend(
    { userMessage },
    sessionToken.value
  );

  if (err.value || !data.value) {
    error.value = true;
    console.error(err.value);
    return;
  }

  const aiMessage: Message = {
    from: "ai",
    message: data.value.aiMessage,
  };

  messages.value.push(aiMessage);
};
</script>

<template>
  <div class="aiverb">
    <Sidebar />
    <div class="aiverb-chat">
      <div class="chatbox" v-if="messages.length">
        <template v-for="(message, index) of messages" :key="index">
          <p :class="['message', `from-${message.from}`]">
            <span v-if="message.from == 'ai'">Sensei: </span>
            <span v-if="message.from == 'user'">You: </span>
            <span>{{ message.message }}</span>
          </p>
        </template>
      </div>
      <form class="aiverb-text-bar" @submit.prevent="sendMessage">
        <div class="form-item">
          <input type="text" name="chat" id="chat" v-model="userText" />
          <button type="submit">Send</button>
        </div>
      </form>
      <p v-if="error" style="color: red">
        There's been an error. Please try again later.
      </p>
    </div>
  </div>
</template>
