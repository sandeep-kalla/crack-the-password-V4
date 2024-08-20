import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // Keep all CSS in one file
    minify: false,       // Disable minification to see if it’s causing the issue
  },
})
