import { type Config } from "tailwindcss";
import defaultColors from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";

import { colors } from "./defaults/colors";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      ...fontFamily,
      sans: ["Geist", "sans-serif", ...fontFamily.sans],
    },
    colors: {
      inherit: defaultColors.inherit,
      current: defaultColors.current,
      transparent: defaultColors.transparent,
      black: colors.neutral[950],
      white: colors.neutral[100],
      red: defaultColors.red,
      amber: defaultColors.amber,
      yellow: defaultColors.yellow,
      purple: defaultColors.purple,
      ...colors,
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
} satisfies Config;

//------------------------------------------------
//example tailwind.config.ts
//Preflight: https://tailwindcss.com/docs/preflight
//preflightCSS: https://unpkg.com/tailwindcss@3.3.3/src/css/preflight.css

// import type { Config } from "tailwindcss";
// import baseConfig from "@kp/tailwind-config";

// export default {
//   content: ["./src/**/*.{ts,tsx}"],
//   presets: [baseConfig],
// } satisfies Config;
//-----------------------------------------------
//example postcss.config.js
//// @ts-expect-error - No types for postcss
//module.exports = require("@kp/tailwind-config/postcss");
