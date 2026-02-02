import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './frontend',
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'frontend/src')
    }
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, 'frontend/src/home.html')
    }
  }
});