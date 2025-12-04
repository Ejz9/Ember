// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  modules: ['@nuxt/icon', '@nuxt/ui', 'nuxt-monaco-editor'],
  runtimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  },
    nitro: {
      //preset: 'bun',
      storage: {
          //TODO Cleanup for vercel blob and fs
          avatars: {
              driver: process.env.NODE_ENV === 'production' ? 'vercel-blob' : 'fs',
              access: 'public',
              base: "./public/uploads/avatars"
          }
      }
    },
    ui: {
        theme: {
            colors: ['green', 'yellow', 'orange', 'red', 'error']
        }
    }
});