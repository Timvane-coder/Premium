const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["confesion"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/confess.webp');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'confesion is an Original Soundtrack done by a South Korean Singer Lim Kim; the Audio was taken from a hit Korean-Netflix drama King the Land');
      
      const menuAudioBuffer = "https://coral-ape-1798.twil.io/assets/confession%20.mp3";
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
