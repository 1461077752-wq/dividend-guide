import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://www.dividend01.com',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
