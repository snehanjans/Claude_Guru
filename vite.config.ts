import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Absolute base so hashed asset URLs resolve from the site root on any nested
  // route (e.g. /recommend/program/:id). A relative "./" base breaks deep links
  // on Vercel because assets resolve against the current path and 404.
  base: '/',
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
