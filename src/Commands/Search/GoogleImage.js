const gis = require('g-i-s');

module.exports = {
  usage: ["img", "photo"],
  desc: "Search and send a stunning image from Google Images.",
  commandType: "Search",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🖼️", // Emoji to react with

  async execute(sock, m, args) {
    const query = args.join(' ');

    if (!query) {
      await buddy.react(m, "🤔");
      return await buddy.reply(m, "Please provide a search term to find an image. Example: */img <search term>*");
    }

    try {
      await buddy.react(m, "🔍"); 
      let progressMessage = await buddy.reply(m, `Searching for "${query}"...`);
      
      // Search and image selection using Promises
      try {
        const results = await new Promise((resolve, reject) => {
          gis(query.toLowerCase(), { safe: settings.SAFE_SEARCH }, (error, results) => {
            if (error) reject(error);
            else resolve(results);
          });
        });

        if (!results || results.length === 0) {
          await buddy.react(m, "😞"); 
          return await buddy.reply(m, "No images found for that search term. 😔");
        }

        const randomIndex = Math.floor(Math.random() * results.length);
        const randomImage = results[randomIndex];
        const preferredImage = results.find(r => r.width >= 800 && r.height >= 600);
        const imageToSend = preferredImage || randomImage;

        await buddy.react(m, "✨"); 
        await buddy.sendImage(m, imageToSend.url, `🖼️ *Image for:* ${query}\n\n🔗 *Source:* ${imageToSend.url}`);
      } catch (error) { // Catch errors from the Promise
          console.error("Error searching for images:", error);
          await buddy.react(m, "❌"); 
          return await buddy.reply(m, "❌ An error occurred while searching for images. Please try again.");
      }

    } catch (err) {
      console.error("Error sending image:", err);
      await buddy.react(m, "❌"); 
      await buddy.reply(m, "❌ An error occurred while sending the image. Please try again.");
    }
  }
};