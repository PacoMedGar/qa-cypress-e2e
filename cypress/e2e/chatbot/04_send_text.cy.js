import ChatbotPage from '../../pages/chatbot/ChatbotPage';

describe('Chatbot - Enviar texto', () => {
  it('Escribe "Hola" y lo envía (limitación cross-origin documentada)', () => {
    cy.wrap(null);
    const bot = new ChatbotPage();
    bot.visitHome();

    bot.assertWidgetPresent();
    bot.openWidget();
    bot.sendMessage('Hola');   
    bot.assertWidgetOpened();
  });
});