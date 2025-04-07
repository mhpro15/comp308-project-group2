import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "authApp",
      filename: "remoteEntry.js",
      exposes: {
        "./AuthComponent": "./src/App.jsx",
      },
      remotes: {
        nurseApp: "http://localhost:3002/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom", "@apollo/client"],
    }),
  ],
  build: {
    modulePreload: false,
    outDir: "dist",
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
