import { defineConfig } from 'vite';
import path from 'path';

import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';

import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    viteMockServe({
      mockPath: 'mock',
      enable: true
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5173',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
});
