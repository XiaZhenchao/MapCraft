Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

//redeploy
describe('SplashScreen', () => {
  it('the SplashScreen contains the correct UI element', () => {
    cy.visit('https://mapcraft-55160ee4aae1.herokuapp.com/')
    cy.get('#splash-screen')
      .should("exist")
  })
})

describe('Login System', () => {
  it('should log in with valid credentials', () => {
    cy.visit('https://mapcraft-55160ee4aae1.herokuapp.com/login/');
    // Enter valid username and password
    cy.get('[name="email"]').type('a1149934007@gmail.com');
    cy.get('[name="password"]').type('12345678');

    // Click on the "Login" button
    cy.get('button[type="submit"]').click();

    // Check if the login was successful
    cy.url().should('include','https://mapcraft-55160ee4aae1.herokuapp.com');
    
    // Check if an element with ID "map-name" exists
cy.get('#map-name').should('exist');

// Check if an element with ID "export-close" exists
cy.get('#export-close').should('exist');

// Check if an element with ID "container" exists
cy.get('#container').should('exist');

// Check if an element with ID "function-bar" exists
cy.get('#function-bar').should('exist');


  });

});
describe('.MuiTypography-root', () => {
  it('check if the MUI typograph can be read or not ', () => {
    cy.visit('https://mapcraft-55160ee4aae1.herokuapp.com/')
    cy.get('.MuiTypography-root > a')
      .should("exist")
  })
})

describe('Password Recovery System', () => {
  it('should send a password reset email', () => {
    // Visit the password recovery page
    cy.visit('https://mapcraft-55160ee4aae1.herokuapp.com/forgot-password');

    cy.get('input[name="EmailAddress"]').type('a1149934007@gmail.com');
    cy.get('#SendLinkButton').click();
    cy.url().should('include','https://mapcraft-55160ee4aae1.herokuapp.com/login/');
  });
});

describe('Password Recovery System', () => {
  it('should send an invalid email and pop out error modal', () => {
    //Visit the password recovery page
    cy.visit('https://mapcraft-55160ee4aae1.herokuapp.com/forgot-password');

    cy.get('input[name="EmailAddress"]').type('a1149937@gmail.com');
   cy.get('#SendLinkButton').click();
   cy.get('.forgot-password-modal').should('be.visible');

 });
});
