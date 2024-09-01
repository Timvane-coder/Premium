const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["Hapa"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/hapa.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Hapa is a Music Video by a Talented Malawian Artist Emmie Deebo who is currently signed under Akometsi Entertainment,The Song features an Elite Tanzanian Artist Platform');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/hapa.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Hapa Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending Your requested Music Video. Please try again later.");
    }
  }
};
