import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // Ensure CSS is not split into multiple files, keeping everything together
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunking to avoid missing CSS
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the chunk size warning limit
    minify: 'esbuild', // Use esbuild for minification, it's faster and might handle CSS better
  },
  css: {
    devSourcemap: true, // Enable source maps in development mode to debug any missing styles
  },
})
