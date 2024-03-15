import type { Config } from "tailwindcss";

const TailwindConfig: Partial<Config> = {
  content: ["./pages/*.vue", "./components/*.vue"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var"],
      },
      aspectRatio: {
        auto: "auto",
        square: "1 / 1",
        video: "16 / 9",
      },
    },
  },
};

export default TailwindConfig;
