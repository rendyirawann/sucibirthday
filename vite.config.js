import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Situs di-serve dari https://rendyirawann.github.io/sucibirthday/
  base: '/sucibirthday/',
  plugins: [vue(), tailwindcss()],
})
