const { delay } = require('@whiskeysockets/baileys')

const emojis = {
    alive: '⚡',         // High voltage/energy emoji
    heart: '💖',         // Heart emoji
    party: '🎉',         // Party emoji
    wave: '👋',          // Waving hand emoji
    thumbsup: '👍',      // Thumbs up emoji
    flexing: '💪',      // Flexing emoji
    fire: '🔥'          // Fire emoji
};

module.exports = {
    usage: ["alive"],
    desc: "Confirms the bot's active status with style.",
    commandType: "Bot",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: emojis.alive, 

    async execute(sock, m) {
        try {
            const botName = settings.BOT_NAME;
            const botVersion = settings.VERSION;
            const runtime = formatSecondsToDHMS(process.uptime());  // Calculate and format bot uptime

            const aliveMessage = `
${emojis.alive} *${botName}* is alive and charged up! ${emojis.heart}

${emojis.wave} Ready to roll! ${emojis.flexing} How can I help you today?

_Bot Version:_ ${botVersion}
_Uptime:_ ${runtime}
_Created by:_ HACXK x COSM1CBUG

${emojis.fire} Let's make some magic happen! ${emojis.fire}
`;

            // Enhanced visual presentation
            const sentMsg = await buddy.reply(m, aliveMessage); 

            // Randomly react with one of the following emojis
            const randomEmoji = [emojis.party, emojis.thumbsup, emojis.fire][Math.floor(Math.random() * 3)];
            await await buddy.react(m, randomEmoji);

            // After a short delay, edit the message for a dramatic reveal
            await delay(1000); 
            await await buddy.editMsg(m, sentMsg, aliveMessage + "\n\nP.S. Did you see that awesome reaction?");
        } catch (error) {
            // Error handling
            await buddy.react(m, emojis.error);
            await buddy.reply(m, "❌ Something went wrong. I'm not feeling so alive right now." + error);
        }
    }
};

// Helper function to format uptime
function formatSecondsToDHMS(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}
