module.exports = {
    usage: 'ping',
    desc: "Check Buddy's response time and network speed!",
    commandType: "Core",
    isGroupOnly: false,
    isAdminOnly: false,
    emoji: '🏓', // Pong emoji (🏓)

    async execute(sock, m) {
        const startTime = Date.now();
        const sentMessage = await buddy.reply(m, '🏓 Pong!'); // Send initial "Pong!" message

        // Measure round trip time
        const roundTripTime = Date.now() - startTime;

        // Fetch connection information (if available)
        const connectionInfo = sock?.state?.connection;
        const connectionSpeed = connectionInfo ? `${connectionInfo.speed} kbps` : "Unknown";

        const pingMessage = `
🏓 *Pong!* 🏓
  
⏱️ *Round Trip Time:* ${roundTripTime} ms
📶 *Connection Speed:* ${connectionSpeed}
      `;

        await buddy.editMsg(m, sentMessage, pingMessage)
    }
};
