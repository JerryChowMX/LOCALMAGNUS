import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:1337',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api') // Requests to /api/foo -> http://localhost:1337/api/foo
      }
    }
  }
})
