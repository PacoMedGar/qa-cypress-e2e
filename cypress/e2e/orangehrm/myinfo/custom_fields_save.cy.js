import DashboardPage from '../../../pages/orangehrm/DashboardPage';
import MyInfoPage from '../../../pages/orangehrm/MyInfoPage';

describe('My Info - Custom Fields (@write)', () => {
  it('Llena y guarda Blood Type y Test_Field', () => {
    cy.loginOrange();

    const dash = new DashboardPage();
    dash.openMyInfo();

    const my = new MyInfoPage();
    my.assertOnPersonalDetails();

    my.goToCustomFields();
    my.setBloodType('O+');             
    my.setTestField('Valor de prueba');
    my.saveCustomFields();             
  });
});