const { commands } = require('../../Plugin/BuddyLoadCmd');

module.exports = {
  usage: "help",
  desc: "Display available commands.",
  commandType: "Core",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "ℹ️",

  async execute(sock, m) {
    const { BOT_NAME, PREFIX, OWNER_NAME } = settings;

    let helpMessage = `
👋 *Welcome to ${BOT_NAME}!*

Here are the commands you can use:
 
`;

    // Categorize commands by commandType (Core, Utilities, Media, etc.)
    const commandCategories = {};
    for (const command in commands) {
      const cmd = commands[command];
      if (!cmd.isAdminOnly && !cmd.isPrivateOnly) {
        const category = cmd.commandType || "Other";
        if (!commandCategories[category]) {
          commandCategories[category] = [];
        }
        commandCategories[category].push(cmd);
      }
    }

    // Format help message for each category
    for (const category in commandCategories) {
      helpMessage += `\n*${category} Commands:*\n`;
      for (const cmd of commandCategories[category]) {
        helpMessage += `${cmd.emoji} *${PREFIX[0]}${cmd.usage}*: ${cmd.desc}\n`;
      }
    }

    // Add additional information or footer to the help message
    helpMessage += `
\nNeed more help? Contact my owner: ${OWNER_NAME}
Type *${PREFIX[0]}info* to learn more about me.
`;

    await buddy.reply(m, helpMessage);
  }
};
