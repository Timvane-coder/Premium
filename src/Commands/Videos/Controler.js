const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["apt_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/rose.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Apt is a Music Video by American singer Bruno Mars and a South Korean K-Pop star Rose who is also a member of a girl band Blackpink');
      
      const menuVideoBuffer = "https://mustard-bird-6502.twil.io/assets/Rose.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Apt Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending Music Video. Please try again later.");
    }
  }
};
