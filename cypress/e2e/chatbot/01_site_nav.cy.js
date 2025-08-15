import ChatbotPage from '../../pages/chatbot/ChatbotPage';

describe('Chatbot - Navegación al sitio', () => {
  it('Accede a la URL y valida el sitio correcto', () => {
    cy.wrap(null); 
    const bot = new ChatbotPage();
    bot.visitSite();
    bot.assertOnSite();
  });
});