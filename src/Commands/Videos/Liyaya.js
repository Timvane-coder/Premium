const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["busy_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/aika.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'budy  is a Music Video done by a  Malawian Artist Lady Aika');
      
      const menuVideoBuffer = "https://mustard-bird-6502.twil.io/assets/Aika.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Busy Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Music Video. Please type again #liyaya_mv");
    }
  }
};
