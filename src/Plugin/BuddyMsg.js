const fs = require('fs')

async function buddyMsg(sock) {
  const RED = "\x1b[31m";
  const RESET = "\x1b[0m";

  try {
    if (!global.buddy) {
      global.buddy = {
        reply: async (m, text) => {
          return await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m });
        },
        send: async (m, text) => { // Corrected parameter here
          return await sock.sendMessage(m.key.remoteJid, { text });
        },
        react: async (m, emoji) => {
          return await sock.sendMessage(m.key.remoteJid, { react: { text: emoji, key: m.key } });
        },
        editMsg: async (m, sentMessage, newMessage) => {
          return await sock.sendMessage(m.key.remoteJid, { edit: sentMessage.key, text: newMessage, type: "MESSAGE_EDIT" });
        },

        // Advanced Media Sending
        sendImageAsSticker: async (m, bufferOrUrl) => {
          const jid = m.key.remoteJid;
          return await sock.sendMessage(jid, { sticker: bufferOrUrl });
        },
        sendVideoAsSticker: async (m, bufferOrUrl) => {
          const jid = m.key.remoteJid;
          return await sock.sendMessage(jid, { sticker: bufferOrUrl });
        },
        sendImage: async (m, bufferOrUrl, caption, asSticker = false) => {
          const jid = m.key.remoteJid;
          const options = (typeof bufferOrUrl === 'string'
            ? { url: bufferOrUrl, caption }
            : { image: bufferOrUrl, caption });
          return await sock.sendMessage(jid, options);
        },
        sendVideo: async (m, bufferOrUrl, caption, asSticker = false) => {
          const jid = m.key.remoteJid;
          const options = (typeof bufferOrUrl === 'string'
            ? { url: bufferOrUrl, caption }
            : { video: bufferOrUrl, caption });
          return await sock.sendMessage(jid, options);
        },
        sendDocument: async (m, bufferOrUrl, mimetype, fileName) => {
          const jid = m.key.remoteJid;
          const options = typeof bufferOrUrl === 'string'
            ? { url: bufferOrUrl, mimetype, fileName }
            : { document: bufferOrUrl, mimetype, fileName };
          return await sock.sendMessage(jid, options);
        },
        sendAudio: async (m, bufferOrUrl, ptt = false) => {
          const jid = m.key.remoteJid;
          const options = typeof bufferOrUrl === 'string'
            ? { url: bufferOrUrl, ptt, mimetype: 'audio/mpeg' }
            : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
          return await sock.sendMessage(jid, options);
        },

        // Advanced Features
        externalAdReply: async (m, head, title, body, mediaType, thumbnailPath) => {
          return await sock.sendMessage(m.key.remoteJid, {
            text: head,
            contextInfo: {
              externalAdReply: {
                showAdAttribution: false,
                renderLargerThumbnail: true,
                title: title,
                body: body,
                previewType: 0,
                mediaType: mediaType,
                thumbnail: fs.readFileSync(thumbnailPath),
                mediaUrl: ``,
              },
            },
          });
        },
        replyWithMention: async (m, text, users) => {
          const mentions = users.map(u => `${u}`);
          return await sock.sendMessage(m.key.remoteJid, { text: `${text} ${mentions.join(' ')}`, mentions }, { quoted: m });
        },
        forwardMessage: async (jid, messageToForward, options = {}) => {
          return await sock.relayMessage(jid, messageToForward.message, options);
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
