import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://dividend01.com',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
