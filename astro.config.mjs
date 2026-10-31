import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://fynxlab.com',
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
});
