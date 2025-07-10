import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'sortablejs', '@vueuse/core'],
  },
  server: {
    port: 5173,
    strictPort: false,
  }
})
