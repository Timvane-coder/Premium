const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, delay } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require('pino');
const path = require('path');

// Small Fix For Waiting for Message
const NodeCache = require('node-cache');
const msgRetryCounterCache = new NodeCache();

// Set up logging
// Enhanced logging
const logger = pino({
    level: process.env.LOG_LEVEL || 'silent',
});

// Plugins
const { buddyMsg } = require('../Plugin/BuddyMsg');
const { buddyEvents } = require('../Plugin/BuddyEvent');
const { loadCommands } = require('../Plugin/BuddyLoadCmd');
const { againstEvent } = require('../Plugin/BuddyEventHandle');

(async () => {
    await loadCommands(path.join(__dirname, '../Commands'));
})();

let messagesSent = 0;


async function buddyMd(io, app) {
    const chalk = (await import('chalk')).default;

    // Endpoint to fetch statistics
    app.get('/messagestotal', (req, res) => {
        res.json({
            messageTotal: messagesSent,
        });
    });

    // In-memory store for caching
    const store = makeInMemoryStore({ logger });

    // Load state and authentication
    const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '../Session'));

    // fetch latest version of WA Web
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(chalk.cyanBright(`using WA v${version.join('.')}, isLatest: ${isLatest}`))

    const sock = await makeWASocket({
        version: [2, 3000, 1014080102],
        printQRInTerminal: true,
        mobile: false,
        keepAliveIntervalMs: 10000,
        downloadHistory: false,
        msgRetryCounterCache,
        syncFullHistory: true,
        shouldSyncHistoryMessage: msg => {
            console.log(chalk.cyanBright(`Syncing chats..[${msg.progress}%]`));
            return !!msg.syncType;
        },
        markOnlineOnConnect: true,
        defaultQueryTimeoutMs: undefined,
        logger,
        Browsers: ['BUDDY-MD', 'Chrome', '113.0.5672.126'],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        linkPreviewImageThumbnailWidth: 1980,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg?.message || undefined
            }
            return {
                conversation: ''
            }
        },
        patchMessageBeforeSending: async (msg, recipientJids) => {
            await sock.uploadPreKeysToServerIfRequired();
            // messagesSent = messagesSent + 1;

            // // Emit 'messageCount' event to all connected clients with updated count
            // io.emit('messageCount', messagesSent);

            // const messageType = Object.keys(msg)[0];
            // const messageContent = msg[messageType]?.text || msg[messageType]?.caption || '';


            // // Default typing delay settings
            // const defaultTypingDelay = {
            //     min: 400, // Minimum delay in milliseconds
            //     max: 800, // Maximum delay in milliseconds
            //     longMessageThreshold: 300, // Characters
            // };

            // // Merge default and custom settings (if available)
            // const typingDelay = defaultTypingDelay;
            // const messageLength = messageContent.length;

            // // Handle audio messages
            // if (messageType === 'audioMessage') {
            //     await sock.sendPresenceUpdate('recording', recipientJids[0]);
            //     const audioDuration = msg.audioMessage.seconds || 5; // Estimate duration if not provided
            //     await delay(audioDuration * 1000); // Wait for the audio duration
            //     await sock.sendPresenceUpdate('paused', recipientJids[0]);
            //     return msg;
            // } else if (messageType === 'videoMessage' || messageType === 'imageMessage' || messageType === 'documentMessage' || messageType === 'documentWithCaptionMessage' || messageType === 'protocolMessage' || messageType === 'reactionMessage') {
            //     return msg;
            // }

            // // Handle text or caption messages
            // const typingDuration = messageLength > typingDelay.longMessageThreshold
            //     ? typingDelay.max
            //     : (Math.random() * (typingDelay.max - typingDelay.min) + typingDelay.min);

            // await sock.sendPresenceUpdate('composing', recipientJids[0]);
            // await delay(typingDuration);
            // await sock.sendPresenceUpdate('paused', recipientJids[0]);
            return msg;
        }
    });

   // console.log(sock)
    store.bind(sock.ev);
    againstEvent(sock)
    buddyEvents(sock, chalk);

    // Advanced presence updates
    setInterval(() => updatePresence(sock), 60000);

    async function updatePresence(sock) {
        await sock.sendPresenceUpdate('available');
    }


    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log(qr);
        }

        // if (!sock.authState.creds.registered && pairingOption === 'Whatsapp Pairing Code') {
        //     setTimeout(async () => {
        //         const code = await sock.requestPairingCode(pairingNumber);
        //         console.log(chalk.greenBright(`Pairing Code: ${code}`))
        //     }, 5000);
        // }

        if (connection === "open") {
            try {
                console.log(chalk.cyan('Connected! 🔒✅'));
                // Don't Remove budd
                buddyMsg(sock);
                return new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        try {
                            console.log(chalk.yellow('Restarting socket to clear in-memory store...'))
                            await sock.end({ reason: 'Clearing store' }); // Disconnect gracefully
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }, 30 * 60 * 1000);
                });
            } catch (err) {
                console.log('Error in:', err)
            }
        }

        const code = lastDisconnect?.error?.output?.statusCode;

        if (code === 428) {
            console.log(chalk.cyan('Connection closed! 🔒'));
            sock.ev.removeAllListeners();
            await delay(2000); // Add a delay before reconnecting
            buddyMd(io, app);
            await sock.ws.close();
            return
        }

        if (code === 500) {
            console.log(chalk.cyan('Connection closed! 🔒'));
            sock.ev.removeAllListeners();
            await delay(2000); // Add a delay before reconnecting
            buddyMd(io, app);
            await sock.ws.close();
            return
        }


        if (connection === "close" || code) {
            try {
                const reason = lastDisconnect && lastDisconnect.error ? new Boom(lastDisconnect.error).output.statusCode : 500;
                switch (reason) {
                    case DisconnectReason.connectionClosed:
                        console.log(chalk.cyan('Connection closed! 🔒'));
                        sock.ev.removeAllListeners();
                        await delay(5000); // Add a delay before reconnecting
                        buddyMd(io, app);
                        await sock.ws.close();
                        return;
                    case DisconnectReason.connectionLost:
                        console.log(chalk.cyan('Connection lost from server! 📡'));
                        console.log(chalk.cyan('Trying to Reconnect! 🔂'));
                        await delay(2000);
                        sock.ev.removeAllListeners();
                        buddyMd(io, app);
                        await sock.ws.close();
                        return;
                    case DisconnectReason.restartRequired:
                        console.log(chalk.cyan('Restart required, restarting... 🔄'));
                        await delay(5000);
                        // sock.ev.removeAllListeners();
                        buddyMd(io, app);
                        return;
                    case DisconnectReason.timedOut:
                        console.log(chalk.cyan('Connection timed out! ⌛'));
                        sock.ev.removeAllListeners();
                        await delay(5000); // Add a delay before reconnecting
                        buddyMd(io, app);
                        await sock.ws.close();
                        return;
                    default:
                        console.log(chalk.cyan('Connection closed with bot. Trying to run again. ⚠️'));
                        sock.ev.removeAllListeners();
                        await delay(5000); // Add a delay before reconnecting
                        buddyMd(io, app);
                        await sock.ws.close();
                        return;
                }
            } catch (error) {
                console.error(chalk.red('Error occurred during connection close:'), error.message);
            }
        }

        //    // Enable read receipts
        sock.sendReadReceiptAck = true;
    });

}

module.exports = { buddyMd }