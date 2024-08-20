import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Manually split large chunks
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Splits node_modules into a separate chunk
          }
        },
      },
    },
    chunkSizeWarningLimit: 600, // Adjust the warning limit for chunk sizes
  },
})
