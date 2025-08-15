import LoginPage from '../../pages/orangehrm/LoginPage';

Cypress.Commands.add('loginOrange', (user = Cypress.env('ORANGEHRM_USER'), pass = Cypress.env('ORANGEHRM_PASS')) => {
  cy.session([user, pass], () => {
    const login = new LoginPage();
    login.visit();
    login.typeUsername(user);
    login.typePassword(pass);
    login.submit();
    cy.url().should('include', '/dashboard');
  });

  cy.visit('/web/index.php/dashboard/index');
});