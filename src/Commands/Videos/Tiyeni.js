const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["wayimanya_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/jetu.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Wayimanya is a Music Video by Jetu, an old malawian woman who defied all odds to join music in her late years');
      
      const menuVideoBuffer = "https://mustard-bird-6502.twil.io/assets/Jetu.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Ku Wayimanya Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while sending Music Video. Please type again #Ku_tiyeni_mv");
    }
  }
};
