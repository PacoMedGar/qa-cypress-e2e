const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'reports/junit/results-[hash].xml',
    toConsole: true,
  },

  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    supportFile: 'cypress/support/e2e.js',
    chromeWebSecurity: false,
    viewportWidth: 1366,
    viewportHeight: 900,
    setupNodeEvents(on, config) {
      return config;
    },
  },

  env: {
    ORANGEHRM_USER: 'Admin',
    ORANGEHRM_PASS: 'admin123',
    CHATBOT_URL: 'https://estrellablanca.com.mx/',
  },

  downloadsFolder: 'cypress/downloads',
  defaultCommandTimeout: 12000,
  pageLoadTimeout: 60000,
});