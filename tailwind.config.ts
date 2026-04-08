// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  important: "#root",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily:{
        kuro:["Kuro", "sans-serif"]
      }
    },
  },
  plugins: [],
};

export default config;