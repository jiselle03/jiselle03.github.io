import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jiselleliu.com',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
