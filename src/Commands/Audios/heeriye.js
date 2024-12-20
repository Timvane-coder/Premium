const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["heeriye"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇮🇳",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/mantra.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Mantra Is a Music Audio by a South Korean K-pop singer Jennie Kim who is also a member of blackpink');
      
      const menuAudioPath = path.join(__dirname, '../../Assets/Menu/mantra.mp3');
      const menuAudioBuffer = fs.readFileSync(menuAudioPath);
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Audio. Please type again #bana_pwanya ");
    }
  }
};
