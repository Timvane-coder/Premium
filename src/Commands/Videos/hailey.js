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
      
      const menuVideoBuffer = "https://download948.mediafire.com/06vn7cv5t8ygBJrTW2B4LeORgYoO16lx4wokPdHm6a9T0exz4a-rUWUTfhy0tqVt_Hz7h1ERi2EGMJ5RwaRHU3DuHNjBhwVloh5cP2fLH0wfNWIyJSYs6zkbZQDgRr6V2N6ggXh2_BocPMI89F81NW37Z7nRfIHDB_0A0wv8fWIpBv4/v4o2qnw5gckwj2v/VID-20240703-WA0001.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
