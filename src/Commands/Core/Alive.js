module.exports = {
    usage: "alive",
    desc: "Check if Buddy is alive and kicking!",
    commandType: "Core",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: "👋", // Waving hand emoji
  
    async execute(sock, m) {
      const { BOT_NAME, OWNER_NAME } = settings;
  
      const aliveMessage = `
👋 *${BOT_NAME} is alive and ready to serve!* 👋
  
I am at your service, ${m.pushName}! Feel free to ask for help or explore my amazing commands.
  
✨ *Bot Owner:* ${OWNER_NAME}
⚡ *Powered by:* Node.js & Baileys
💖 *Made with love by:* Our Team
      `;
      await buddy.reply(m, aliveMessage);
    }
  };
  