<script setup lang="ts">
import { useState } from "nuxt/app";
import type server from "../server/types";

const user = useState<server.UserGetOwnResponse | null>("user");
</script>

<template>
  <SideBar />
  <h1>Homepage / Chat page</h1>
</template>
