export default defineNuxtConfig({
  compatibilityDate: '2025-11-28',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  typescript: {
    typeCheck: false,
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Guitar Tuner',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Professional guitar tuner with real-time audio analysis' },
      ],
    },
  },
})
