describe('Login válido - OrangeHRM', () => {
  it('Accede correctamente al dashboard', () => {
    cy.intercept('GET', '/web/index.php/api/v2/dashboard/shortcuts').as('shortcuts');
    cy.loginOrange();
    cy.wait('@shortcuts');

    cy.location('pathname', { timeout: 10000 })
      .should('match', /\/dashboard(\/index)?$/);

    cy.get('h6.oxd-text--h6', { timeout: 10000 })
      .scrollIntoView()
      .should('be.visible')
      .invoke('text')
      .then(t => expect(t.trim()).to.eq('Dashboard'));

    cy.get('div.oxd-layout-context', { timeout: 10000 }).should('be.visible');
  });
});