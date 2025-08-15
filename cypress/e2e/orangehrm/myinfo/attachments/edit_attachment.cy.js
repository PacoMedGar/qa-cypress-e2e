// cypress/e2e/orangehrm/myinfo/attachments/edit_attachment.cy.js
import DashboardPage from '../../../../pages/orangehrm/DashboardPage';
import MyInfoPage    from '../../../../pages/orangehrm/MyInfoPage';

describe('My Info - Attachments - Edit (@attachments)', () => {
  it('Edita el comentario de un adjunto', () => {
    cy.loginOrange();

    const dash = new DashboardPage();
    dash.openMyInfo();

    const my = new MyInfoPage();
    my.assertOnPersonalDetails();

    cy.intercept('GET', /\/api\/v2\/pim\/employees\/\d+\/screen\/personal\/attachments/).as('listAttach');

    my.goToAttachments();
    const comment1 = `QA edit seed ${Date.now()}`;
    my.addAttachment('cypress/fixtures/sample.png', comment1);

    cy.wait('@listAttach').its('response.statusCode').should('eq', 200);
    cy.contains('.oxd-table-card, .oxd-table-row', comment1, { timeout: 15000 })
      .should('be.visible');

    cy.intercept('GET', /\/screen\/personal\/attachments/).as('listAfterEdit');


    const comment2 = `QA edited ${Date.now()}`;
    my.editAttachmentComment(comment1, comment2);

    cy.wait('@listAfterEdit').its('response.statusCode').should('eq', 200);

    cy.contains('.oxd-table-card, .oxd-table-row', comment2, { timeout: 15000 })
      .as('editedRow');
    cy.get('@editedRow').should('be.visible');

    cy.contains('.oxd-table-card, .oxd-table-row', comment1).should('not.exist');
  });
});