import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
//
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "shellApp",
      remotes: {
        authApp: "http://localhost:3001/assets/remoteEntry.js",
        nurseApp: "http://localhost:3002/assets/remoteEntry.js",
        patientApp: "http://localhost:3003/assets/remoteEntry.js",
      },
      shared: ["react", "react-dom", "@apollo/client"],
    }),
  ],
  build: {
    target: "esnext",
    outDir: "dist",
  },
});
