const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["go"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/hailey.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'let me go by Hailey and Alleso');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/LetMeGo.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
