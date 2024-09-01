
const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["chic_chic_boom_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/stray.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Chic Chic Boom is a Music Video by South Korean k-pop Boy Band Stray kids currently managed by JYP Entertainment');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/boom.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Chic Chic Boom Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
