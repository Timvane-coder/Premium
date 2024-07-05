// index.js
require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const WhatsappBot = require('./controllers/WhatsappBot');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { 
    // Optional: Configure Puppeteer options if needed
  }
});

client.on('qr', (qr) => {
  console.log('Scan this QR code to log in:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WhatsApp bot is ready!');
  const whatsappBot = new WhatsappBot(client);
});

client.initialize();