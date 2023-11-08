describe('SplashScreen', () => {
  it('the SplashScreen contains the correct UI element', () => {
    cy.visit('https://mapcraft-55160ee4aae1.herokuapp.com/')
    cy.get('#splash-screen')
      .should("exist")
    cy.get('.MuiTypography-root > a')
      .should("exist")
  })
})