import DashboardPage from '../../../pages/orangehrm/DashboardPage';

describe('Auth - Logout (@logout)', () => {

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (/reading 'response'/.test(err.message)) {
        return false;
      }
    });
  });

  it('Hace logout desde el dashboard y vuelve a la pantalla de login', () => {
    cy.loginOrange();

    const dash = new DashboardPage();
    dash.assertOnDashboard();

    dash.logout(); 
  });
});