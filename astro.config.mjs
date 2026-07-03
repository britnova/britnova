// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react()],
  adapter: vercel(),

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