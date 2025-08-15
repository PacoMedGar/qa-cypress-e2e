
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
Cypress.Commands.add('selectFromDropdownByLabel', (labelText, optionText) => {

  cy.getGroupByLabel(labelText).find('div.oxd-select-text').click({ force: true });

  const safe = escapeRegExp(String(optionText).trim());


  cy.get('div[role="listbox"], .oxd-select-dropdown', { timeout: 10000 })
    .should('be.visible')
    .within(() => {
      cy.contains('div[role="option"], .oxd-select-option', new RegExp(`^${safe}$`, 'i'), { timeout: 10000 })
        .scrollIntoView()
        .click({ force: true })
        .then({ timeout: 0 }, () => null) 

      cy.get('div[role="option"], .oxd-select-option').then($opts => {
        const match = [...$opts].find(el => el.innerText.trim().toLowerCase() === String(optionText).trim().toLowerCase());
        if (match) cy.wrap(match).scrollIntoView().click({ force: true });
      });
    });
});