// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  /*
   * Canonical origin. Without this, Astro has no idea what host it is building
   * for, so `Astro.url` on a prerendered page falls back to the dev origin and
   * every og:/twitter: tag ships pointing at http://localhost:4321 — which
   * makes every social share preview on the site fail to resolve.
   */
  site: 'https://britnova.net',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
  adapter: netlify(),

  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      CONTACT_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'onboarding@resend.dev',
      }),
      RESEND_FROM: envField.string({
        context: 'server',
        access: 'secret',
        default: 'Britnova Contact Form <onboarding@resend.dev>',
      }),
    },
  },
});
