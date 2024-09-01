const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["ku_tiyeni_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/tiyeni.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Ku tiyeni is a Music Video by Praise Umali,the song features two Popular Malawian Artist Kell Kay and Zeze');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/kutiyeni.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Ku Tiyeni Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while sending Music Video. Please type again #Ku_tiyeni_mv");
    }
  }
};
