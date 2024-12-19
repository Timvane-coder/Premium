const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["Y"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/jennie.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'You and Me is a record breaking kpop song by a South korean rapper Jennie Kim of Blackpink gir group band formed by YG entertainment');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/YouMe.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official You and Me Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
