import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/zoho-pitch-generator/', // ⚠️ Replace with YOUR repo name
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
})
