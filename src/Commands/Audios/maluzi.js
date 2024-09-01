const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["maluzi"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/zeze.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'maluzi is remake musical Audio done Malawian amapiano star Zeze and features Collins.the original song of the same name was done by Collins Bandawe');
      
      const menuAudioBuffer = "https://coral-ape-1798.twil.io/assets/maluzi.mp3";
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
