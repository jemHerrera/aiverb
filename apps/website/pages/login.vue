<script setup lang="ts">
import { reactive, ref } from "vue";
import { useCookie, navigateTo } from "nuxt/app";
import { userLogin } from "../server/userLogin";
import type server from "../server/types";

const data = reactive({
  email: "",
  password: "",
});

const error = ref<string>("");
const isSubmitting = ref<boolean>(false);

const login = async (): Promise<void> => {
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  const { data: response, error: err } = await userLogin({
    email: data.email,
    password: data.password,
  });

  if (err.value) {
    error.value = "Incorrect credentials.";
    isSubmitting.value = false;
    return;
  }

  const { sessionToken } = response.value as server.UserLoginResponse;

  const sessionCookie = useCookie("aiverb-session", {
    maxAge: 60 * 60 * 60 * 24 * 2, // 2 days, in seconds
  });

  sessionCookie.value = sessionToken;

  isSubmitting.value = false;

  await navigateTo("/");
};

const reset = () => {
  data.email = "";
  data.password = "";
  error.value = "";
  isSubmitting.value = false;
};

const passwordFieldType: Ref<"password" | "text"> = ref("password");

const passwordFieldButtonIcon = computed(() => {
  if (passwordFieldType.value === "password") return "i-heroicons-eye";
  else return "i-heroicons-eye-slash";
});

const togglePasswordFieldType = function () {
  if (passwordFieldType.value === "password") {
    passwordFieldType.value = "text";
  } else {
    passwordFieldType.value = "password";
  }
};

onUnmounted(reset);
</script>

<template>
  <UContainer
    class="max-w-screen-sm mx-auto flex flex-col justify-center min-h-screen"
  >
    <h1 class="text-4xl font-bold">Login</h1>
    <UAlert
      v-if="error"
      class="mt-6"
      icon="i-heroicons-exclamation-circle"
      color="red"
      variant="subtle"
      title="Sign In Error"
      :description="error"
    />
    <form>
      <div class="mt-6">
        <UFormGroup label="Email Address" name="emailAddress" class="mt-4">
          <UInput
            variant="none"
            v-model="data.email"
            type="text"
            placeholder="Email Address"
            size="xl"
            class="bg-gray-100 rounded-lg"
            :disabled="isSubmitting"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="mt-3">
          <UInput
            variant="none"
            v-model="data.password"
            :type="passwordFieldType"
            placeholder="Password"
            size="xl"
            class="bg-gray-100 rounded-lg"
            :disabled="isSubmitting"
          >
            <template #trailing> &nbsp; </template>
          </UInput>

          <UButton
            class="absolute top-1 right-2"
            :icon="passwordFieldButtonIcon"
            size="md"
            variant="link"
            color="gray"
            square
            @click="togglePasswordFieldType"
          />
        </UFormGroup>
      </div>
      <UButton
        class="mt-6 bg-gradient-to-r bg-blue-800 hover:bg-blue-700"
        block
        label="Sign In"
        trailing-icon="i-heroicons-chevron-right-20-solid"
        variant="solid"
        size="xl"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        @click="login"
      />
    </form>
    <p class="text-gray-500 mt-4">
      Don't have account yet?
      <NuxtLink class="text-black underline" to="/register">Register</NuxtLink>
    </p>
  </UContainer>
</template>
