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
      colors: {
        a1: "#F7F7F7",
        a2: "#AFB1B3",
        a3: "#59656F",
        a4: "#363C42",
        a5: "#000000",
        b1: "#4435a1",
        b2: "#dfddef",
        c1: "#9ec445",
        c2: "#deebc1",
        d1: "#F5993D",
        d2: "#FBDDBE",
        gra1: {
          from: "#332879",
          to: "#4D3BB5",
        },
        b: {
          "50": "#f6f6fb",
          "100": "#DFDDEF",
          "200": "#B4AED9",
          "300": "#8F86C7",
          "400": "#695DB4",
          "500": "#4435A1", // b1
          "600": "#342493",
          "700": "#362A81",
          "800": "#292061",
          "900": "#1B1540",
          "950": "#0E0B20",
        },
        c: {
          "50": "#f6faeb",
          "100": "#ecf4d3",
          "200": "#deebc1", // c2
          "300": "#bfda7c",
          "400": "#9ec445", // c1
          "500": "#88ad35",
          "600": "#698a26",
          "700": "#506a21",
          "800": "#41551f",
          "900": "#38481f",
          "950": "#1c270c",
        },
        d: {
          "50": "#fef8ee",
          "100": "#feefd6",
          "200": "#fbddbe", // d2
          "300": "#f9c078",
          "400": "#f5993d", // d1
          "500": "#f27f1d",
          "600": "#e36413",
          "700": "#bd4c11",
          "800": "#963c16",
          "900": "#793415",
          "950": "#411809",
        },
      },
    },
  },
};

export default TailwindConfig;
