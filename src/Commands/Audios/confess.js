const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["heeriye"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇮🇳",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/trailer.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'trailer is a musical Audio by a multi award winning Malawian artist Driemo');
      
      const menuAudioBuffer = "https://mustard-bird-6502.twil.io/assets/.mp3";
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
