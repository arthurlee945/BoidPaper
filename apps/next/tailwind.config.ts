import { type Config } from "tailwindcss";

import baseConfig from "@repo/tailwind";

export default {
  darkMode: "class",
  theme: {},
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*"],
  presets: [baseConfig],
} satisfies Config;
