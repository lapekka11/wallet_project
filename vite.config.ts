import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './frontend',
  server: {
    port: 3000,
    open: '/',
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'frontend/index.html')
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'frontend/src')
    }
  }
});