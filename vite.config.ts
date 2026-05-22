import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    cssMinify: true,
    minify: 'esbuild',
  },
  server: {
    host: true,
    port: 5173,
  },
});
