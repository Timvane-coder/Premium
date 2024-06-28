const { commands } = require('./BuddyLoadCmd'); // Assuming BuddyLoadCmd loads your commands

async function buddyCmdUpsert(sock, m) {
    // Check if message and its nested properties exist
    if (!m || !m.message) {
        console.error("\x1b[31mInvalid message format or missing message object:\x1b[0m", m);
        return;
    }

    const { message } = m;
    let text, conversation, caption;

    // Check for extended text message
    if (message.extendedTextMessage) {
        text = message.extendedTextMessage.text || '';
    }

    // Check for other message types
    conversation = message.conversation || '';
    caption = (message.videoMessage && message.videoMessage.caption) || (message.imageMessage && message.imageMessage.caption) || '';

    const response = text || conversation || caption || ''; // Handle cases where all might be undefined
    const prefix = '!';

    if (response.startsWith(prefix)) {
        const commandName = response.slice(prefix.length).trim().split(' ')[0]; // Extract command name
        const command = commands[commandName];

        if (command) {
            try {
                // Check if command is restricted to groups only
                if (command.isGroupOnly && !m.key.remoteJid.endsWith('@g.us')) {
                    await buddy.reply(m, '⛔ *This command can only be used in groups.*');
                    return;
                }

                if (command.emoji) {
                    await buddy.react(m, command.emoji);
                }
                await command.execute(sock, m); // Execute the command
            } catch (err) {
                console.error("\x1b[31mError executing command:\x1b[0m", err);
                await buddy.reply(m, 'An error occurred while processing your command.'); // Optional error message to user
            }
        } else {
            // Optional: Handle unknown commands (e.g., send a help message)
            await buddy.reply(m, 'Unknown command. Type !help for available commands.');
        }
    }
}

module.exports = { buddyCmdUpsert };
