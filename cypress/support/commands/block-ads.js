
Cypress.Commands.add('blockOverlayAds', () => {

  cy.intercept('GET', /webchannel-content\.eservice\.emarsys\.net\/customer\/.*\/campaigns/i, {
    statusCode: 204,
    body: '',
  }).as('blkEmarsysCampaigns');


  cy.intercept('GET', /webchannel-widget\.eservice\.emarsys\.net\/widget/i, {
    statusCode: 204,
    body: '',
  }).as('blkEmarsysWidget');
});


Cypress.Commands.add('hideOverlayWithCSS', () => {
  cy.document({ log: false }).then((doc) => {
    const style = doc.createElement('style');
    style.setAttribute('data-test', 'hide-emarsys');
    style.innerHTML = `
      [data-wps-popup-content],
      [data-wps-popup-close],
      #wps-overlay-close-button { display: none !important; visibility: hidden !important; }
    `;
    doc.head.appendChild(style);
  });
});