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
      await buddy.sendImage(m, menuImageBuffer,'Shop for killers is a song by American singer Hailee Steinfeld and Swedish record producer Alesso, featuring American country music duo Florida Georgia Line and American singer-songwriter Watt');
      
      const menuVideoBuffer = "https://download948.mediafire.com/w3rjzshb4uyg5NhXLo6N-MMJJIS3bMqazmMRifk6xyNa7Y2M3CEpsU872NKRFAwwOnRnhuM2meOpG4DiOhiBXSXGcJVP5OSgfmi0oF08RIUOlYz1w9BJ7kjj8Jytw_foBgbj5KZKOfSSOeD9LwdKriwT1yfSkY_CPvRFPWDFirr2PA/zeqmd9w7rv2yf11/Avatar_1A.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
