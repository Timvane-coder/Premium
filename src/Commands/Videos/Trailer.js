const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["trailer_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/driemo.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Trailer is a Music Video by Malawian Singer Driemo signed under Van Ngongo Entertainment');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/trailer.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl format* Official Trailer Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while trying to Send the Video. Please type again #trailer_mv");
    }
  }
};
