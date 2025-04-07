import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "nurseApp",
      filename: "remoteEntry.js", // remote exposed file
      exposes: {
        "./NurseAppComponent": "./src/NurseAppComponent",
      },
      shared: ["react", "react-dom", "@apollo/client", "lucide-react"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    outDir: "dist",
    minify: false,
    cssCodeSplit: false,
  },
});
