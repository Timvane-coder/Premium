async function buddyMsg(sock) {
  const RED = "\x1b[31m";
  const RESET = "\x1b[0m";

  try {
    if (!global.buddy) {
      global.buddy = {
        reply: async (m, text) => {
          await sock.sendMessage(m.chat, { text }, { quoted: m });
        },
        send: async (m, text) => { // Corrected parameter here
          await sock.sendMessage(m.key.remoteJid, { text });
        },
        react: async (m, emoji) => {
          await sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } });
        },

        // Advanced Media Sending
        sendImageAsSticker: async (m, bufferOrUrl) => {
          const jid = m.key.remoteJid;
          await sock.sendMessage(jid, { sticker: bufferOrUrl });
        },
        sendVideoAsSticker: async (m, bufferOrUrl) => {
          const jid = m.key.remoteJid;
          await sock.sendMessage(jid, { sticker: bufferOrUrl });
        },
        sendImage: async (m, bufferOrUrl, caption = '', asSticker = false) => {
          const jid = m.key.remoteJid;
          const options = (typeof bufferOrUrl === 'string'
            ? { url: bufferOrUrl, caption }
            : { image: bufferOrUrl, caption });
          await sock.sendMessage(jid, options);
        },
        sendVideo: async (m, bufferOrUrl, caption = '', asSticker = false) => {
          const jid = m.key.remoteJid;
          const options = (typeof bufferOrUrl === 'string'
            ? { url: bufferOrUrl, caption }
            : { video: bufferOrUrl, caption });
          await sock.sendMessage(jid, options);
        },        
        sendDocument: async (m, bufferOrUrl, mimetype, fileName = 'BUDDY') => {
          const jid = m.key.remoteJid;
          const options = typeof bufferOrUrl === 'string'
            ? { url: bufferOrUrl, mimetype, fileName }
            : { document: bufferOrUrl, mimetype, fileName };
          await sock.sendMessage(jid, options);
        },
        sendAudio: async (m, bufferOrUrl, ptt = false) => {
          const jid = m.key.remoteJid;
          const options = typeof bufferOrUrl === 'string'
            ? { url: bufferOrUrl, ptt, mimetype: 'audio/mpeg' }
            : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
          await sock.sendMessage(jid, options);
        },

        // Advanced Features
        replyWithMention: async (m, text, users) => {
          const mentions = users.map(u => `${u}`);
          await sock.sendMessage(m.key.remoteJid, { text: `${text} ${mentions.join(' ')}`, mentions }, { quoted: m });
        },
        forwardMessage: async (jid, messageToForward, options = {}) => {
          await sock.relayMessage(jid, messageToForward.message, options);
        },
      };
    }
  } catch (err) {
    const errorMessage = err.message || 'Unknown error';
    if (errorMessage.includes('not found')) {
      console.error(`${RED}Error in buddyMsg: File not found or invalid URL.${RESET}`);
    } else if (errorMessage.includes('Unsupported file type')) {
      console.error(`${RED}Error in buddyMsg: Unsupported file type.${RESET}`);
    } else if (errorMessage.includes('Invalid URL')) {
      console.error(`${RED}Error in buddyMsg: Invalid URL.${RESET}`);
    } else {
      console.error(`${RED}Error in buddyMsg:${RESET} ${errorMessage}`);
    }
  }
}

module.exports = { buddyMsg };
