import DashboardPage from '../../../pages/orangehrm/DashboardPage';
import MyInfoPage from '../../../pages/orangehrm/MyInfoPage';

describe('My Info - Personal Details (@write)', () => {
  it('Llena y guarda la información de Personal Details', () => {
    cy.loginOrange();

    const dash = new DashboardPage();
    dash.openMyInfo();

    const my = new MyInfoPage();
    my.assertOnPersonalDetails();

    cy.fixture('personal_details').then(pd => {
      const eid = 'E' + Date.now().toString().slice(-6);
      my.fillPersonalDetails({ ...pd, employeeId: eid, nationality: undefined, maritalStatus: undefined });

      my.selectFirstNationality();
      my.selectFirstMaritalStatus();

      my.saveFirstVisible();
    });
  });
});