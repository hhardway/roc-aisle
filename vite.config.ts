import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages project sites need the repo name as base path.
const base = process.env.GITHUB_PAGES === "true" ? "/roc-aisle/" : "/";

export default defineConfig({
  plugins: [react()],
  base,
});
