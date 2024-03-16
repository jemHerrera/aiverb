<script setup lang="ts">
import type { Button } from "#ui/types";

export interface Props {
  startButton?: Button;
  startClass?: string;
  stopButton?: Button;
  stopClass?: string;
}

defineProps<Props>();

const emit = defineEmits(["end-recording"]);

const isSupported = ref<boolean>(false);
const isRecording = ref<boolean>(false);
const recorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<BlobPart[]>([]);

const error = ref<string>("");

function reset(): void {
  isSupported.value = false;
  recorder.value = null;
  audioChunks.value = [];
  error.value = "";
}

async function initialize() {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    isSupported.value = false;

    return;
  }

  isSupported.value = true;

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  recorder.value = new MediaRecorder(stream);

  recorder.value.ondataavailable = (event: BlobEvent) => {
    audioChunks.value.push(event.data);
  };

  recorder.value.onstop = () => {
    emit("end-recording", audioChunks.value);
  };
}

async function startRecording() {
  await initialize();

  if (isRecording.value || !recorder.value) return;

  isRecording.value = true;

  recorder.value.start();
}

function stopRecording() {
  if (!isRecording.value || !recorder.value) return;

  recorder.value.stop();

  isRecording.value = false;

  recorder.value = null;

  audioChunks.value = [];
}

onUnmounted(reset);
</script>

<template>
  <div>
    <template v-if="!isRecording">
      <slot name="start">
        <UButton
          :class="
            startClass ??
            'transition-all bg-gradient-to-br from-blue-700 to-violet-600 rounded-lg hover:scale-105'
          "
          trailing-icon="i-heroicons-microphone"
          variant="solid"
          size="lg"
          v-bind="startButton"
          @click="startRecording"
        />
      </slot>
    </template>

    <template v-else>
      <slot name="Stop Recording">
        <UButton
          :class="stopClass ?? 'rounded-lg animate-pulse'"
          color="red"
          trailing-icon="i-heroicons-stop-solid"
          variant="solid"
          size="lg"
          v-bind="stopButton"
          @click="stopRecording"
        />
      </slot>
    </template>
  </div>
</template>
