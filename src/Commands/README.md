## ✨ Features

- 📝 Text messaging with reply and react functionality
- 🖼️ Image and sticker sending
- 🎥 Video messaging
- 📄 Document sharing
- 🎵 Audio messages with voice note support
- 🔗 External ad replies with customizable content
- 👥 Mention users in messages
- ↪️ Forward messages seamlessly
- ✏️ Edit sent messages

## 📚 Usage Examples

### Sending Text Messages

**Reply to a Message:**
```javascript
await buddy.reply(m, 'This is a reply to your message');
```

**Send a New Message:**
```javascript
await buddy.send(m, 'Hello, world!');
```

**React to a Message:**
```javascript
await buddy.react(m, '👍');
```

**Edit a Sent Message:**
```javascript
const sentMsg = await buddy.send(m, 'Original message');
await buddy.editMsg(m, sentMsg, 'Updated message');
```

### Media Messaging

**Send an Image:**
```javascript
await buddy.sendImage(m, 'https://example.com/image.jpg', 'Check out this cool image!');
```

**Send a Video:**
```javascript
await buddy.sendVideo(m, './path/to/video.mp4', 'Awesome video content');
```

**Send an Image as Sticker:**
```javascript
await buddy.sendImageAsSticker(m, './path/to/image.png');
```

**Send a Video as Sticker:**
```javascript
await buddy.sendVideoAsSticker(m, './path/to/video.mp4');
```

**Send a Document:**
```javascript
await buddy.sendDocument(m, './path/to/file.pdf', 'application/pdf', 'Important_Document.pdf');
```

**Send an Audio Message:**
```javascript
await buddy.sendAudio(m, './path/to/audio.mp3', true); // true for voice note
```

### Advanced Features

**Send an External Ad Reply:**
```javascript
await buddy.externalAdReply(m, 'Check this out!', 'Amazing Product', 'Best deal ever', 1, './path/to/thumbnail.jpg');
```

**Reply with Mentions:**
```javascript
await buddy.replyWithMention(m, 'Hello', ['1234567890', '0987654321']);
```

**Forward a Message:**
```javascript
await buddy.forwardMessage(targetJid, messageToForward);
```

## 📖 API Reference

### buddy.reply(m, text)
Replies to a message with the given text.
- `m`: The message object to reply to
- `text`: The text content of the reply

### buddy.send(m, text)
Sends a new message in the same chat.
- `m`: The message object (used to get the chat ID)
- `text`: The text content of the new message

### buddy.react(m, emoji)
Reacts to a message with the specified emoji.
- `m`: The message object to react to
- `emoji`: A string containing the emoji to react with

### buddy.editMsg(m, sentMessage, newMessage)
Edits a previously sent message.
- `m`: The original message object
- `sentMessage`: The message object of the sent message to edit
- `newMessage`: The new text content

### buddy.sendImageAsSticker(m, bufferOrUrl)
Sends an image as a sticker.
- `m`: The message object (used to get the chat ID)
- `bufferOrUrl`: The image buffer or URL

### buddy.sendVideoAsSticker(m, bufferOrUrl)
Sends a video as a sticker.
- `m`: The message object (used to get the chat ID)
- `bufferOrUrl`: The video buffer or URL

### buddy.sendImage(m, bufferOrUrl, caption, asSticker = false)
Sends an image with an optional caption.
- `m`: The message object (used to get the chat ID)
- `bufferOrUrl`: The image buffer or URL
- `caption`: Optional caption for the image
- `asSticker`: Boolean to send as sticker (default: false)

### buddy.sendVideo(m, bufferOrUrl, caption, asSticker = false)
Sends a video with an optional caption.
- `m`: The message object (used to get the chat ID)
- `bufferOrUrl`: The video buffer or URL
- `caption`: Optional caption for the video
- `asSticker`: Boolean to send as sticker (default: false)

### buddy.sendDocument(m, bufferOrUrl, mimetype, fileName)
Sends a document file.
- `m`: The message object (used to get the chat ID)
- `bufferOrUrl`: The document buffer or URL
- `mimetype`: The MIME type of the document
- `fileName`: The filename to be displayed

### buddy.sendAudio(m, bufferOrUrl, ptt = false)
Sends an audio file, optionally as a voice note.
- `m`: The message object (used to get the chat ID)
- `bufferOrUrl`: The audio buffer or URL
- `ptt`: Boolean to send as voice note (default: false)

### buddy.externalAdReply(m, head, title, body, mediaType, thumbnailPath)
Sends a message with an external ad reply.
- `m`: The message object (used to get the chat ID)
- `head`: The header text of the ad
- `title`: The title of the ad
- `body`: The body text of the ad
- `mediaType`: The type of media (e.g., 1 for image)
- `thumbnailPath`: Path to the thumbnail image

### buddy.replyWithMention(m, text, users)
Replies to a message with text that mentions specific users.
- `m`: The message object to reply to
- `text`: The text content of the reply
- `users`: An array of user IDs to mention

### buddy.forwardMessage(jid, messageToForward, options = {})
Forwards a message to another chat.
- `jid`: The chat ID to forward the message to
- `messageToForward`: The message object to forward
- `options`: Additional options for forwarding (optional)

## 🌟 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Thanks to all our contributors and users!
- Special thanks to the @whiskeysockets/baileys community

---

Made with ❤️ by the Buddy Team
```
