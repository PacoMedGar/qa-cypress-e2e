
const escapeRegExp = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default class DashboardPage {
  // Verifica que estoy en el dashboard
  assertLoaded() {
    const u = Cypress.env('ORANGEHRM_USER') || 'Admin';
    const p = Cypress.env('ORANGEHRM_PASS') || 'admin123';

    cy.location('pathname', { timeout: 10000 }).then((path) => {
      if (/\/auth\/login$/.test(path)) {
        // Si por cualquier razón estamos en login, inicia sesión por UI
        cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible').clear().type(u);
        cy.get('input[name="password"]').clear().type(p, { log: false });
        cy.get('button[type="submit"]').click();
      } else if (!/\/dashboard(\/index)?$/.test(path)) {
        // Si no es login ni dashboard, ve al dashboard
        cy.visit('/web/index.php/dashboard/index');
      }
    });

    cy.location('pathname', { timeout: 15000 }).should('match', /\/dashboard(\/index)?$/);
    cy.contains('h6', /\bDashboard\b/i, { timeout: 15000 }).should('be.visible');
  }

  assertOnDashboard() {
    cy.location('pathname', { timeout: 10000 }).should('match', /\/dashboard(\/index)?$/);
    cy.contains('h6', /\bDashboard\b/i, { timeout: 10000 }).should('be.visible');
  }

  assertMenuHas(items = []) {
    cy.get('aside', { timeout: 10000 }).within(() => {
      items.forEach((txt) => {
        const rx = new RegExp(`^${escapeRegExp(String(txt))}$`, 'i');
        cy.contains('span.oxd-main-menu-item--name', rx, { timeout: 10000 })
          .should('be.visible');
      });
    });
  }

  openMenuItem(text) {
    const rx = new RegExp(`^${escapeRegExp(String(text))}$`, 'i');
    cy.get('aside', { timeout: 10000 }).within(() => {
      cy.contains('span.oxd-main-menu-item--name', rx, { timeout: 10000 })
        .should('be.visible')
        .closest('a.oxd-main-menu-item')
        .click({ force: true });
    });
  }
  // Abrir MyInfo
  openMyInfo() {
    this.openMenuItem('My Info');
    cy.location('pathname', { timeout: 10000 }).should('include', '/pim/viewPersonalDetails');
  }

  openUserMenu() {
    cy.get('header .oxd-topbar-header-userarea', { timeout: 10000 })
      .find('.oxd-userdropdown-name, .oxd-userdropdown')
      .first()
      .click({ force: true });

    cy.get('body').then(($b) => {
      const opened = $b.find('.oxd-dropdown-menu, .oxd-userdropdown-link').length > 0;
      if (!opened) {
        cy.get('header .oxd-topbar-header-userarea')
          .find('.oxd-userdropdown-name, .oxd-userdropdown')
          .first()
          .click({ force: true });
      }
    });
  }

  // Logout
  logout() {
    this.openUserMenu();
    cy.contains('a, button, .oxd-userdropdown-link', /(Logout|Cerrar sesión)/i, { timeout: 10000 })
      .should('be.visible')
      .as('logout');

    cy.get('@logout').click({ force: true });

    cy.location('pathname', { timeout: 15000 }).should('include', '/auth/login');
    cy.get('input[name="username"]', { timeout: 10000 }).should('be.visible');
  }
}