import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: ["portal.html", "ava-page.html"],
      output: {
        sanitizeFileName(name) {
          return name.replace(/\s+/g, "");
        },
      },
    },
  },
});
