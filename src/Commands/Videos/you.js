const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["YouMe"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {
      const menuVideoBuffer = "https://coral-ape-1798.twil.io/assets/YouMe.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'Jennie Kim You and Me official MV');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};