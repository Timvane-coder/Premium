const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, makeInMemoryStore, delay } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require('pino');
const path = require('path');

// Set up logging
const logger = pino({ level: 'silent' });

// Plugins
const { buddyMsg } = require('../Plugin/BuddyMsg')


async function buddyMd() {
    const chalk = (await import('chalk')).default;
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
        syncFullHistory: false,
        downloadHistory: false,
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
        patchMessageBeforeSending: async (msg, recipientJids) => {
            const messageType = Object.keys(msg)[0];
            const messageContent = msg[messageType]?.text || msg[messageType]?.caption || '';

            // Default typing delay settings
            const defaultTypingDelay = {
                min: 400, // Minimum delay in milliseconds
                max: 800, // Maximum delay in milliseconds
                longMessageThreshold: 300, // Characters
            };

            // Merge default and custom settings (if available)
            const typingDelay = { ...defaultTypingDelay, ...(settings.typingDelay || {}) };
            const messageLength = messageContent.length;

            // Handle audio messages
            if (messageType === 'audioMessage') {
                await sock.sendPresenceUpdate('recording', recipientJids[0]);
                const audioDuration = msg.audioMessage.seconds || 5; // Estimate duration if not provided
                await delay(audioDuration * 1000); // Wait for the audio duration
                await sock.sendPresenceUpdate('paused', recipientJids[0]);
                return msg;
            }

            // Handle text or caption messages
            const typingDuration = messageLength > typingDelay.longMessageThreshold
                ? typingDelay.max
                : (Math.random() * (typingDelay.max - typingDelay.min) + typingDelay.min);

            await sock.sendPresenceUpdate('composing', recipientJids[0]);
            await delay(typingDuration);
            await sock.sendPresenceUpdate('paused', recipientJids[0]);
            return msg;
        }
    });

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
            await buddyMsg(sock)
            console.log(chalk.cyan('Connected! 🔒✅'));
            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    try {
                        console.log(chalk.yellow('Restarting socket to clear in-memory store...'))
                        await sock.end({ reason: 'Clearing store' }); // Disconnect gracefully
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                }, 10 * 60 * 1000);
            });
        }

        const code = lastDisconnect?.error?.output?.statusCode;

        if (code === 428) {
            console.log(chalk.cyan('Connection closed! 🔒'));
            sock.ev.removeAllListeners();
            await delay(2000); // Add a delay before reconnecting
            buddyMd();
            await sock.ws.close();
            return
        }

        if (code === 500) {
            console.log(chalk.cyan('Connection closed! 🔒'));
            sock.ev.removeAllListeners();
            await delay(2000); // Add a delay before reconnecting
            buddyMd();
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
                        buddyMd();
                        await sock.ws.close();
                        return;
                    case DisconnectReason.connectionLost:
                        console.log(chalk.cyan('Connection lost from server! 📡'));
                        console.log(chalk.cyan('Trying to Reconnect! 🔂'));
                        await delay(2000);
                        sock.ev.removeAllListeners();
                        buddyMd();
                        await sock.ws.close();
                        return;
                    case DisconnectReason.restartRequired:
                        console.log(chalk.cyan('Restart required, restarting... 🔄'));
                        await delay(5000);
                        // sock.ev.removeAllListeners();
                        buddyMd();
                        return;
                    case DisconnectReason.timedOut:
                        console.log(chalk.cyan('Connection timed out! ⌛'));
                        sock.ev.removeAllListeners();
                        await delay(5000); // Add a delay before reconnecting
                        buddyMd();
                        await sock.ws.close();
                        return;
                    default:
                        console.log(chalk.cyan('Connection closed with bot. Trying to run again. ⚠️'));
                        sock.ev.removeAllListeners();
                        await delay(5000); // Add a delay before reconnecting
                        buddyMd();
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