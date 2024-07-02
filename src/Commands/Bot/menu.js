const fs = require('fs');
const path = require('path');
const os = require('os'); // Import the os module
const { commands } = require('../../Plugin/BuddyLoadCmd'); // Assuming BuddyLoadCmd loads your commands

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
      const owner = settings.OWNER_NAME;
      const botName = settings.BOT_NAME;
      const prefix = settings.PREFIX[0];
      const lang = settings.DEFAULT_TRANSLATION_LANG;

      // Calculate uptime and command count
      const uptimeSeconds = os.uptime();
      const uptimeHours = Math.floor(uptimeSeconds / 3600);
      const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
      const uptime = `${uptimeHours}h ${uptimeMinutes}m`;

      // Dynamically count user-facing commands
      const userCommandCount = Object.values(commands).filter(
        cmd => cmd.commandType === 'user' || cmd.commandType === 'Bot'
      ).length;

      // Build menu header text
      const men = `╭────「 *BUDDY MENU* 」
│ ◈ *BOTNAME:* ${botName}
│ ◈ *OWNER:* ${owner}
│ ◈ *LANGUAGE:* ${lang}
│ ◈ *PREFIX:* ${prefix}
│ ◈ *UPTIME:* ${uptime}
│ ◈ *COMMANDS:* ${userCommandCount}
╰──────────●●►\n\n`;

      // Build command list dynamically
      const formattedCommands = [];
      for (const commandKey in commands) {
        const command = commands[commandKey];
        formattedCommands.push(
          `║ ${command.emoji} *${command.usage.join(', ')}* - ${command.desc}`
        );
      }

      // Apply font changes (await the results)
      const menuTextPromise = buddy.changeFont(formattedCommands.join('\n\n'), 'smallBoldScript');
      const menTextPromise = buddy.changeFont(men, 'boldBigScript');
      const [menuText, menText] = await Promise.all([menuTextPromise, menTextPromise]);

      // Combine text and send
      const completeMenu = menText + '\n\n' + menuText;
      await buddy.sendImage(m, menuImageBuffer, completeMenu);
    } catch (error) {
      console.error("Error displaying menu:", error.message);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
