import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://dividend01.com',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
