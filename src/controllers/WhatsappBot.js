// controllers/WhatsappBot.js
const MessageHandler = require('../services/MessageHandler');

class WhatsappBot {
  constructor(client) {
    this.client = client;
    this.messageHandler = new MessageHandler();

    // Event listeners for incoming messages
    this.client.on('message', (message) => this.handleMessage(message));
  }

  async handleMessage(message) {
    if (message.fromMe) return; // Ignore messages sent by the bot itself

    const response = await this.messageHandler.processMessage(message);
    if (response) {
      await this.sendMessage(message.from, response);
    }
  }

  async sendMessage(to, message) {
    try {
      await this.client.sendMessage(to, message);
    } catch (error) {
      console.error(`Error sending message: ${error}`);
      // Implement error handling, e.g., logging or retrying
    }
  }
}

module.exports = WhatsappBot;