import DashboardPage from '../../../pages/orangehrm/DashboardPage';
import MyInfoPage    from '../../../pages/orangehrm/MyInfoPage';

describe('My Info - Navegación (@nav)', () => {
  it('Valida menú, entra a My Info y obtiene "Personal Details" (sin editar)', () => {
    cy.loginOrange();

    const dash = new DashboardPage();
    dash.assertLoaded();
    dash.assertMenuHas(['Admin', 'PIM', 'Time', 'Recruitment', 'My Info', 'Performance', 'Dashboard']);

    dash.openMyInfo();

    const my = new MyInfoPage();
    my.assertOnPersonalDetails();
    my.getHeaderText().then((t) => {
      expect(t.trim()).to.eq('Personal Details');
    });
  });
});