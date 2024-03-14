// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      serverPort: process.env.SERVER_PORT,
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://rsms.me/inter/inter.css",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
