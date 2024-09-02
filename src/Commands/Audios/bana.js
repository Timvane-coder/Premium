const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["bana_pwanya"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/kells.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Bana Pwanya Is a Music Audio by a Malawian Singer Kell Kay Featuring Two Zambian Artist Yo Maps and Prince Luv.');
      
      const menuAudioBuffer = "https://coral-ape-1798.twil.io/assets/banapwanya.mp3";
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Audio. Please type again #bana_pwanya ");
    }
  }
};
