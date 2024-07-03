const fs = require('fs');
const path = require('path');
const os = require('os');
const { getAllCommands } = require('../../Plugin/BuddyLoadCmd');

let commands
module.exports = {
  usage: ["menu", "help"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Bot",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "📖",
  async execute(sock, m, args) {
    try {
      const menuImagePath = path.join(__dirname, '../../Assets/Menu/Menu2.jpeg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);

      commands = getAllCommands();
    

      const formatCommandsByType = (commands) => {
        const commandsByType = {};
        commands.forEach(cmd => {
          const type = cmd.commandType || "Uncategorized";
          commandsByType[type] = commandsByType[type] || [];
          commandsByType[type].push(cmd);
        });

        let formattedCommands = '';
        for (const [type, cmds] of Object.entries(commandsByType)) {
          formattedCommands += `\n\n┌──「 ${type.toUpperCase()} 」`;
          cmds.forEach(cmd => {
            const usage = Array.isArray(cmd.usage) ? cmd.usage[0] : cmd.usage;
            formattedCommands += `\n├ ${cmd.emoji || '▢'} ${settings.PREFIX[0]}${usage}`;
            if (cmd.desc) {
              formattedCommands += `\n│  ↳ ${cmd.desc}`;
            }
          });
          formattedCommands += '\n└────';
        }
        return formattedCommands;
      };

      const uptimeHours = Math.floor(os.uptime() / 3600);
      const uptimeMinutes = Math.floor((os.uptime() % 3600) / 60);
      const uptimeSeconds = Math.floor(os.uptime() % 60);

      const header = `
╭━━━━「 *${settings.BOT_NAME.toUpperCase()} MENU* 」━━━━╮
┃ ◈ *Owner:* ${settings.OWNER_NAME}
┃ ◈ *Language:* ${settings.DEFAULT_TRANSLATION_LANG}
┃ ◈ *Prefix:* ${settings.PREFIX[0]}
┃ ◈ *Uptime:* ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s
┃ ◈ *Commands:* ${commands.length}
╰━━━━━━━━━━━━━━━━━━━━━━━━━╯

Hello! Here's what I can do for you:
`;

      const footer = `
╭━━━━「 *NOTE* 」━━━━╮
┃ Use ${settings.PREFIX[0]}help <command> for detailed info
┃ Example: ${settings.PREFIX[0]}help sticker
╰━━━━━━━━━━━━━━━━━━━╯
`;

      const [menuTextStyled, headerStyled, footerStyled] = await Promise.all([
        buddy.changeFont(formatCommandsByType(commands), 'smallBoldScript'),
        buddy.changeFont(header, 'geometricModern'),
        buddy.changeFont(footer, 'vintageTelegraph')
      ]);

      const completeMenu = headerStyled + menuTextStyled + footerStyled;

      await buddy.sendImage(m, menuImageBuffer, completeMenu, 'Menu');

      // Offer quick command categories
      const categories = [...new Set(commands.map(cmd => cmd.commandType))];
      const quickMenu = categories.map(cat => `${settings.PREFIX[0]}menu ${cat.toLowerCase()}`).join(' | ');
      await buddy.reply(m, `Quick access: ${quickMenu}`);

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};