const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["avatar_1"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Videos",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇺🇸",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/hailey.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Shop for killers is a song by American singer Hailee Steinfeld and Swedish record producer Alesso, featuring American country music duo Florida Georgia Line and American singer-songwriter Watt');
      
      const menuVideoBuffer = "https://download948.mediafire.com/41wh800zj3fgV9_yDxYWcFJR0OYrPb3cBoQeFhdie3SZb8KZZp6KGfc7pCfPI4LqH_eOpvljqgNNaWbjIn0f0z8pYQTQ1-AtfJ3d-XQgDqQudwP6BXP4UZIaetTiQDm7u9mIuu6CLMncyB4xjJzvfzU6QvJoMBVjBSXTy0Hut9-rbw/zeqmd9w7rv2yf11/Avatar_1A.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
