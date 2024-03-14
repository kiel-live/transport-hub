// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Transport hub',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
  runtimeConfig: {
    dbUrl: 'postgres://postgres:postgres@localhost:5432',
  },
  nitro: {
    experimental: {
      tasks: true,
    },
  },
  ignore: ['**/*/postgres-data'],
});
