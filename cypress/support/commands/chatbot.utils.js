// cypress/support/commands/chatbot.utils.js

// Busca el primer iframe que "parezca" de chatbot por src/title/clases comunes
Cypress.Commands.add('findChatbotIframe', () => {
  const rx = /(chat|bot|intercom|zendesk|tidio|drift|crisp|kommunicate|aivo|landbot|yellow|gupshup)/i;

  cy.get('iframe', { timeout: 15000 }).then($ifs => {
    const match = [...$ifs].find(el => {
      const src = el.getAttribute('src') || '';
      const title = el.getAttribute('title') || '';
      const cls = el.getAttribute('class') || '';
      return rx.test(src) || rx.test(title) || rx.test(cls);
    });
    expect(match, 'iframe de chatbot').to.exist;
    cy.wrap(match).as('chatIframe');
  });
});

// Obtiene src absoluto del iframe (y su origin)
Cypress.Commands.add('getIframeSrcAndOrigin', () => {
  cy.get('@chatIframe')
    .then($if => {
      const el = $if[0];
      const src = el.getAttribute('src') || el.src;     // intenta attr y prop
      expect(src, 'src del iframe').to.be.a('string').and.not.be.empty;

      const url = new URL(src, window.location.href);
      return { src: url.href, origin: url.origin };
    });
});

// Dado un array de selectores candidatos, retorna el primero que exista (o falla con mensaje útil)
Cypress.Commands.add('firstThatExists', (selectors = [], timeout = 10000) => {
  const tryNext = (i) => {
    if (i >= selectors.length) {
      throw new Error(`Ningún selector coincidió. Intentados:\n${selectors.join('\n')}`);
    }
    const sel = selectors[i];
    return cy.get('body').then($b => {
      const $found = $b.find(sel);
      if ($found.length) return cy.get(sel, { timeout }).first();
      return tryNext(i + 1);
    });
  };
  return tryNext(0);
});