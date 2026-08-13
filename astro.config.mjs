import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://chomusuke.dev',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
