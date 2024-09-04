const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["go"],
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
      await buddy.sendImage(m, menuImageBuffer,'Let Me Go is a song by American singer Hailee Steinfeld and Swedish record producer Alesso, featuring American country music duo Florida Georgia Line and American singer-songwriter Watt');
      
      const menuVideoBuffer = "https://download1514.mediafire.com/9bhz9eaxqhcgJQpK52rltlHMSKOA8zp1aFKtvOFNS1z2iHKVNcb1_H6DK4LJY7URtrfYErDfdQguySBO3BG_7_fyebw7D_73MbJECb35sHaZVm0ibrvDGm-7AGEiwRw6ndrhczz8eegZM-7Cr3jPG9y8vdVGYjXP78bMIRshsOnQBg/0mmmyn19s28kdqy/A.Shop.for.Killers.E04.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
