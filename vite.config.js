import { defineConfig } from 'vite'
import createVuePlugin from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  //plugins: [vue()],
  plugins: [
    createVuePlugin({
      template: {
        compilerOptions: {
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
  ],
  resolve: {
    alias: {
      vue: '@vue/compat',
      '@': path.resolve(__dirname, './src'), // map '@' to './src'
    },
  },
})
