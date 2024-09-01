const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["cupid"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/cupid.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'cupid is a musical video by a South Korea girl group fifty fifty managed by Attrakt Records');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/Cupid.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'Webgl Format* Cupid Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
