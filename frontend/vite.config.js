import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const googleAuthHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: googleAuthHeaders,
  },
  preview: {
    headers: googleAuthHeaders,
  },
})
