const fs = require('fs')

module.exports = {
    usage: ["hi"],
    desc: "Say Hello!",
    commandType: "Utilities",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: "👋",
    async execute(sock, m, args) {
        try {
            const buffer = await buddy.downloadMediaMsg(m, 'buffer');
            fs.writeFileSync('./dsdsdsdsd.jpg', buffer);
            // Reply with a greeting
            const sentMessage = await buddy.reply(m, 'Hello! 👋');

            // Wait for a response
            const response = await buddy.getResponseText(m, sentMessage);

            // Check if the response is a greeting
            const greetings = ['hello', 'hi'];
            if (greetings.includes(response.response.toLowerCase())) {
                // Respond to the greeting
                await buddy.reply(m, 'Hey! How can I help you?');
            }
        } catch (error) {
            console.error('Error in Hi:', error.message);
            // Handle the error gracefully, e.g., notify user or log it
        }
    }
};
