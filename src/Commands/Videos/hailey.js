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
      
      const menuVideoBuffer = "https://download947.mediafire.com/lo336d62tapgGltRy0EWPAzQPNEQKn90rVor5OZCVlg-sHoZyHQKQhAndOTt7TTCB-aJKF9alSaOn14--3mQhlbgmdfyvuMAeFCFS-qsxSg2r3YnMJZFKEJjjGGJxPfhQanQA3dD4u0RW5iX_PMoWEPM6i-j3Qvpc8Lots9qM-5ENA/skj749e3863b2j3/Orisa_1.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
