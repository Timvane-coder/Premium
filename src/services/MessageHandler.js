// services/MessageHandler.js
const messageTemplates = require('../utils/messageTemplates');

class MessageHandler {
  constructor() {
    this.commands = {
      'hi': this.handleGreeting,
      'help': this.handleHelp,
      // Add more commands as needed
    };
  }

  async processMessage(message) {
    const command = this.extractCommand(message.body);

    if (command && this.commands[command]) {
      return await this.commands[command](message);
    } else {
      // Default response or unrecognized command handling
      return messageTemplates.defaultResponse;
    }
  }

  extractCommand(message) {
    // Logic to extract the command from the message body
    // For example, assuming commands start with "!", you can use:
    const parts = message.trim().split(' ');
    return parts.length > 0 && parts[0].startsWith('!') ? parts[0].slice(1) : null;
  }

  // Command handlers
  async handleGreeting(message) {
    return messageTemplates.greeting;
  }

  async handleHelp(message) {
    return messageTemplates.help;
  }

  // ... other command handlers
}

module.exports = MessageHandler;