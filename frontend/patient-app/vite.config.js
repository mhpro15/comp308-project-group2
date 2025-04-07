import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "patientApp",
      filename: "remoteEntry.js", // 👈 exposes this entry to shell
      exposes: {
        "./PatientDashboard": "./src/components/PatientDashboard.jsx",
      },
      shared: ["react", "react-dom", "@apollo/client"],
    }),
  ],
  build: {
    target: "esnext",
    outDir: "dist", // ✅ Default output folder for Azure
  },
});
