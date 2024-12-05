const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

const emojis = {
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

module.exports = {
    usage: ["yt", "tube"],
    desc: "Search for YouTube videos and download them.",
    commandType: "Download",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: "🔍",

    async execute(sock, m, args) {
        try {
            const MAXDLSIZE = settings.MAX_DOWNLOAD_SIZE * 1024 * 1024; // Convert MB to bytes
            const query = args.join(" ");
            await buddy.react(m, emojis.search);

            if (!query) {
                return await buddy.reply(m, "🔎 Please provide a search query or YouTube link.");
            }

            let video;
            if (ytdl.validateURL(query)) {
                const info = await ytdl.getInfo(query);
                video = {
                    title: info.videoDetails.title,
                    url: info.videoDetails.video_url,
                    author: { name: info.videoDetails.author.name },
                    duration: { seconds: parseInt(info.videoDetails.lengthSeconds) },
                    views: parseInt(info.videoDetails.viewCount),
                    likes: parseInt(info.videoDetails.likes),
                    dislikes: parseInt(info.videoDetails.dislikes),
                    publishedAt: info.videoDetails.publishDate,
                    thumbnail: info.videoDetails.thumbnails[0].url
                };
            } else {
                const results = await yts(query);
                if (results.videos.length === 0) {
                    await buddy.react(m, emojis.noResults);
                    return await buddy.reply(m, "😕 Oops! No videos found for that query.");
                }
                video = results.videos[0];
            }

            await buddy.react(m, emojis.found);
            const videoDuration = new Date(video.duration.seconds * 1000).toISOString().substr(11, 8);
            const ago = new Date(video.publishedAt).toLocaleDateString();

            let response = `
📽️ *BUDDY-MD VIDEO-DOWNLOADER* 📽️

┌───────────────────
├  ℹ️ *Title:* ${video.title}
├  👤 *Channel:* ${video.author.name}
├  📆 *Published:* ${ago} 
├  👁️‍🗨️ *Views:* ${video.views.toLocaleString()}
├  👍 *Likes:* ${video.likes?.toLocaleString() || "N/A"} 
├  👎 *Dislikes:* ${video.dislikes?.toLocaleString() || "N/A"}
├  🕘 *Duration:* ${videoDuration}
└───────────────────

🔢 Select the download option from below

\`[📣] Audio File\`
   1 : Audio as Document (a1) 
   2 : Audio as Normal  (a2)   
   
\`[📺] Video File\`
   1 : Video as Document (v1)
   2 : Video as Normal  (v2)
   
\`\`\`We now support 480P video quality and 192k audio quality for better stability. Support us for more improvements! 🛠️\`\`\``;

            const beautifulFont = await buddy.changeFont(response, 'smallBoldScript');
            const sentMessage = await buddy.sendImage(m, video.thumbnail, beautifulFont);
            await buddy.react(m, emojis.downloadChoice);

            const responseMessage = await buddy.getResponseText(m, sentMessage);

            if (responseMessage) {
                await buddy.react(m, emojis.option);
                let chosenOption = responseMessage.response.toLowerCase();
                await buddy.react(m, emojis.processing);

                let mediaType, quality, fileFormat;

                while (true) {
                    if (chosenOption === '1' || chosenOption === '2') {
                        mediaType = 'audio';
                        quality = 'highestaudio';
                        fileFormat = 'mp3';
                        break; // Break the loop as the response is valid
                    } else if (chosenOption === '3' || chosenOption === '4') {
                        mediaType = 'video';
                        quality = 'highestvideo';
                        fileFormat = 'mp4';
                        break; // Break the loop as the response is valid
                    } else {
                        await buddy.reply(m, "❌ Invalid option. Please choose a valid option (a1, a2, v1, or v2).");
                        const newResponseMessage = await buddy.getResponseText(m, sentMessage); // Prompt again
                        chosenOption = newResponseMessage.response.toLowerCase();
                    }
                }

                // Continue with your logic using mediaType, quality, and fileFormat
                await buddy.react(m, emojis.success);

                try {
                    const info = await ytdl.getInfo(video.url);
                    const format = ytdl.chooseFormat(info.formats, { quality: quality });

                    if (format.contentLength > MAXDLSIZE) {
                        await buddy.react(m, emojis.warning);
                        return await buddy.reply(m, `${emojis.warning} The file size (${(format.contentLength / 1024 / 1024).toFixed(2)} MB) exceeds the maximum allowed size (${settings.MAX_DOWNLOAD_SIZE} MB).`);
                    }

                    const tempDir = path.join('./temp');
                    if (!fs.existsSync(tempDir)) {
                        fs.mkdirSync(tempDir);
                    }

                    const tempPath = path.join(tempDir, `temp_${Date.now()}.${fileFormat}`);

                    let downloadedBytes = 0;
                    const progressMessage = await buddy.reply(m, `${emojis.processing} Downloading... 0%`); // Initial progress message

                    ytdl(video.url, { quality: quality })
                        .on('progress', (_, downloaded, total) => {
                            downloadedBytes = downloaded;
                            const progressPercent = Math.round((downloaded / total) * 100);
                            const filledBlocks = Math.round(progressPercent / 10); // Calculate filled blocks
                            const emptyBlocks = 10 - filledBlocks;
                            const progressEmoji = '🟩'.repeat(filledBlocks) + '🟥'.repeat(emptyBlocks);

                            //  buddy.editMsg(m, progressMessage, `${emojis.processing} Downloading... ${progressPercent}% ${progressEmoji}`);
                        })
                        .pipe(fs.createWriteStream(tempPath))
                        .on('finish', async () => {
                            const fileSize = fs.statSync(tempPath).size;
                            let sendFunction = mediaType === 'audio' ? buddy.sendAudio : buddy.sendVideo;
                            if (chosenOption.endsWith('1') || fileSize > 15 * 1024 * 1024) {
                                sendFunction = buddy.sendDocument;
                            }

                            await sendFunction(m, fs.readFileSync(tempPath), mediaType === 'audio' ? 'audio/mpeg' : 'video/mp4', `${video.title}.${fileFormat}`);
                            fs.unlinkSync(tempPath);
                            await buddy.react(m, emojis.done);
                        });
                } catch (err) {
                    logger.RED(err);
                    await buddy.reply(m, '❌ An error occurred while downloading. Please try again later.');
                }
            } else {
                await buddy.reply(m, "⏱️ Timed out waiting for your choice.");
            }
        } catch (error) {
            await buddy.react(m, emojis.error);
            if (error.response && error.response.status === 403) {
                await buddy.reply(m, "🚫🗝️ Uh oh! Seems like there's an issue with the API key. Please double-check your configuration.");
            } else if (error.message.includes('network')) {
                await buddy.reply(m, "🌐 Hmm, having trouble connecting to the internet. Please try again later.");
            } else {
                await buddy.reply(m, "🤖 Oops! Something unexpected happened. We'll look into it.");
                logger.RED(error);
            }
        }
    }
};
