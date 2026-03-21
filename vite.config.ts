// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This tells Vite to prefix all asset paths with your repository name
  base: '/jenkins-modernizer-stats/', 
})