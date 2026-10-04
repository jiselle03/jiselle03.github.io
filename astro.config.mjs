import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jiselleliu.com',
  output: 'static',
  vite: {
    server: {
      hmr: {
        host: 'localhost',
        port: 3000,
      },
      watch: {
        usePolling: true,
        interval: 120,
      },
    },
  },
  build: {
    assets: 'assets',
  },
});
