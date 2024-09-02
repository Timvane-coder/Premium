const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["hapa"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇲🇼",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/deebo.jpeg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Hapa is a Music Audio by a Female Malawian Artist Emmie Deebo,The Song Features a Tanzanian Artist Platform.');
      
      const menuAudioBuffer = "https://coral-ape-1798.twil.io/assets/hapa.mp3";
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Audio. Please type again #hapa.");
    }
  }
};
