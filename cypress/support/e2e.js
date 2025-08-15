// ***********************************************************
// This support file is loaded automatically before your tests.
// ***********************************************************

import './commands';
import './commands/session.commands';
import './commands/dom.commands';
import './commands/chatbot.utils';
import './commands/overlay.stable';
import './commands/block-ads';

Cypress.on('uncaught:exception', (err) => {
  const msg = (err && (err.message || err.toString())) || '';
  if (/SCARAB_OK_/i.test(msg)) return false;
  if (/Cannot read properties of undefined \(reading 'response'\)/i.test(msg)) return false;
});