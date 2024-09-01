const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["banapwanya"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/kellkay.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'bana pwanya by Kell kay ft Yo Maps and Prince Luv');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/bana.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Bana pwanya');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
