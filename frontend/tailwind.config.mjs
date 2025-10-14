/** @type {import('tailwindcss').Config} */
import hero from "./src/app/hero.ts";

export default {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}"
  ],
  theme: { extend: {},
    container: { center: true, padding: "1.5rem", screens: { sm:"100%", md:"100%", lg:"100%", xl:"100%", "2xl":"100%" } },
  },
  plugins: [hero],
};
