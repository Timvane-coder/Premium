const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["cupid"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇰🇷",
  async execute(sock, m) {
    try {
      const menuVideoBuffer = "https://mustard-bird-6502.twil.io/assets/VID-20240703-WA0001.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'cupid by Fifty Fifty');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
