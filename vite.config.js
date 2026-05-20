import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://16.171.2.115:8080', changeOrigin: true },
      '/uploads': { target: 'http://16.171.2.115:8080', changeOrigin: true },
    },
  },
})
