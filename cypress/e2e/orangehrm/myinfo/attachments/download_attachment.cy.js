// cypress/e2e/orangehrm/myinfo/attachments/download_attachment.cy.js
import DashboardPage from '../../../../pages/orangehrm/DashboardPage';
import MyInfoPage    from '../../../../pages/orangehrm/MyInfoPage';

describe('My Info - Attachments - Download (@attachments)', () => {
  it('Descarga un adjunto por comentario', () => {
    cy.loginOrange();

    const dash = new DashboardPage();
    dash.openMyInfo();

    const my = new MyInfoPage();
    my.assertOnPersonalDetails();

    cy.intercept('GET', /\/api\/v2\/pim\/employees\/\d+\/screen\/personal\/attachments/).as('listAttach');
    my.goToAttachments();

    const comment = `QA download ${Date.now()}`;
    my.addAttachment('cypress/fixtures/sample.png', comment);
    cy.wait('@listAttach').its('response.statusCode').should('eq', 200);
    cy.contains('.oxd-table-card, .oxd-table-row', comment, { timeout: 15000 }).should('be.visible');

    my.downloadAttachmentByComment(comment);
  });
});