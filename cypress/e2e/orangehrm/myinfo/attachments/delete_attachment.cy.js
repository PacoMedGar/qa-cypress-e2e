import DashboardPage from '../../../../pages/orangehrm/DashboardPage';
import MyInfoPage    from '../../../../pages/orangehrm/MyInfoPage';

describe('My Info - Attachments - Delete (@attachments)', () => {
  it('Elimina un adjunto', () => {
    cy.loginOrange();

    const dash = new DashboardPage();
    dash.openMyInfo();

    const my = new MyInfoPage();
    my.assertOnPersonalDetails();
    my.goToAttachments();

    const comment = `QA delete ${Date.now()}`;

    my.addAttachment('cypress/fixtures/sample.png', comment);

    my.deleteAttachmentByComment(comment);
  });
});
