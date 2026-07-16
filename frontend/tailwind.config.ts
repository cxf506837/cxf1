import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#677083",
        line: "#dbe2ee",
        panel: "rgba(255, 255, 255, 0.78)"
      },
      boxShadow: {
        panel: "0 18px 60px rgba(42, 57, 89, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;

