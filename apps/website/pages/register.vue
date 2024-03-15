<script setup lang="ts">
import { userCreate } from "../server/userCreate";
import { reactive, ref } from "vue";
import z from "zod";

const data = reactive({
  email: "",
  username: "",
  password: "",
  confirm: "",
});

const errors = reactive({
  email: "",
  username: "",
  password: "",
  confirm: "",
});

const formError = ref<string>("");
const success = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

const reset = () => {
  data.email = "";
  data.username = "";
  data.password = "";
  data.confirm = "";
};

const resetErrors = (): void => {
  errors.email = "";
  errors.username = "";
  errors.password = "";
  errors.confirm = "";
};

const validateInputs = (): boolean => {
  let isValid = true;

  const { success: emailIsValid } = z.string().email().safeParse(data.email);

  if (!emailIsValid) {
    errors.email = "Enter a valid email.";
    isValid = false;
  }

  const { success: usernameIsValid } = z
    .string()
    .min(5)
    .max(50)
    .refine(
      (value) => /^\w+$/.test(value),
      "Username should contain only alphanumeric characters."
    )
    .safeParse(data.username);

  if (!usernameIsValid) {
    errors.username = "Username should be atleast 5 alphanumeric characters.";

    isValid = false;
  }

  const { success: passwordIsValid } = z
    .string()
    .min(8)
    .safeParse(data.password);

  if (!passwordIsValid) {
    errors.password = "Password should be atleast 8 characters long.";

    isValid = false;
  }

  const passwordsMatch = data.password === data.confirm;

  if (!passwordsMatch) {
    formError.value = "Passwords must match";
    isValid = false;
  }

  return isValid;
};

const register = async (): Promise<void> => {
  if (isSubmitting.value) return;

  resetErrors();

  if (!validateInputs()) {
    formError.value = "Some of the inputs are incorrect.";

    return;
  }

  isSubmitting.value = true;

  try {
    const { error } = await userCreate({
      email: data.email,
      username: data.username,
      password: data.password,
    });

    if (error.value) return console.error(error.value);

    success.value = true;
    isSubmitting.value = false;
  } catch (e) {
    formError.value = "Something went wrong. Please try again later.";
    isSubmitting.value = false;
  }
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
    <div v-if="!success">
      <h1 class="text-4xl font-bold">Register</h1>
      <UAlert
        v-if="formError"
        class="mt-6"
        icon="i-heroicons-exclamation-circle"
        color="red"
        variant="subtle"
        title="Register Error"
        :description="formError"
      />
      <form>
        <div class="mt-6">
          <UFormGroup
            label="Email Address"
            name="emailAddress"
            class="mt-4"
            :error="errors.email"
          >
            <UInput
              variant="none"
              v-model="data.email"
              type="text"
              placeholder="Email Address"
              size="xl"
              class="bg-gray-50 rounded-lg"
              :disabled="isSubmitting"
            />
          </UFormGroup>

          <UFormGroup
            label="Username"
            name="username"
            class="mt-4"
            :error="errors.username"
          >
            <UInput
              variant="none"
              v-model="data.username"
              type="text"
              placeholder="Username"
              size="xl"
              class="bg-gray-50 rounded-lg"
              :disabled="isSubmitting"
            />
          </UFormGroup>

          <UFormGroup
            label="Password"
            name="password"
            class="mt-3"
            :error="errors.password"
          >
            <UInput
              variant="none"
              v-model="data.password"
              :type="passwordFieldType"
              placeholder="Password"
              size="xl"
              class="bg-gray-50 rounded-lg"
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

          <UFormGroup label="Confirm Password" name="confirm" class="mt-3">
            <UInput
              variant="none"
              v-model="data.confirm"
              type="password"
              placeholder="Confirm Password"
              size="xl"
              class="bg-gray-50 rounded-lg"
              :disabled="isSubmitting"
            />
          </UFormGroup>
        </div>

        <UButton
          class="mt-6 bg-gradient-to-r bg-blue-800 hover:bg-blue-700"
          block
          label="Create an account"
          variant="solid"
          size="xl"
          :disabled="isSubmitting"
          :loading="isSubmitting"
          @click="register"
        />
      </form>
      <p class="text-gray-500 mt-4">
        Already have an account?
        <NuxtLink class="text-black underline" to="/login">Sign-in</NuxtLink>
      </p>
    </div>
    <div v-else class="flex items-center justify-center">
      <p class="text-4xl font-bold text-center">Successfuly registered. 👍</p>
      <UButton
        class="mt-6 bg-gradient-to-r bg-blue-800 hover:bg-blue-700"
        block
        label="Sign In"
        trailing-icon="i-heroicons-chevron-right-20-solid"
        variant="ghost"
        size="xl"
        :disabled="isSubmitting"
        :loading="isSubmitting"
        to="/login"
        @click="register"
      />
    </div>
  </UContainer>
</template>
