const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["let_go"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇺🇸",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/passenger.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Let go  is a Grammy Winning Music Audio by American Pop star Passenger');
      
      const menuAudioPath = path.join(__dirname, '../../Assets/Menu/passenger.mp3');
      const menuAudioBuffer = fs.readFileSync(menuAudioPath);
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Audio. Please type again #water");
    }
  }
};
