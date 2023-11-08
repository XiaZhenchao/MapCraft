describe('SplashScreen', () => {
  it('the SplashScreen contains the correct UI element', () => {
   
    cy.get('#splash-screen')
      .should("exist")
    cy.wait(2000);
    cy.get('.MuiTypography-root > a')
      .should("exist")
    cy.wait(2000);
  })
})
