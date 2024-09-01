const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["into_you_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/yuri2.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Into You is a Music Video by South Korean Singer Yuri who debuted with Girls Generation kpop girl band');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/yuri.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Into You Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending Music Video. Please type again #into_you");
    }
  }
};
