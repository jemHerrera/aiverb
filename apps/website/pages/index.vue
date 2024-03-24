<script setup lang="ts">
import type server from "../utils/server";
import type { Message } from "../utils/types/Message";

const sessionToken = useCookie("aiverb-session");
const userInput = ref("");
const user = useState<server.UserResponseData | null>("user");
const messages = ref<Message[]>([]);
const error = ref<string>("");
const audio = ref<HTMLAudioElement | null>(null);
const isFetching = ref<boolean>(false);
const isTyping = ref<boolean>(false);
const isSpeaking = ref<boolean>(false);

const { data: useListChatData, error: useListChatError } = await useListChat(
  {},
  sessionToken.value ?? ""
);

// getMessages();

function reset(): void {
  messages.value = [];
  userInput.value = "";
  error.value = "";
  audio.value = null;
  isTyping.value = false;
  isSpeaking.value = false;
  isFetching.value = false;
}

getMessages();

function getMessages() {
  if (!useListChatData.value?.messages.length || isFetching.value) return;

  isFetching.value = true;

  (useListChatData.value.messages as server.ChatResponseData[]).forEach(
    (message) => {
      messages.value = [
        ...messages.value,
        { from: "user", message: message.userMessage },
        { from: "ai", message: message.aiMessage },
      ];
    }
  );

  isFetching.value = false;
}

async function sendMessage(
  options: { voice: boolean } = { voice: true }
): Promise<void> {
  if (!userInput.value || isTyping.value) return;

  if (!sessionToken.value) {
    error.value = "Session token not found. You are an invalid user.";
    return;
  }

  messages.value.push({
    from: "user",
    message: userInput.value,
  });

  const userMessage = userInput.value;

  userInput.value = "";

  messages.value.push({
    from: "ai",
    message: "",
  });

  isTyping.value = true;

  window.scrollTo(0, document.body.scrollHeight);

  try {
    const { data: chatSendData, error: chatSendError } = await useSendChat(
      { userMessage },
      sessionToken.value
    );

    if (chatSendError.value || !chatSendData.value) {
      error.value = "Error sending message. Please try again later.";
      return;
    }

    messages.value[messages.value.length - 1].message =
      chatSendData.value.aiMessage;

    window.scrollTo(0, document.body.scrollHeight);

    if (options.voice) {
      // speak(aiMessage.message);
    }

    isTyping.value = false;
  } catch (e) {
    error.value = "Error sending message. Please try again later.";
    isTyping.value = false;
  }
}

async function speak(message: string) {
  if (isSpeaking.value) return;

  if (!sessionToken.value) {
    error.value = "Session token not found. You are an invalid user.";
    return;
  }

  isSpeaking.value = true;

  try {
    const { data: ttsData, error: ttsError } = await useTTS(
      { text: message },
      sessionToken.value
    );

    if (ttsError.value || !ttsData.value) {
      error.value = "Something went wrong. please try again later.";
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

      audio.value = new Audio(window.URL.createObjectURL(blob));
    }

    isSpeaking.value = false;
  } catch (e) {
    error.value = "Something went wrong. please try again later.";
    isSpeaking.value = false;
  }
}

async function transcribeRecording(data: BlobPart[]) {
  const audioBlob = new Blob(data, { type: "audio/wav" });

  // console.log(audioBlob);

  //TODO: STT

  // sendMessage({ voice: true });
}

watch(useListChatData, getMessages);

onMounted(async () => {
  window.scrollTo(0, document.body.scrollHeight);
});

onUnmounted(reset);
</script>

<template>
  <div class="flex">
    <Sidebar />
    <UContainer class="max-w-screen-sm mx-auto relative h-screen max-h-screen">
      <div
        class="flex flex-col justify-end min-h-screen pt-8 py-32"
        v-if="messages.length > 0"
      >
        <template v-for="(message, index) of messages" :key="index">
          <div class="flex gap-4 mb-8">
            <UAvatar v-if="message.from == 'ai'" alt="J" size="md" />
            <UAvatar v-else :alt="'You'" size="md" />
            <div>
              <div
                v-if="message.from == 'ai'"
                class="font-bold flex gap-2 items-center"
              >
                <p class="font-bold">J Sensei</p>
                <div v-if="audio && index === messages.length - 1">
                  <UButton
                    v-if="!audio.paused"
                    icon="i-heroicons-play-20-solid"
                    size="2xs"
                    variant="solid"
                    color="blue"
                    :square="false"
                    class="rounded-full p-1"
                    @click="
                      () => {
                        if (audio) audio.play();
                      }
                    "
                  />
                  <UButton
                    v-else
                    icon="i-heroicons-pause-20-solid"
                    size="2xs"
                    variant="solid"
                    color="blue"
                    :square="false"
                    class="rounded-full p-1"
                    @click="
                      () => {
                        if (audio) audio.pause();
                      }
                    "
                  />
                </div>
              </div>
              <p v-else class="font-bold">You</p>
              <p
                v-if="
                  index < messages.length ||
                  (index > messages.length && !isTyping)
                "
              >
                {{ message.message }}
              </p>
              <LoadingDots
                class="ml-4 mt-4"
                v-if="isTyping && index === messages.length - 1"
              />
            </div>
          </div>
        </template>
      </div>
    </UContainer>
    <div class="fixed w-screen bottom-0 left-0 pb-9">
      <UContainer class="max-w-screen-sm mx-auto">
        <UFormGroup name="text" class="mt-3 relative">
          <UInput
            variant="none"
            v-model="userInput"
            type="text"
            placeholder="Message sensei.."
            size="xl"
            class="bg-bg-gray-100 dark:bg-gray-900 dark:bg-opacity-90 rounded-lg py-1"
            :disabled="isTyping"
          >
          </UInput>

          <UButton
            v-if="userInput.length"
            class="absolute top-1 right-1"
            icon="i-heroicons-arrow-up-20-solid"
            size="lg"
            variant="solid"
            color="blue"
            square
            @click="sendMessage"
            @keyup.enter="sendMessage"
            :disabled="isTyping"
          />

          <Recorder
            class="absolute top-1 right-1"
            v-else
            @end-recording="transcribeRecording"
          />
        </UFormGroup>
      </UContainer>
    </div>
  </div>
</template>
../composables/chatListOwn../composables/chatSend../composables/tts
