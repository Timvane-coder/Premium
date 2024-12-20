const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["intoYou"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/yuri.webp');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'into you is an underated musical Audio done by a South korean Singer Yuri of Girls Generation Girl Group Band managed by SM entertainment');
      
      const menuAudioBuffer = "https://coral-ape-1798.twil.io/assets/hold_me.mp3";
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
