const fs = require('fs');
const path = require('path');
const os = require('os');

module.exports = {
  usage: ["avatar_1"],
  desc: "Display the bot's menu with categories and command details.",
  commandType: "Action_Movies",
  isGroupOnly: false,
  isAdminOnly: false,
  isPrivateOnly: false,
  emoji: "🇺🇸",
  async execute(sock, m) {
    try {

      const menuImagePath = path.join(__dirname, '../../Assets/Menu/hailey.jpg');
      const menuImageBuffer = fs.readFileSync(menuImagePath);
      await buddy.sendImage(m, menuImageBuffer,'Shop for killers is a song by American singer Hailee Steinfeld and Swedish record producer Alesso, featuring American country music duo Florida Georgia Line and American singer-songwriter Watt');
      
      const menuVideoBuffer = "https://download2302.mediafire.com/ecmpxiu4viigBI4QawVgK7PlMyl8R9rcM9rRRzRb1JXqfZS3btIfWeD--aXwQVjiTo27qxQhdLdaNRFFCMwjPnF7o3xXv9BmWhiXDzAUSvnt2CV-IanfJCog5QSN1DCxO5LZVxK5RyL8Patarguzr7YDFFOmlL73Gn5rG6LafSdykw/0mmmyn19s28kdqy/A.Shop.for.Killers.E04.mp4";
      await buddy.sendVideo(m, menuVideoBuffer,'WebGl Format* Let Me Go Official Musical Video');

    } catch (error) {
      console.error("Error displaying menu:", error);
      await buddy.reply(m, "An error occurred while displaying the menu. Please try again later.");
    }
  }
};
