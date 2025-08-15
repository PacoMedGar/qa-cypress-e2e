import sel from '../../selectors/orangehrm/login.sel';

export default class LoginPage {
  visit() { cy.visit('/web/index.php/auth/login'); }

  typeUsername(user) {
    cy.get(sel.username).clear().type(user);
  }

  typePassword(pass) {
    cy.get(sel.password).clear().type(pass, { log: false });
  }

  submit() { cy.get(sel.submit).click(); }

  assertInvalidLogin() {

    cy.get(sel.errorContainer, { timeout: 10000 }).should('be.visible');

    cy.contains(sel.errorText, 'Invalid credentials', { timeout: 10000 })
      .should('be.visible');
  }
}