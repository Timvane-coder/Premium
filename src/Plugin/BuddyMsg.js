const { downloadContentFromMessage, downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { streamToBuffer } = require('./BuddyStreamToBuffer');
const fancyScriptFonts = require('./BuddyFonts'); // Adjust the path as necessary

const MAX_LISTENERS = 10;
const listeners = [];

/**
 * Convert text to styled text using the fancyScriptFonts object.
 * @param {string} text - The input text to style.
 * @param {string} font - The font style to use from fancyScriptFonts.
 * @returns {string} - The styled text.
 */

async function buddyMsg(sock) {
  const RED = "\x1b[31m";
  const RESET = "\x1b[0m";

  try {
    if (!global.buddy) {
      global.buddy = {
        reply: async (m, text) => {
          try {
            return await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m });
          } catch (err) {
            console.error(`${RED}Error in buddy.reply: ${err.message}${RESET}`);
          }
        },
        send: async (m, text) => {
          try {
            return await sock.sendMessage(m.key.remoteJid, { text });
          } catch (err) {
            console.error(`${RED}Error in buddy.send: ${err.message}${RESET}`);
          }
        },
        react: async (m, emoji) => {
          try {
            return await sock.sendMessage(m.key.remoteJid, { react: { text: emoji, key: m.key } });
          } catch (err) {
            console.error(`${RED}Error in buddy.react: ${err.message}${RESET}`);
          }
        },
        editMsg: async (m, sentMessage, newMessage) => {
          try {
            return await sock.sendMessage(m.key.remoteJid, { edit: sentMessage.key, text: newMessage, type: "MESSAGE_EDIT" });
          } catch (err) {
            console.error(`${RED}Error in buddy.editMsg: ${err.message}${RESET}`);
          }
        },
        sendImageAsSticker: async (m, bufferOrUrl) => {
          try {
            const jid = m.key.remoteJid;
            return await sock.sendMessage(jid, { sticker: bufferOrUrl });
          } catch (err) {
            console.error(`${RED}Error in buddy.sendImageAsSticker: ${err.message}${RESET}`);
          }
        },
        sendVideoAsSticker: async (m, bufferOrUrl) => {
          try {
            const jid = m.key.remoteJid;
            return await sock.sendMessage(jid, { sticker: bufferOrUrl });
          } catch (err) {
            console.error(`${RED}Error in buddy.sendVideoAsSticker: ${err.message}${RESET}`);
          }
        },
        sendImage: async (m, bufferOrUrl, caption, asSticker = false) => {
          try {
            const jid = m.key.remoteJid;
            let options = {};

            if (typeof bufferOrUrl === 'string') {
              options = {
                image: {
                  url: bufferOrUrl
                },
                caption: caption || ''
              };
            } else if (Buffer.isBuffer(bufferOrUrl)) {
              options = {
                image: bufferOrUrl,
                caption: caption || ''
              };
            } else {
              throw new Error('Invalid bufferOrUrl type. Expected string (URL) or Buffer.');
            }

            return await sock.sendMessage(jid, options);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendImage: ${err.message}${RESET}`);
          }
        },
        sendVideo: async (m, bufferOrUrl, caption, asSticker = false) => {
          try {
            const jid = m.key.remoteJid;
            const options = (typeof bufferOrUrl === 'string'
              ? { video: bufferOrUrl, caption }
              : { video: { url: bufferOrUrl }, caption });
            return await sock.sendMessage(jid, options);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendVideo: ${err.message}${RESET}`);
          }
        },
        sendDocument: async (m, bufferOrUrl, mimetype, fileName, caption) => {
          try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
              ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
              : { document: bufferOrUrl, mimetype, fileName, caption };
            return await sock.sendMessage(jid, options);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendDocument: ${err.message}${RESET}`);
          }
        },
        sendAudio: async (m, bufferOrUrl, ptt = false) => {
          try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
              ? { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' }
              : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };
            return await sock.sendMessage(jid, options);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendAudio: ${err.message}${RESET}`);
          }
        },
        externalAdReply: async (m, head, title, body, mediaType, thumbnailPath) => {
          try {
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
                  mediaUrl: '', // Ensure this is correctly set
                },
              },
            });
          } catch (err) {
            console.error(`${RED}Error in buddy.externalAdReply: ${err.message}${RESET}`);
          }
        },
        replyWithMention: async (m, text, users) => {
          try {
            const mentions = users.map(u => `@${u}`).join(' ');
            return await sock.sendMessage(m.key.remoteJid, { text: `${text} ${mentions}`, mentions }, { quoted: m });
          } catch (err) {
            console.error(`${RED}Error in buddy.replyWithMention: ${err.message}${RESET}`);
          }
        },
        forwardMessage: async (jid, messageToForward, options = {}) => {
          try {
            return await sock.relayMessage(jid, messageToForward.message, options);
          } catch (err) {
            console.error(`${RED}Error in buddy.forwardMessage: ${err.message}${RESET}`);
          }
        },
        getQuotedMessage: async (m) => {
          try {
            let quotedMessage = null;

            if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
              quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
            } else if (m?.message?.conversation?.contextInfo?.quotedMessage) {
              quotedMessage = m.message.conversation.contextInfo.quotedMessage;
            }

            if (quotedMessage) {
              if (quotedMessage.extendedTextMessage?.text) {
                return quotedMessage.extendedTextMessage.text;
              } else if (quotedMessage.conversation) {
                return quotedMessage.conversation;
              }
            }

            return null;
          } catch (err) {
            console.error(`${RED}Error in buddy.getQuotedMessage: ${err.message}${RESET}`);
          }
        },
        getResponseText: async (key, sentMessage, timeout) => {
          try {
            return new Promise((resolve, reject) => {
              let timer;

              if (timeout && timeout > 0) {
                timer = setTimeout(() => {
                  resolve(null)
                  sock.ev.off('messages.upsert', replyHandler);
                  reject(new Error('Timeout exceeded while waiting for response'));
                }, timeout);
              }

              const replyHandler = async ({ messages }) => {
                const msg = messages[0];
                const senderJid = key.key.remoteJid;

                if (
                  ((msg.message?.extendedTextMessage?.contextInfo?.stanzaId ||
                    msg.message?.conversation?.contextInfo?.stanzaId) === sentMessage.key.id) &&
                  (senderJid.endsWith('@g.us') ? key.key.participant : key.key.remoteJid) ===
                  (msg.key.remoteJid.endsWith('@g.us') ? msg.key.participant : msg.key.remoteJid)
                ) {
                  if (timer) clearTimeout(timer);
                  await sock.ev.off('messages.upsert', replyHandler);

                  const responseText = msg.message?.extendedTextMessage?.text || msg.message?.conversation;
                  const ownImplement = {
                    key: msg.key,
                    message: msg.message,
                    response: responseText
                  };

                  resolve(ownImplement);
                }
              };

              // Add new listener and remove the oldest one if the limit is reached
              listeners.push(replyHandler);
              if (listeners.length > MAX_LISTENERS) {
                const oldestListener = listeners.shift();
                sock.ev.off('messages.upsert', oldestListener);
              }

              sock.ev.on('messages.upsert', replyHandler);
            });
          } catch (err) {
            console.error(`${RED}Error in buddy.getResponseText: ${err.message}${RESET}`);
          }
        },
        downloadQuotedMedia: async (m) => {
          try {
            let quotedMsg;

            // Function to recursively search for media in an object
            function findMediaMessage(obj) {
              if (!obj) return null;

              // Check if the object has media messages and return the specific type if found
              if (obj.imageMessage) return { type: 'imageMessage', message: obj.imageMessage };
              if (obj.videoMessage) return { type: 'videoMessage', message: obj.videoMessage };
              if (obj.audioMessage) return { type: 'audioMessage', message: obj.audioMessage };
              if (obj.documentMessage) return { type: 'documentMessage', message: obj.documentMessage };

              // Recursively search deeper if it's an object
              if (typeof obj === 'object') {
                for (const key in obj) {
                  const result = findMediaMessage(obj[key]);
                  if (result) return result;
                }
              }

              return null;
            }


            // Check for quotedMessage with Media
            let found = false;
            for (const key in m.message) {
              const msg = m.message[key];
              if (msg?.contextInfo?.quotedMessage) {
                const media = findMediaMessage(msg.contextInfo.quotedMessage);
                if (media) {
                  quotedMsg = media;
                  found = true;
                  break; // Stop searching after finding the first quoted media message
                }
              }
            }

            if (!found || !quotedMsg) {
              throw new Error('No quoted media message found.');
            }

            // Determine filename and extension based on media type
            let filename;
            let extension;
            if (quotedMsg.type === 'imageMessage') {
              extension = 'png'; // Assume PNG for image
            } else if (quotedMsg.type === 'videoMessage') {
              extension = 'mp4'; // Assume MP4 for video
            } else if (quotedMsg.type === 'audioMessage') {
              extension = 'mp3'; // Assume MP3 for audio
            } else if (quotedMsg.type === 'documentMessage') {
              // Use the original filename if available, otherwise fallback to timestamp
              filename = quotedMsg.message.caption || `file_${Date.now()}.${quotedMsg.message.mimetype.split('/')[1]}`;
              extension = filename.split('.').pop(); // Extract extension from filename
            } else {
              throw new Error('Unsupported media type.');
            }

            // Generate filename based on current time if not set
            if (!filename) {
              const now = new Date();
              const timeStr = now.toISOString().replace(/[:.]/g, '-'); // Format timestamp for filename
              filename = `media_${timeStr}.${extension}`;
            }
            // Download the file from WhatsApp using the quoted message
            const mimeType = quotedMsg.message.mimetype.split('/')[0];
            const mediaData = await downloadContentFromMessage(quotedMsg.message, mimeType);

            // Convert mediaData to buffer if necessary
            let mediaDataBuffer;
            if (mediaData instanceof Buffer) {
              mediaDataBuffer = mediaData;
            } else {
              // Read from the stream and accumulate into a buffer
              mediaDataBuffer = await streamToBuffer(mediaData);
            }

            return { buffer: mediaDataBuffer, extension, filename };
          } catch (err) {
            console.error(`${RED}Error in buddy.downloadQuotedMedia: ${err.message}${RESET}`);
          }
        },
        downloadMediaMsg: async (m) => {
          try {
            if (!m.message) return; // if there is no text or media message
            const messageType = Object.keys(m.message)[0]; // get what type of message it is -- text, image, video

            // If the message is an image, video, audio, or document
            if (messageType === 'imageMessage' || messageType === 'videoMessage' || messageType === 'audioMessage' || messageType === 'documentMessage' || messageType === 'documentWithCaptionMessage') {

              const buffer = await downloadMediaMessage(
                m,
                "buffer",
                {}
              );

              let extension = '';

              if (messageType === 'imageMessage') {
                const mimetype = m.message.imageMessage.mimetype;
                extension = mimetype === 'image/png' ? '.png' : '.jpeg';
              } else if (messageType === 'videoMessage') {
                extension = '.mp4';
              } else if (messageType === 'audioMessage') {
                extension = '.mp3';
              } else if (messageType === 'documentMessage') {
                const mimetype = m.message.documentMessage.mimetype;
                const filename = m.message.documentMessage.fileName;
                extension = filename ? filename.split('.').pop() : mimetype.split('/').pop();
                extension = `.${extension}`;
              } else if (messageType === 'documentWithCaptionMessage') {
                const mimetype = m.message.documentWithCaptionMessage.message.documentMessage.mimetype;
                const filename = m.message.documentWithCaptionMessage.message.documentMessage.fileName;
                extension = filename ? filename.split('.').pop() : mimetype.split('/').pop();
                extension = `.${extension}`;
              }

              return { buffer, extension };
            } else {
              return 'Provide a valid message (quoted messages are not valid)';
            }
          } catch (err) {
            console.error(`${RED}Error in buddy.downloadMediaMessage: ${err.message}${RESET}`);
          }
        },
        changeFont: async (text, font) => {
          try {
            // Validate inputs
            if (typeof text !== 'string' || typeof font !== 'string') {
              throw new Error("Both 'text' and 'font' must be of type string.");
            }

            const fontMap = fancyScriptFonts[font];
            if (!fontMap) {
              throw new Error(`Font '${font}' is not available in fancyScriptFonts.`);
            }

            // Simulate async operation (e.g., fetching font data)
            await new Promise(resolve => setTimeout(resolve, 10));

            // Convert text to styled text
            return text.split('').map(char => fontMap[char] || char).join('');
          } catch (error) {
            // Handle errors
            console.error("Error in changeFont:", error.message);
            throw error;
          }
        }
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
