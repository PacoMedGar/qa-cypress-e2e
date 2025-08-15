
Cypress.Commands.add('closeAnyOverlayStable', (options = {}) => {
  const limit = options.timeout || 15000;
  const start = Date.now();

  const tryCloseOnce = () => cy.document({ log: false }).then((doc) => {
    const win = doc.defaultView || window;
    const clickIf = (sel) => {
      const el = doc.querySelector(sel);
      if (el) el.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true }));
    };

    ['#wps-overlay-close-button', '[data-wps-popup-close]', '[data-wps-popup-close-intent]']
      .forEach(clickIf);


    const modal = doc.querySelector('[data-wps-popup-content]');
    if (modal) modal.style.display = 'none';
  });

  const loop = () => {
    if (Date.now() - start > limit) return;
    return tryCloseOnce().then(() => cy.wait(400, { log: false }).then(loop));
  };

  return cy.window({ log: false }).then((win) => {
    let active = true;
    const mo = new win.MutationObserver(() => {
      if (!active) return;
      const closeBtn = win.document.querySelector('#wps-overlay-close-button,[data-wps-popup-close],[data-wps-popup-close-intent]');
      const modal = win.document.querySelector('[data-wps-popup-content]');
      if (closeBtn) closeBtn.click();
      if (modal) modal.style.display = 'none';
    });
    mo.observe(win.document.body, { childList: true, subtree: true });

    return loop().then(() => { active = false; mo.disconnect(); });
  });
});