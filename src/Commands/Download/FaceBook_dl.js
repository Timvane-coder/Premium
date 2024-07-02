const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Stream } = require('stream');

const emojis = { // Emoji mapping for responses
    search: '🔍',
    found: '🎉',
    noResults: '😕',
    error: '🤖',
    downloadChoice: '👇',
    option: '✅',
    processing: '⏳',
    done: '🚀',
    warning: '⚠️'
};

const MAX_DOWNLOAD_SIZE = settings.MAX_DOWNLOAD_SIZE * 1024 * 1024;
const downloadFBVideo = async (sock, m, args, videoUrl, format = 'sd') => {
    try {
        const apiResponse = await axios.get(`https://api.vihangayt.com/downloader/fb?url=${encodeURIComponent(videoUrl)}`);
        const videoInfo = apiResponse.data.data;

        if (!videoInfo.sdLink && !videoInfo.hdLink) {
            return await buddy.reply(m, `${emojis.error} No downloadable links found for this video.`);
        }

        // Check if video size exceeds limit
        const downloadLink = format === 'hd' ? videoInfo.hdLink : videoInfo.sdLink;
        const sizeResponse = await axios.head(downloadLink);
        const fileSize = parseInt(sizeResponse.headers['content-length'], 10);
        if (fileSize > MAX_DOWNLOAD_SIZE) {
            return await buddy.reply(m, `${emojis.warning} File size exceeds the limit.`);
        }

        const downloadOptions = `
📽️ *BUDDY-MD FACEBOOK-DOWNLOADER* 📽️

┌───────────────────
├  👤 *Author:* ${videoInfo.owner || "Unknown"}
├  📝 *Description:* ${(videoInfo.description || "").slice(0, 100)}... 
└───────────────────

🔗 Link: ${videoUrl}

📥 Downloading in ${format.toUpperCase()} quality...`;

        const beautifulFont = await buddy.changeFont(downloadOptions, 'smallBoldScript');
        const sentMessage = await buddy.send(m, beautifulFont); // Send initial message

        // Download, Progress Tracking, and Rate Limiting
        let downloadedBytes = 0;
        let lastEditTime = 0; // Store the last time the message was edited
        const response = await axios.get(downloadLink, { responseType: 'stream' });
        response.data.on('data', async (chunk) => {
            downloadedBytes += chunk.length;
            const progressPercent = Math.round((downloadedBytes / fileSize) * 100);
            const now = Date.now();

            // Edit the message only every 3 seconds to avoid rate limiting
            if (progressPercent % 10 === 0 && (now - lastEditTime) >= 3000) {
                lastEditTime = now;
                const filledBlocks = Math.round(progressPercent / 10);
                const emptyBlocks = 10 - filledBlocks;
                const progressEmoji = '🟩'.repeat(filledBlocks) + '🟥'.repeat(emptyBlocks);

                try {
                    await buddy.editMsg(m, sentMessage, `${emojis.processing} Downloading... ${progressPercent}% ${progressEmoji}`);
                } catch (editError) {
                    if (editError.data === 429) { // Specifically handle rate-limit error (HTTP 429)
                        console.warn("Rate limit exceeded, delaying edit...");
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                        // Optionally: Retry the editMsg here.
                    } else {
                        console.error("Error editing progress message:", editError);
                    }
                }
            }
        });

        const tempDir = path.join('./temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        const tempPath = path.join(tempDir, `fb_${Date.now()}.mp4`);
      
            try {
                await buddy.editMsg(m, sentMessage, `${emojis.done} Download complete!`);


                // Send the video stream
                const msd = await buddy.sendVideo(m, fs.readFileSync(tempPath), `Facebook Video (${format.toUpperCase()})`);

                // Ensure the stream is closed and file deleted after sending
                if (msd) {
                    fs.unlinkSync(tempPath); // Delete the temporary file
                }

            } catch (sendError) {
                console.error("Error sending video:", sendError);
                await buddy.react(m, emojis.error);
                await buddy.reply(m, `${emojis.error} An error occurred while sending the video.`);

                // Handle potential cleanup error
                try {
                    fs.unlinkSync(tempPath);
                } catch (cleanupError) {
                    console.error("Error cleaning up temp file:", cleanupError);
                }
            }
    
    } catch (error) {
        console.error("Error downloading Facebook video:", error);
        await buddy.react(m, emojis.error);
        await buddy.reply(m, `${emojis.error} An error occurred while downloading the video.`);
    }
};



module.exports = {
    usage: ["fb", "facebook"],
    desc: "Download Facebook videos.",
    commandType: "Download",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: "⬇️",

    async execute(sock, m, args) {
        try {
            const url = args[0];
            if (!url) {
                return await buddy.reply(m, "🔎 Please provide a Facebook video URL or post URL.");
            }

            // Quality Selection (If you want to provide quality choices)
            let downloadOptions = `
📽️ *BUDDY-MD FACEBOOK-DOWNLOADER* 📽️

🔗 Link: ${url}

🔢 Select the download quality:

\`[1] Standard Definition (SD)\`
\`[2] High Definition (HD)\` (if available)`;

            const beautifulFont = await buddy.changeFont(downloadOptions, 'smallBoldScript');
            const sentMessage = await buddy.sendImage(m, `https://www.facebook.com/images/fb_icon_325x325.png`, beautifulFont);
            await buddy.react(m, emojis.downloadChoice);

            const responseMessage = await buddy.getResponseText(m, sentMessage); // 15 seconds timeout
            if (responseMessage) {
                await buddy.react(m, emojis.option);
                let chosenOption = responseMessage.response;

                let format = 'sd'; // Default to SD
                if (chosenOption === '2' && apiResponse.data.data.hdLink) {
                    format = 'hd';
                }

                const apiResponse = await axios.get(`https://api.vihangayt.com/downloader/fb?url=${encodeURIComponent(url)}`);

                if (!apiResponse.data.data.sdLink && !apiResponse.data.data.hdLink) {
                    return await buddy.reply(m, `${emojis.error} No downloadable links found for this video.`);
                }

                await downloadFBVideo(sock, m, args, url, format); // Pass the chosen format

            } else {
                await buddy.reply(m, "⏱️ Timed out waiting for your choice.");
            }
        } catch (error) {
            await buddy.react(m, emojis.error);
            console.error("Error in Facebook downloader:", error);
            await buddy.reply(m, "🤖 Oops! Something went wrong. Please try again later.");
        }
    }
};
