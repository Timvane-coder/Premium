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
      await buddy.sendImage(m, menuImageBuffer,'Shop for killers is a song by American singer Hailee Steinfeld and Swedish record producer Alesso, featuring American country music duo Florida Georgia Line and American singer-songwriter Watt');
      
      const menuVideoBuffer = "https://download948.mediafire.com/amuiuiz0stagXNaXXv0k3ByUFrV-ejAfTBFIrXDjymGqGiD5hcrlIagRkNKZtneqK-bqmmxSnyAXdAEURMEOkIyj2ZxeALaADVPkfuFzT6KHSircjRT99zfwHUFwbl93f2TxlVQvTjoWTBc_IB6h9FMT16Bec6euTlzbU7ZrIeSxcTQ/zeqmd9w7rv2yf11/Avatar_1A.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
