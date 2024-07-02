// ./src/Against/DeleteBadWord.js

module.exports = {
    event: ['messages.upsert'],
    desc: 'Delete inappropriate messages (text)!',
    isEnabled: global.settings.BAD_WORD_FILTER, // Accessing BAD_WORD_FILTER from global.settings
    async execute(sock, data) {
        const ms = data.messages; // Ensure ms is correctly defined
        const m = ms[0]; // Assuming ms is an array of messages
        if (m.key.fromMe) return;
        const messageText = m.message?.conversation || m.message?.extendedTextMessage?.text;

        try {
            if (messageText && typeof messageText === 'string') {
                const badWords = global.settings.BAD_WORDS.map(word => word.toLowerCase());
                
                if (badWords.some(word => messageText.toLowerCase().includes(word))) {
                    if (m.key.remoteJid.endsWith('@g.us')) { // Check if it's a group chat
                        const groupMetadata = await sock.groupMetadata(m.key.remoteJid);
                        const myID = sock.user.id.split(':')[0] + '@s.whatsapp.net'; // Extract the bot's ID without the resource part
                        
                        const isBotAdmin = groupMetadata.participants.some(
                            (participant) => participant.id === myID && participant.admin !== null
                        );
    
                        if (isBotAdmin) {
                            await sock.sendMessage(m.key.remoteJid, { delete: m.key });
                            console.log(`Deleted message with bad word in group ${m.key.remoteJid}`);
                        } else {
                            console.log(`Bot is not an admin in group ${m.key.remoteJid}. Message not deleted.`);
                        }
                    } else { // If not a group, delete the message
                        await sock.sendMessage(m.key.remoteJid, { delete: m.key });
                        console.log(`Deleted message with bad word in chat ${m.key.remoteJid}`);
                    }
                }
            }
        } catch (error) {
            console.error("Error checking admin status or deleting message:", error);
        }
    }
};
