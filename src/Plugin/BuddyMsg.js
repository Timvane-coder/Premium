const { downloadContentFromMessage, downloadMediaMessage, delay } = require('@whiskeysockets/baileys');
const fs = require('fs');
const { streamToBuffer, writeTempFile } = require('./BuddyStreamToBuffer');
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

  // Clear previous cache/data
  Object.keys(require.cache).forEach((key) => {
    delete require.cache[key];
  });

  try {
    global.buddy = {
      reply: async (m, text) => {
        return new Promise(async (resolve, reject) => {
          try {
            await sock.sendPresenceUpdate('composing', m.key.remoteJid);
            await delay(200)
            const result = await sock.sendMessage(m.key.remoteJid, { text }, { quoted: m });
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.reply: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },
      send: async (m, text) => {
        return new Promise(async (resolve, reject) => {
          try {
            await sock.sendPresenceUpdate('composing', m.key.remoteJid);
            await delay(200)
            const result = await sock.sendMessage(m.key.remoteJid, { text });
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.send: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },
      react: async (m, emoji) => {
        return new Promise(async (resolve, reject) => {
          try {
            await sock.sendPresenceUpdate('composing', m.key.remoteJid);
            await delay(200)
            const result = await sock.sendMessage(m.key.remoteJid, { react: { text: emoji, key: m.key } });
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.react: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      editMsg: async (m, sentMessage, newMessage) => {
        return new Promise(async (resolve, reject) => {
          try {
            await sock.sendPresenceUpdate('composing', m.key.remoteJid);
            await delay(200)
            const result = await sock.sendMessage(m.key.remoteJid, { edit: sentMessage.key, text: newMessage, type: "MESSAGE_EDIT" });
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.editMsg: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      deleteMsg: async (m) => {
        return new Promise(async (resolve, reject) => {
          try {
            const { remoteJid, participant, quoted } = m.key;
            // Check if the bot is an admin in the group
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const botId = sock.user.id.replace(/:.*$/, "") + "@s.whatsapp.net";
            const botIsAdmin = groupMetadata.participants.some(p => p.id.includes(botId) && p.admin);

            if (!botIsAdmin) {
              return "I cannot delete message because I am not a superadmin or admin in this group.";
            }
            const ms = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!ms) {
              return "Please Reply To The Message You Want To Delete 🗑️";
            }

            let ryt
            if (m.key.participant === m?.message?.extendedTextMessage?.contextInfo?.participant) {
              ryt = true
            } else {
              ryt = false
            }

            const stanId = m?.message?.extendedTextMessage?.contextInfo?.stanzaId

            const message = {
              key: {
                remoteJid: m.key.remoteJid,
                fromMe: ryt,
                id: stanId,
                participant: m?.message?.extendedTextMessage?.contextInfo?.participant
              }
            }

            await sock.sendPresenceUpdate('composing', m.key.remoteJid);
            await delay(200)
            const response = await sock.sendMessage(message.key.remoteJid, { delete: message.key });
            await delay(750)
            await sock.sendMessage(message.key.remoteJid, { delete: m.key });
            await delay(250)
            resolve(response);
          } catch (err) {
            console.error(`${RED}Error in buddy.editMsg: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      sendSticker: async (m, bufferOrUrl) => {
        return new Promise(async (resolve, reject) => {
          try {
            const jid = m.key.remoteJid;
            const result = await sock.sendMessage(jid, { sticker: bufferOrUrl }, { quoted: m });
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendSticker: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      sendImage: async (m, bufferOrUrl, captions, asSticker = false) => {
        return new Promise(async (resolve, reject) => {
          try {
            const jid = m.key.remoteJid;
            let options = {};

            if (typeof bufferOrUrl === 'string') {
              options = {
                image: { url: bufferOrUrl },
                caption: captions || ''
              };
            } else if (Buffer.isBuffer(bufferOrUrl)) {
              options = {
                image: bufferOrUrl,
                caption: captions || ''
              };
            } else {
              throw new Error('Invalid bufferOrUrl type. Expected string (URL) or Buffer.');
            }

            const result = await sock.sendMessage(jid, options);
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendImage: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      sendVideo: async (m, bufferOrUrl, caption) => {
        return new Promise(async (resolve, reject) => {
          try {
            const jid = m.key.remoteJid;
            const options = (typeof bufferOrUrl === 'string'
              ? { video: bufferOrUrl, caption }
              : { video: { url: bufferOrUrl }, caption });

            const result = await sock.sendMessage(jid, options);
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendVideo: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      sendDocument: async (m, bufferOrUrl, mimetype, fileName, caption) => {
        return new Promise(async (resolve, reject) => {
          try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
              ? { document: { url: bufferOrUrl }, mimetype, fileName, caption }
              : { document: bufferOrUrl, mimetype, fileName, caption };

            const result = await sock.sendMessage(jid, options);
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendDocument: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      sendAudio: async (m, bufferOrUrl, ptt = false) => {
        return new Promise(async (resolve, reject) => {
          try {
            const jid = m.key.remoteJid;
            const options = typeof bufferOrUrl === 'string'
              ? { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' }
              : { audio: bufferOrUrl, ptt, mimetype: 'audio/mpeg' };

              await sock.sendPresenceUpdate('recording', m.key.remoteJid);
              await delay(400)
            const result = await sock.sendMessage(jid, options, { quoted: m });
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.sendAudio: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },
      sendGif: async (m, bufferOrUrl, playback = true) => { // Default playback to true
        return new Promise(async (resolve, reject) => {
          try {
            const jid = m.key.remoteJid;

            // If bufferOrUrl is a string (URL), fetch the GIF data
            let gifBuffer;
            if (typeof bufferOrUrl === 'string') {
              const response = await fetch(bufferOrUrl); // You'll need to import fetch if you're not already using it
              gifBuffer = await response.arrayBuffer();
            } else {
              gifBuffer = bufferOrUrl; // Assume bufferOrUrl is already a Buffer
            }

            const result = await sock.sendMessage(m.key.remoteJid, { video: gifBuffer, gifPlayback: playback });
            resolve(result);

          } catch (err) {
            console.error(`${RED}Error in buddy.sendGif: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },
      externalAdReply: async (m, head, title, body, mediaType, thumbnailPath) => {
        return new Promise(async (resolve, reject) => {
          try {
            let urlOrPath;
            if (typeof thumbnailPath === 'string') {
              urlOrPath = { url: thumbnailPath }
            } else {
              urlOrPath = fs.readFileSync(thumbnailPath)
            }
            const result = await sock.sendMessage(m.key.remoteJid, {
              text: head,
              contextInfo: {
                externalAdReply: {
                  showAdAttribution: false,
                  renderLargerThumbnail: true,
                  title: title,
                  body: body,
                  previewType: 0,
                  mediaType: mediaType,
                  thumbnail: urlOrPath,
                  mediaUrl: '', // Ensure this is correctly set
                },
              },
            });
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.externalAdReply: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      replyWithMention: async (m, text, users) => {
        return new Promise(async (resolve, reject) => {
          try {
            const mentions = users.map(u => `@${u}`).join(' ');
            const result = await sock.sendMessage(m.key.remoteJid, { text: `${text} ${mentions}`, mentions }, { quoted: m });
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.replyWithMention: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      forwardMessage: async (jid, messageToForward, options = {}) => {
        return new Promise(async (resolve, reject) => {
          try {
            const result = await sock.relayMessage(jid, messageToForward.message, options);
            resolve(result);
          } catch (err) {
            console.error(`${RED}Error in buddy.forwardMessage: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      getQuotedText: async (m) => {
        return new Promise(async (resolve, reject) => {
          try {
            let quotedMessage = null;

            if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
              quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
            } else if (m?.message?.conversation?.contextInfo?.quotedMessage) {
              quotedMessage = m.message.conversation.contextInfo.quotedMessage;
            }

            if (quotedMessage) {
              if (quotedMessage.extendedTextMessage?.text) {
                resolve(quotedMessage.extendedTextMessage.text);
              } else if (quotedMessage.conversation) {
                resolve(quotedMessage.conversation);
              }
            } else {
              resolve(null);
            }
          } catch (err) {
            console.error(`${RED}Error in buddy.getQuotedMessage: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },

      getQuotedMedia: async (m) => {
        return new Promise(async (resolve, reject) => {
          try {
            let quotedMedia = null;

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
                  quotedMedia = media;
                  found = true;
                  break; // Stop searching after finding the first quoted media message
                }
              }
            }

            if (!found || !quotedMedia) {
              resolve(false);
              return;
            }

            resolve(quotedMedia);
          } catch (err) {
            console.error(`${RED}Error in buddy.getQuotedMedia: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },



      getMessageType: async (m) => {
        return new Promise(async (resolve, reject) => {
          try {
            if (!m.message) reject(null);
            const messageType = Object.keys(m.message)[0];
            resolve(messageType)
          } catch (error) {
            console.error(`${RED}Error in buddy.getMessageType: ${error.message}${RESET}`);
            reject(err);
          }
        });
      },

      getQuotedMessageType: async (m) => {
        return new Promise(async (resolve, reject) => {
          try {
            if (!m.message) reject(null);
            const messageType = Object.keys(m.message)[0];
            const messageContent = m.message[messageType]?.contextInfo?.quotedMessage;
            resolve(messageContent)
          } catch (error) {
            console.error(`${RED}Error in buddy.getQuotedMessageType: ${error.message}${RESET}`);
            reject(error);
          }
        });
      },

      getCaptionMessage: async (m) => {
        return new Promise(async (resolve, reject) => {
          try {
            for (const key in m.message) {
              const msg = m.message[key];
              if (msg?.caption) {
                resolve(msg);
                return;
              }
            }
            resolve(null);
          } catch (error) {
            console.error(`${RED}Error in buddy.getCaptionMessage: ${error.message}${RESET}`);
            reject(error);
          }
        });
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
        return new Promise(async (resolve, reject) => {
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

            resolve({ buffer: mediaDataBuffer, extension, filename });
          } catch (err) {
            console.error(`${RED}Error in buddy.downloadQuotedMedia: ${err.message}${RESET}`);
            reject(err);
          }
        })
      },
      downloadMediaMsg: async (m) => {
        return new Promise(async (resolve, reject) => {
          try {
            if (!m.message) return resolve(); // if there is no text or media message

            const messageType = Object.keys(m.message)[0]; // get what type of message it is -- text, image, video

            // If the message is an image, video, audio, or document
            if (
              messageType === 'imageMessage' ||
              messageType === 'videoMessage' ||
              messageType === 'audioMessage' ||
              messageType === 'documentMessage' ||
              messageType === 'documentWithCaptionMessage'
            ) {
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

              return resolve({ buffer, extension });
            } else {
              return resolve('Provide a valid message (quoted messages are not valid)');
            }
          } catch (err) {
            console.error(`${RED}Error in buddy.downloadMediaMessage: ${err.message}${RESET}`);
            reject(err);
          }
        });
      },
      changeFont: async (text, font) => {
        return new Promise(async (resolve, reject) => {
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
            const styledText = text.split('').map(char => fontMap[char] || char).join('');
            resolve(styledText);
          } catch (error) {
            // Handle errors
            console.error("Error in changeFont:", error.message);
            reject(error);
          }
        });
      },
      getFileSizeInMB: async (m) => {
        return new Promise(async (resolve, reject) => {
          try {
            if (!m.message) reject(null);

            // Iterate through message keys to find potential file information
            for (const key of Object.keys(m.message)) {
              const messageContent = m.message[key];

              // Check if 'fileLength' property exists (typically for media messages)
              if (messageContent && messageContent.fileLength) {
                const fileSizeBytes = parseInt(messageContent.fileLength); // Ensure it's an integer
                const fileSizeMB = fileSizeBytes / (1024 * 1024); // Convert to MB
                resolve(fileSizeMB); // Return the file size in MB
                return; // Exit the loop early since we found the file size
              }
            }

            // If no 'fileLength' found, return null
            resolve(null);

          } catch (error) {
            console.error(`${RED}Error in buddy.getFileSizeInMB: ${error.message}${RESET}`);
            reject(error);
          }
        });
      },

      saveFileToTemp: async (bufferData, filename) => {
        return new Promise((resolve, reject) => {
          try {
            const tempDir = path.join(__dirname, 'temp');
    
            // Check if the directory exists, create it if not
            fs.access(tempDir, fs.constants.F_OK, (err) => {
              if (err) {
                // Directory doesn't exist, create it
                fs.mkdir(tempDir, { recursive: true }, (err) => {
                  if (err) {
                    reject(err);
                    return;
                  }
                  // Proceed with writing the file after creating the directory
                  writeTempFile(tempDir, bufferData, filename, resolve, reject);
                });
              } else {
                // Directory exists, proceed with writing the file
                writeTempFile(tempDir, bufferData, filename, resolve, reject);
              }
            });
          } catch (error) {
            reject(error);
          }
        });
      },

    };
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
