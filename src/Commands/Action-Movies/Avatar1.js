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
      
      const menuVideoBuffer = "https://download2302.mediafire.com/v3p0esh091qgAK5obhpBAR4Kq6_yU4nrbg5h05BlShIg85xGEpHlqr752IL7I56v0QYLgvOpryTXbeBOLogcVFYcEmWNcyewV1BoU8vRZjTpDgvdry-H1sGZeex0uGizTdtg-NN7dnEBf1ZPFqjtJLqfDUJT4tIZiDdVGXB4hH2NjmA/0mmmyn19s28kdqy/A.Shop.for.Killers.E04.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
