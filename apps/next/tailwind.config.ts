import { type Config } from "tailwindcss";

import baseConfig from "@boidpaper/tailwind";

export default {
  darkMode: "class",
  theme: {},
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*"],
  presets: [baseConfig],
} satisfies Config;
