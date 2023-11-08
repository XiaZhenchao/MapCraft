Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

describe('SplashScreen', () => {
  it('the SplashScreen contains the correct UI element', () => {
    cy.visit('https://mapcraft-55160ee4aae1.herokuapp.com/')
    cy.get('#splash-screen')
      .should("exist")
  })
})

describe('.MuiTypography-root', () => {
  it('check if the MUI typograph can be read or not ', () => {
    cy.visit('https://mapcraft-55160ee4aae1.herokuapp.com/')
    cy.get('.MuiTypography-root > a')
      .should("exist")
  })
})
