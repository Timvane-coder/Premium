const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["controla"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {
      const menuImagePath = path.join(__dirname, '../../Assets/Menu/onesimus.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'controller is a musical Audio done by a Malawian Afro Pop star Onesimus');
      
      const menuAudioPath = path.join(__dirname, '../../Assets/Menu/Onesimus.mp3');
      const menuAudioBuffer = fs.readFileSync(menuAudioPath);
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
