module.exports = {
    usage: "info",
    desc: "Display information about the bot.",
    commandType: "Core",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: "🤖",
  
    async execute(sock, m) {
      const { BOT_NAME, OWNER_NAME, VERSION } = settings; 
      const botInfo = `
  🤖 *Bot Information* 🤖
  
*Name:* ${BOT_NAME}
*Owner:* ${OWNER_NAME}
*Version:* ${VERSION} 
*Description:* A simple WhatsApp user bot written in JavaScript using the Baileys library. This bot can interact with groups and normal messages. 
*Source Code:* https://github.com/hacxk/Buddy-MD
      `;
      await buddy.reply(m, botInfo);
    }
  };
  