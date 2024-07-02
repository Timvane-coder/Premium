// ./src/Against/WelcomeMessage.js

module.exports = {
    event: ['group-participants.update'],
    desc: 'Sends a welcome message when new members join the group.',
    isEnabled: settings.SEND_WELCOME_MESSAGE,

    async execute(sock, eventData) {
        if (eventData.action === 'add') { 
            const chatId = eventData.id;
            const newMembers = eventData.participants;

            for (const newMember of newMembers) {
                try {
                    const welcomeMessage = formatWelcomeMessage(newMember, settings.WELCOME_MESSAGE);
                    await sock.sendMessage(chatId, { text: welcomeMessage });
                } catch (error) {
                    console.error("Error sending welcome message:", error); // Log errors for debugging
                }
            }
        }
    }
};

function formatWelcomeMessage(newMember, template) {
    const mention = `@${newMember.split('@')[0]}`;  // Extract username for mention
    return template.replace(/@user/g, mention);
}
