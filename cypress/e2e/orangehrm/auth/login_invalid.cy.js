import LoginPage from '../../../pages/orangehrm/LoginPage';

describe('Login inválido - OrangeHRM', () => {
  it('Muestra "Invalid credentials" con password incorrecto', () => {
    const login = new LoginPage();

    login.visit();
    login.typeUsername('Admin');
    login.typePassword('wrongPass123!');
    login.submit();

    login.assertInvalidLogin();
    cy.url().should('include', '/auth/login');
  });
});