// controllers/WhatsappBot.js

const messageHandler = require('../services/messageHandler');

class WhatsappBot {
  constructor(client) {
    this.client = client;
  }

  async handleMessage(message) {
    try {
      const response = await messageHandler(message);
      if (response) {
        await this.sendMessage(message.from, response);
      }
    } catch (error) {
      console.error('Error handling message:', error);
      await this.sendMessage(message.from, 'Oops, something went wrong!');
    }
  }

  async sendMessage(to, message) {
    // Logic to send message using the WhatsApp API client
  }
}

module.exports = WhatsappBot;