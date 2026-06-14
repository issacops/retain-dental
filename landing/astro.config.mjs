import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://retaindental.com',
  base: '/',
  trailingSlash: 'never',
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
      filter: (page) => !page.includes('/blog/tags/'),
    }),
    mdx(),
    tailwind(),
  ],
  vite: {
    envPrefix: ['VITE_'],
    build: {
      rollupOptions: {
        external: [],
      },
    },
  },
  build: {
    format: 'directory',
  },
});
