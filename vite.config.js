import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: '@vue/compat',
      '@': path.resolve(__dirname, './src'), // map '@' to './src'
    },
  },
})
