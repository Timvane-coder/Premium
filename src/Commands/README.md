# Buddy Messaging Functions

This module provides a set of functions for interacting with WhatsApp messages using buddy-md.

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

## Usage

### Reply to a message
```javascript
await buddy.reply(m, 'Hello 👋');
```

### Send a message
```javascript
await buddy.send(m, 'This is a new message');
```

### React to a message
```javascript
await buddy.react(m, '👍');
```

### Edit a sent message
```javascript
await buddy.editMsg(m, sentMessage, 'Updated message text');
```

### Delete a message
```javascript
await buddy.deleteMsg(m);
```

### Send a sticker
```javascript
await buddy.sendSticker(m, stickerBufferOrUrl);
```

### Send an image
```javascript
await buddy.sendImage(m, imageBufferOrUrl, 'Image caption');
```

### Send a video
```javascript
await buddy.sendVideo(m, videoBufferOrUrl, 'Video caption');
```

### Send a document
```javascript
await buddy.sendDocument(m, documentBufferOrUrl, 'application/pdf', 'document.pdf', 'Document caption');
```

### Send an audio message
```javascript
await buddy.sendAudio(m, audioBufferOrUrl, true); // Set to true for voice note
```

### Send a GIF
```javascript
await buddy.sendGif(m, gifBufferOrUrl);
```

### Send a message with external ad reply
```javascript
await buddy.externalAdReply(m, 'Header', 'Title', 'Body', 1, 'path/to/thumbnail.jpg');
```

### Reply with mention
```javascript
await buddy.replyWithMention(m, 'Hello', ['1234567890', '0987654321']);
```

### Forward a message
```javascript
await buddy.forwardMessage(targetJid, messageToForward);
```

### Get quoted text
```javascript
const quotedText = await buddy.getQuotedText(m);
```

### Get quoted media
```javascript
const quotedMedia = await buddy.getQuotedMedia(m);
```

### Get message type
```javascript
const messageType = await buddy.getMessageType(m);
```

### Get quoted message type
```javascript
const quotedMessageType = await buddy.getQuotedMessageType(m);
```

### Get caption message
```javascript
const captionMessage = await buddy.getCaptionMessage(m);
```

### Get response text
```javascript
const response = await buddy.getResponseText(key, sentMessage, timeout);
```

### Download quoted media
```javascript
const mediaData = await buddy.downloadQuotedMedia(m);
```

### Download media message
```javascript
const mediaData = await buddy.downloadMediaMsg(m);
```

### Change font
```javascript
const styledText = await buddy.changeFont('Hello', 'scriptBold');
```

### Get file size in MB
```javascript
const fileSizeMB = await buddy.getFileSizeInMB(m);
```

### Save file to temp directory
```javascript
const filePath = await buddy.saveFileToTemp(bufferData, 'filename.ext');
```

Note: Replace `m` with the appropriate message object in each function call.
