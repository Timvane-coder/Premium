const fs = require('fs');
const path = require('path');
const os = require('os');
const { commands } = require('../../Plugin/BuddyLoadCmd');

module.exports = {
  usage: ["menu", "help"],
  desc: "Display the bot's menu.",
  commandType: "Bot",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "📖",

  async execute(sock, m, args) {
    try {
      const menuImagePath = path.join(__dirname, '../../Assets/Menu/Menu2.jpeg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);

      // Function to format commands, handling missing types
      const formatCommandsByType = (commands) => {
        const commandsByType = {};
        Object.values(commands).forEach(cmd => {
          const type = cmd.commandType || "Uncategorized"; // Default to "Uncategorized" if type is missing
          commandsByType[type] = commandsByType[type] || [];
          commandsByType[type].push(`${settings.PREFIX[0]}${cmd.usage.join(`\n${settings.PREFIX[0]}`)}`);
        });

        let formattedCommands = '';
        for (const [type, cmds] of Object.entries(commandsByType)) {
          formattedCommands += `\n\n───「 ◈ *${type.toUpperCase()} COMMANDS:* 」\n\n${cmds.join('\n')}`;
        }
        return formattedCommands;
      };

      // Build menu header text with dynamic uptime calculation
      const uptimeHours = Math.floor(os.uptime() / 3600);
      const uptimeMinutes = Math.floor((os.uptime() % 3600) / 60);
      const men = `╭────「 *BUDDY MENU* 」
│ ◈ *BOTNAME:* ${settings.BOT_NAME}
│ ◈ *OWNER:* ${settings.OWNER_NAME}
│ ◈ *LANGUAGE:* ${settings.DEFAULT_TRANSLATION_LANG}
│ ◈ *PREFIX:* ${settings.PREFIX[0]}
│ ◈ *UPTIME:* ${uptimeHours} hours ${uptimeMinutes} minutes
╰──────────●●►\n
Hey there! Here’s what I can do for you:\n`;

      // Apply font changes concurrently
      const [menuTextStyled, menTextStyled] = await Promise.all([
        buddy.changeFont(formatCommandsByType(commands), 'smallBoldScript'),
        buddy.changeFont(men, 'boldBigScript')
      ]);

      // Send the combined menu
      const completeMenu = menTextStyled + menuTextStyled;
      await buddy.sendImage(m, menuImageBuffer, completeMenu);

    } catch (error) {
      console.error("Error displaying menu:", error.message);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
