module.exports = {
  usage: "ping",
  desc: "Check Buddy's response time and network speed!",
  commandType: "Core",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🏓",

  async execute(sock, m) {
    const startTime = Date.now();
    const sentMessage = await buddy.reply(m, "🏓 Pong!");

    const roundTripTime = Date.now() - startTime;

    const connectionInfo = sock?.state?.connection;
    const connectionSpeed = connectionInfo ? `${connectionInfo.speed} kbps` : "Unknown";

    const { BOT_NAME, OWNER_NAME } = settings; // Include owner's name

    const pingMessage = `
  💖 *𝓟𝓸𝓷𝓰!* 💖 
    
    \`\`\`
Round Trip Time: ${roundTripTime} ms ⚡
Connection Speed: ${connectionSpeed} 📶
Bot Name: ${BOT_NAME} 🤖
Owner Name: ${OWNER_NAME} 😎
    \`\`\`
    
  Stay awesome! ✨
    `;


    const ds = await buddy.editMsg(m, sentMessage, pingMessage);
  }
};
