const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["avatar_1"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Action_Movies",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇺🇸",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/hailey.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Avatar the last Airbender is a film  by American');
      
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/Avatar_The_Last_Airbender_360P_S01_EP01(0).mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Avatar the  last Airbender Episode 1');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
