const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["rush"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇳🇬",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/rush.png');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'rush is a musical Audio by a Nigerian afro pop diva Ayrar Star');
      
      const menuAudioBuffer = "https://coral-ape-1798.twil.io/assets/Rush.mp3";
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
