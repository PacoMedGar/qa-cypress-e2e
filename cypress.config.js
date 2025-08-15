const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://estrellablanca.com.mx',
    supportFile: 'cypress/support/e2e.js',
    chromeWebSecurity: false,                 // permite iframes de 3ros
    experimentalSessionAndOrigin: true,       // habilita cy.origin
    viewportWidth: 1366,
    viewportHeight: 900,
    setupNodeEvents(on, config) { return config; }
  },
  env: {
    CHATBOT_URL: 'https://estrellablanca.com.mx/'
  },
  defaultCommandTimeout: 12000,
  pageLoadTimeout: 60000
});