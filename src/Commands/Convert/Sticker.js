const { Sticker } = require('wa-sticker-formatter');

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

      console.log(messageType, quotedMessageType);

      const validMessageTypes = ['imageMessage', 'videoMessage'];

      if (!quoted && !caption && !validMessageTypes.includes(messageType) && !validMessageTypes.includes(quotedMessageType)) {
        await buddy.reply(m, 'Please reply to an image to convert to a sticker.');
        await buddy.react(m, '❌');
        return;
      }

      let imgbuff;

      if (quoted) {
        const quotedMedia = await buddy.downloadQuotedMedia(m);

        if (quotedMedia) {
          imgbuff = quotedMedia.buffer;
        }
      } else if (caption) {
        const mediaMsg = await buddy.downloadMediaMsg(m);
        if (mediaMsg) {
          imgbuff = mediaMsg.buffer;
        }
      }

      if (imgbuff) {
        const newSticker = new Sticker(imgbuff, {
          pack: 'Buddy - MD',
          author: 'BUDDY',
          type: 'full',
          categories: ['🐱', '😎'], // Add sticker categories if needed
          quality: 90
        });

        const stickerBuffer = await newSticker.build(); // Ensure to build the sticker
        await buddy.sendSticker(m, stickerBuffer);
        return;
      }
    } catch (error) {
      console.error("Error executing Sticker command:", error.message);
      await buddy.reply(m, `Failed to create sticker. Please try again later.`);
    }
  }
};
