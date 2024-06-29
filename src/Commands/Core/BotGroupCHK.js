module.exports = {
    usage: "groups",
    desc: "List all groups the bot is in.",
    commandType: "Core",
    isGroupOnly: false,
    isAdminOnly: true,
    isPrivateOnly: false,
    emoji: "👥",
  
    async execute(sock, m) {
      if (!sock || !sock.chats || !sock.chats.all) {
        await buddy.reply(m, "I'm still loading chats. Please try again in a moment.");
        return; 
      }
  
      const groups = sock.chats.all().filter(chat => chat.isGroup);
  
      if (groups.length === 0) {
        await buddy.reply(m, "I'm not in any groups yet.");
        return;
      }
  
      const groupList = groups.map(group => `- ${group.name} (ID: ${group.id})`).join("\n");
      await buddy.reply(m, groupList);
    }
  };
  