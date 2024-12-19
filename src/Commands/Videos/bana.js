const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["bana_pwanya_mv"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/kellkay.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Bana Pwanya is a Musical Video by a Malawian Singer Kell Kay,the Song Features two Zambian Artists Yo Maps and Prince Luv');
      
      const menuVideoBuffer = "https://mustard-bird-6502.twil.io/assets/kellkay.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Bana Pwanya Official Music Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occured while sending the video. Please type again #bana_pwanya_mv");
    }
  }
};
