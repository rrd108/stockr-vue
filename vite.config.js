import { defineConfig } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  //plugins: [vue()],
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      vue: '@vue/compat',
      '@': path.resolve(__dirname, './src'), // map '@' to './src'
    },
  },
})
