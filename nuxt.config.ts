import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: true,
  },
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    },
  },
  nitro: {
    preset: 'netlify',
  },
});
