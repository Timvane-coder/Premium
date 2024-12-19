const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["water_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇿🇦",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/water.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer, 'Water is a Musical Video by a South African Grammy Winning Pop Star Tyla');
      
      const menuVideoBuffer = "https://mustard-bird-6502.twil.io/assets/Tyla.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Water official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Video. Please type again #water_mv");
    }
  }
};
