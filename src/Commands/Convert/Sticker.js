const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAX_STICKER_FILE_SIZE_MB = 10; // Set your desired limit

module.exports = {
  usage: ["s", "sticker"],
  desc: "Convert Your images to stickers.",
  commandType: "Convert",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "✨", // Emoji for download

  async execute(sock, m, args) {
    try {
      const quoted = await buddy.getQuotedMedia(m);
      const caption = await buddy.getCaptionMessage(m);
      const messageType = await buddy.getMessageType(m);
      const quotedMessageType = await buddy.getQuotedMessageType(m);

      const validImageTypes = ['imageMessage'];
      const validVideoTypes = ['videoMessage'];

      let mediaType;

      if (!quoted && !caption && !validImageTypes.includes(messageType) && !validVideoTypes.includes(messageType) && !validImageTypes.includes(quotedMessageType) && !validVideoTypes.includes(quotedMessageType)) {
        await buddy.reply(m, 'Please reply to an image or video to convert to a sticker.');
        await buddy.react(m, '❌'); // React with an 'X' for invalid input
        return;
      }

      let mediabuff;
      let fileSizeMB = null; // Initialize fileSizeMB to null

      if (quoted) {
        const quotedMedia = await buddy.downloadQuotedMedia(m);
        if (quotedMedia) {
          mediabuff = quotedMedia.buffer;
          mediaType = quotedMedia.type === 'imageMessage' ? 'image' : 'video';
          fileSizeMB = await buddy.getFileSizeInMB(m); // Get file size if quoted
        }
      } else if (caption) {
        const mediaMsg = await buddy.downloadMediaMsg(m);
        if (mediaMsg) {
          mediabuff = mediaMsg.buffer;
          mediaType = mediaMsg.type === 'imageMessage' ? 'image' : 'video';
          fileSizeMB = await buddy.getFileSizeInMB(m); // Get file size if caption
        }
      } else if (validImageTypes.includes(messageType) || validVideoTypes.includes(messageType)) {
        const mediaMsg = await buddy.downloadMediaMsg(m);
        if (mediaMsg) {
          mediabuff = mediaMsg.buffer;
          mediaType = messageType === 'imageMessage' ? 'image' : 'video';
          fileSizeMB = mediabuff.length / (1024 * 1024); // Calculate file size directly from buffer
        }
      }

      if (mediabuff) {
        if (fileSizeMB > MAX_STICKER_FILE_SIZE_MB) {
          await buddy.reply(m, `Media is too large to process. Maximum allowed size is ${MAX_STICKER_FILE_SIZE_MB} MB.`);
          await buddy.react(m, '❌'); // React with an 'X' for file size error
          return;
        }


        if (mediabuff) {
          await buddy.react(m, '⏳'); // React with an hourglass for processing

          const tempDir = path.join('./temp');
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
          }

          const tempFilePath = path.join(tempDir, `temp_media_${Date.now()}.${mediaType === 'image' ? 'gif' : 'mp4'}`);
          const outputFilePath = path.join(tempDir, `sticker_${Date.now()}.webp`);

          fs.writeFileSync(tempFilePath, mediabuff);

          let ffmpegCommand;
          if (mediaType === 'image') {
            ffmpegCommand = `ffmpeg -i "${tempFilePath}" -vcodec libwebp -lossless 1 -qscale 1 -preset default -loop 0 -an -vsync 0 -vf "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0,split[a][b];[a]palettegen=reserve_transparent=on:transparency_color=ffffff[p];[b][p]paletteuse" -y "${outputFilePath}"`;
          } else if (mediaType === 'video') {
            ffmpegCommand = `ffmpeg -i "${tempFilePath}" -vcodec libwebp -lossless 1 -qscale 1 -preset default -loop 0 -vf "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15,pad=320:320:-1:-1:color=white@0.0" -y "${outputFilePath}"`;
          }

          exec(ffmpegCommand, async (error) => {
            if (error) {
              console.error("FFmpeg error:", error.message);
              await buddy.reply(m, 'Failed to create sticker. Please try again later.');
              await buddy.react(m, '❌'); // React with an 'X' for failure
            } else {
              const stickerBuffer = fs.readFileSync(outputFilePath);
              await buddy.sendSticker(m, stickerBuffer);
              await buddy.react(m, '✅'); // React with a checkmark for success
            }

            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(outputFilePath);
          });
        }
      }
    } catch (error) {
      console.error("Error executing Sticker command:", error.message);
      await buddy.reply(m, `Failed to create sticker. Please try again later.`);
      await buddy.react(m, '❌'); // React with an 'X' for failure
    }
  }
};