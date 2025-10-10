import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),
  ],
   optimizeDeps: {
    include: ["react-hot-toast"]
  },
  resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
    "@app": path.resolve(__dirname, "./src/app"),
    "@modules": path.resolve(__dirname, "./src/modules"),
    "@components": path.resolve(__dirname, "./src/components"),
    "@services": path.resolve(__dirname, "./src/services"),
    "@utils": path.resolve(__dirname, "./src/utils")
  }
},server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

})



