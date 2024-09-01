const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["driemo"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/trailer.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'trailer by Driemo');
      
      const menuAudioBuffer = "https://mustard-bird-6502.twil.io/assets/DRIEMO.mp3";
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
