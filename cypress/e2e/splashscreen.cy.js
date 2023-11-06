describe('SplashScreen', () => {
  it('the SplashScreen contains the correct UI element', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#splash-screen')
      .should("exist")
    cy.get('.MuiTypography-root > a')
      .should("exist")
  })
})