const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["Hapa_mv"],
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
      await buddy.sendImage(m, menuImageBuffer,'Hapa is a Music Video by a Talented Malawian Artist Emmie Deebo who is Currently Signed under Akometsi Entertainment,The Song Features an Elite Tanzanian Artist Platform');
      
      const menuVideoBuffer = "https://mustard-bird-6502.twil.io/assets/Cupid.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Hapa Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Video. Please type again #hapa_mv");
    }
  }
};
