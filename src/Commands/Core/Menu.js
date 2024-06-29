module.exports = {
    usage: "menu",
    desc: "Display the bot's menu of commands.",
    commandType: "Core",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: "📖", // Open book emoji

    async execute(sock, m) {
        const { BOT_NAME, PREFIX } = settings;

        const menuMessage = `
  ╭──「 *${BOT_NAME} - Main Menu* 」
  │ 
  ├ 🌸 *Core Commands:*
  │ 
  ├ ${PREFIX}ping       🏓 Check my response time
  ├ ${PREFIX}alive      👋 Am I alive?
  ├ ${PREFIX}help       ℹ️ Get help and command list
  ├ ${PREFIX}info       🤖 About me
  │
  ├ 💡 *Utilities:*
  │
  ├ ${PREFIX}weather <city> 🌤️ Get weather info
  ├ ${PREFIX}translate <text> 🌐 Translate text
  ├ ${PREFIX}getid      🆔 Get this chat's ID
  ├ ${PREFIX}groups     👥 List groups I'm in (admin only)
  │
  ├ 🖼️ *Media & Fun:*
  │
  ├ ${PREFIX}image <query>  🖼️ Search for an image
  ├ ${PREFIX}video <query>  🎥 Search for a video
  ├ ${PREFIX}sticker <query> ✨ Create a sticker
  │
  ╰───「 *More features coming soon!* 」`;

        await buddy.reply(m, menuMessage)
    }
};
