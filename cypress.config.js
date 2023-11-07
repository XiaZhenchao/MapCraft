const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    supportFile: "test/cypress/support/e2e.js", 
    specPattern: "test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}" 
  },
});
