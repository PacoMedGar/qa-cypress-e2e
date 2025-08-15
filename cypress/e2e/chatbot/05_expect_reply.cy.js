import ChatbotPage from '../../pages/chatbot/ChatbotPage';

describe('Chatbot - Recibir respuesta (señal de backend)', () => {
  it('Intercepta actividad del bot y la valida', () => {
    cy.wrap(null);
    const bot = new ChatbotPage();
    bot.visitHome();

    bot.assertWidgetPresent();
    bot.openWidget();
    bot.assertAnyReply(); 
  });
});