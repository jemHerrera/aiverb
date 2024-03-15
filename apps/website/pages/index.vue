<script setup lang="ts">
import { useCookie } from "nuxt/app";
import { onMounted, ref } from "vue";
import type server from "../server/types";
import type { Message } from "../utils/types/Message";
import { chatListOwn } from "../server/chatListOwn";
import { chatSend } from "../server/chatSend";
import { tts } from "../server/tts";

const sessionToken = useCookie("aiverb-session");
const userText = ref("");
const messages = ref<Message[]>([
  {
    from: "user",
    message: "Say something in Japanese with some english words in it.",
  },
  {
    from: "ai",
    message: `Sure, here's a sentence mixing Japanese and English:\n\n"今日は、Tokyo でランチを食べた。It was delicious!"\n\nThis means "Today, I had lunch in Tokyo. It was delicious!"`,
  },
  {
    from: "user",
    message: "Amazing, can you do one more?",
  },
  {
    from: "ai",
    message: `Of course! Here's another mixed sentence:\n\n"昨日、私はshopping を楽しんだ after work."\n\nThis means "Yesterday, I enjoyed shopping after work."`,
  },
]);
const error = ref<boolean>(false);
const speechUrl = ref<string>("");
const recorderIsSupported = ref<boolean>(false);
const isRecording = ref<boolean>(false);
const recorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<BlobPart[]>([]);
// Default should be false and there should be a toggle ui for it
const allowSpeech = ref<boolean>(true);

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

// getChat();

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

  const { data: chatSendData, error: chatSendError } = await chatSend(
    { userMessage },
    sessionToken.value
  );

  if (chatSendError.value || !chatSendData.value) {
    error.value = true;
    console.error(chatSendError.value);
    return;
  }

  const aiMessage: Message = {
    from: "ai",
    message: chatSendData.value.aiMessage,
  };

  messages.value.push(aiMessage);

  if (allowSpeech.value) {
    const { data: ttsData, error: ttsError } = await tts(
      { text: aiMessage.message },
      sessionToken.value
    );

    if (ttsError.value || !ttsData.value) {
      error.value = true;
      console.error(ttsError.value);
      return;
    }

    const { audioContent } = ttsData.value.speech;

    if (
      audioContent &&
      typeof audioContent == "object" &&
      "data" in audioContent
    ) {
      const blob = new Blob(
        [new Uint8Array(Object.values(audioContent.data as object))],
        { type: "audio/mp3" }
      );

      speechUrl.value = window.URL.createObjectURL(blob);
    }
  }
};

function startRecording() {
  if (isRecording.value || !recorder.value) return;

  isRecording.value = true;

  recorder.value.start();
}

function stopRecording() {
  if (!isRecording.value || !recorder.value) return;

  isRecording.value = false;

  recorder.value.stop();
}

onMounted(async () => {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    recorderIsSupported.value = false;

    return;
  }

  recorderIsSupported.value = true;

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  recorder.value = new MediaRecorder(stream);

  recorder.value.ondataavailable = (event: BlobEvent) => {
    audioChunks.value.push(event.data);
  };

  recorder.value.onstop = () => {
    const audioBlob = new Blob(audioChunks.value, { type: "audio/wav" });

    // Do something with the audio Blob (e.g., create a URL and play it)
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();

    console.log(audioBlob);
  };
});
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
      <audio controls :src="speechUrl"></audio>
      <form class="aiverb-text-bar" @submit.prevent="sendMessage">
        <div class="form-item">
          <input type="text" name="chat" id="chat" v-model="userText" />
          <button type="submit">Send</button>
        </div>
      </form>
      <button v-if="!isRecording" @click="startRecording()">
        Start Recording
      </button>
      <button v-else @click="stopRecording()">Stop Recording</button>
      <p v-if="error" style="color: red">
        There's been an error. Please try again later.
      </p>
    </div>
  </div>
</template>
