// Import the necessary bot or messaging framework
// const WhatsAppBot = require('your-messaging-bot-library'); // Uncomment and replace with actual bot library
// const buddy = new WhatsAppBot();

const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["ad"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇿🇦",


  async execute (sock,m) {
  
    try {
  
      await buddy.externalAdReply(
            m,                            // Message object
            'Check this out!',            // Main title
            'Amazing Product',            // Subtitle or secondary message
            'Get yours now!',             // Call to action
            'IMAGE',                      // Type of attachment ('IMAGE' in this case)
            './product_thumbnail.jpg'     // Path to the image file
      );

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
