const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["maluzi_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/maluzi.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Maluzi is a remix Music Video done by two Malawian artist Zeze and Collins,the later is a sole composer of the original song');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/maluzi.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Maluzi Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Music Video. Please type again #maluzi_mv");
    }
  }
};