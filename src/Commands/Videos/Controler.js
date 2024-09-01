const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["controler_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/controla.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Controler is a Music Video by a Malawian Afro-Pop star Onesimus');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/controler.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Controler Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending Music Video. Please try again later.");
    }
  }
};
