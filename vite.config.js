import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/lipstick': {
        target: 'http://127.0.0.1:5678',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/lipstick/, '/lipstick-try-on'),
        timeout: 600000, 
        proxyTimeout: 600000
      }
    }
  }
})
