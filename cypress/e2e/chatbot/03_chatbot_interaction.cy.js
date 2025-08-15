import ChatbotPage from '../../pages/chatbot/ChatbotPage';

describe('Chatbot - Interacción del launcher', () => {
  it('Abre el widget si hay botón y obtiene el nombre del bot (best-effort)', () => {
    cy.wrap(null);
    const bot = new ChatbotPage();
    bot.visitHome();

    bot.assertWidgetPresent(); 
    bot.openWidget();          
    bot.assertWidgetOpened();

    bot.getBotTitle().then((title) => {
      expect(String(title)).to.match(/bot/i);
      cy.log(`Título del bot: ${title}`);
    });
  });
});