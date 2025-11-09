// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import path from 'path'

import pagefind from "astro-pagefind";
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://localhost:4321',

  vite: {
      plugins: [tailwindcss()],
      resolve: {
          alias: {
              '@': path.resolve('./src'),
          }
      }
  },

  integrations: [sitemap(), mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
          themes: {
              light: 'catppuccin-latte',
              dark: 'tokyo-night',
          },
      }
      }), react(), keystatic(), pagefind()],

  adapter: vercel(),
});