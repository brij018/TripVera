import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      '@firebase/app',
      'firebase/app',
      '@firebase/auth',
      'firebase/auth',
      '@firebase/firestore',
      'firebase/firestore',
    ],
  },
})
