const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["voice2"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Audios",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "📥",
  async execute(sock, m) {
    try {

      const menuAudioPath = path.join(__dirname, '../../Assets/Menu/today.opus');
      const menuAudioBuffer = fs.readFileSync(menuAudioPath);
      await buddy.sendAudio(m, menuAudioBuffer);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while Sending the Audio. Please type again #water");
    }
  }
};
