import ChatbotPage from '../../pages/chatbot/ChatbotPage';

describe('Chatbot - Presencia del widget', () => {
  it('Encuentra el iframe del lanzador o el botón #open-button', () => {
    const bot = new ChatbotPage();
    bot.visitHome();
    bot.assertOnHome();

    bot.assertWidgetPresent();

    cy.document().then((doc) => {
      const hadIframe = !!doc.querySelector('#botlers-messaging-button-iframe');
      const hadButton = !!doc.querySelector('#open-button');
      cy.log(`launcher iframe: ${hadIframe}, launcher button: ${hadButton}`);
      expect(hadIframe || hadButton, 'algún lanzador presente').to.be.true;
    });
  });
});