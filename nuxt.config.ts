// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  modules: ['@nuxt/icon', '@nuxt/ui', 'nuxt-monaco-editor', '@nuxt/fonts'],
  runtimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BLOB_PUBLIC_URL: process.env.BLOB_PUBLIC_URL,
  },
    nitro: {
      //preset: 'bun',
      storage: {
          //TODO Cleanup for vercel blob and fs
          avatars: {
              driver: process.env.BLOB_ACCESS_KEY ? 's3' : 'fs',
              access: 'public',
              base: "avatars",

              accessKeyId: process.env.BLOB_ACCESS_KEY,
              secretAccessKey: process.env.BLOB_SECRET_KEY,
              endpoint: process.env.BLOB_ENDPOINT,
              bucket: process.env.BLOB_BUCKET,
              region: 'auto'
          }
      }
    },
    ui: {
        theme: {
            colors: ['green', 'yellow', 'orange', 'red', 'error']
        }
    }
});