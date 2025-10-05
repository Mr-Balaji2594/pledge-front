import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "url";
import { dirname } from "path";
export default defineConfig(({ mode }) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const env = loadEnv(mode, __dirname);
  return {
    plugins: [react()],
    base: mode === "production" ? "/" : "/",
    define: {
      "process.env": env,
    },
    server: {
      port: 5173,
      open: true,
    },
    preview: {
      port: 5173,
      open: true,
    },
  };
});
