### Messaging Functions

The `buddyMsg` utility provides the following functions:

#### Sending Text Messages

**Reply to a Message:**

```javascript
await buddy.reply(m, 'This is a reply to your message');
```

**Send a Message:**

```javascript
await buddy.send(m, 'This is a direct message');
```

**React to a Message:**

```javascript
await buddy.react(m, '👍');
```

#### Sending Media Messages

**Send an Image as a Sticker:**

```javascript
await buddy.sendImageAsSticker(m, bufferOrUrl);
```

**Send a Video as a Sticker:**

```javascript
await buddy.sendVideoAsSticker(m, bufferOrUrl);
```

**Send an Image:**

```javascript
await buddy.sendImage(m, bufferOrUrl, 'This is an image caption');
```

**Send a Video:**

```javascript
await buddy.sendVideo(m, bufferOrUrl, 'This is a video caption');
```

**Send a Document:**

```javascript
await buddy.sendDocument(m, bufferOrUrl, 'application/pdf', 'DocumentName.pdf');
```

**Send an Audio Message:**

```javascript
await buddy.sendAudio(m, bufferOrUrl, true); // ptt: true for Push-To-Talk, false otherwise
```

#### Advanced Features

**Reply with Mention:**

```javascript
await buddy.replyWithMention(m, 'Hello', ['user1', 'user2']);
```

**Forward a Message:**

```javascript
await buddy.forwardMessage('jid', messageToForward);
```
