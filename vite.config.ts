import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Um CSS só: o prerender embute ele inteiro no HTML (as seções carregadas depois já chegam estilizadas)
    cssCodeSplit: false,
  },
})
