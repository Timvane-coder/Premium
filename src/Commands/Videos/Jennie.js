const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["You_and_Me"],
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
      await buddy.sendImage(m, menuImageBuffer,'You and Me is a Record Breaking KPOP Music Video by a South Korean Rapper Jennie Kim From BlackPink Girl Group Formed by YG Entertainment.');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/YouMe.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGL format* Official You and Me Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Video. Please type again #You_and_Me.");
    }
  }
};
