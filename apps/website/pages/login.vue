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
  <div class="page-login max-w-screen-sm mx-auto">
    <h1>Login</h1>
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
            v-model="data.email"
            type="text"
            placeholder="Email Address"
            size="xl"
            :disabled="isSubmitting"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password" class="mt-3">
          <UInput
            v-model="data.password"
            :type="passwordFieldType"
            placeholder="Password"
            size="xl"
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
        class="bg-gradient-to-r from-gra1-from to-gra1-to hover:to-gra1-from hover:from-gra1-to"
        block
        label="Sign In"
        trailing-icon="i-heroicons-chevron-right"
        variant="solid"
        size="xl"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        @click="login"
      />
    </form>
    <p>Don't have account yet? <NuxtLink to="/register">Register</NuxtLink></p>
  </div>
</template>
