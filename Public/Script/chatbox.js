const socket = new WebSocket('ws://localhost:4000');

// Function to open chat box
function openChat() {
    document.querySelector('.chat-container').classList.remove('hidden');
    document.querySelector('.chatBoxOpen').classList.add('hidden');
}

// Function to hide chat box
function hideChat() {
    document.querySelector('.chat-container').classList.add('hidden');
    document.querySelector('.chatBoxOpen').classList.remove('hidden');
}

// Emoji picker toggle
document.querySelector('.emoji-trigger').addEventListener('click', function () {
    document.querySelector('.emoji-list').classList.toggle('hidden');
});

// Function to add a new message to the chat
function addMessage(name, message, timestamp, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', 'animate-fadeIn', isUser ? 'user-message' : 'bot-message');

    // Format the message display
    const formattedMessage = `<div class="message-info flex items-center justify-between mb-1">
                                <span class="font-semibold ${isUser ? 'text-blue-500' : 'text-green-500'}">${name}</span>
                                <span class="text-xs text-gray-400">${timestamp}</span>
                              </div>
                              <div class="message-content">${message}</div>`;

    messageDiv.innerHTML = formattedMessage;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Event listener for send button
document.getElementById('sendMessageBtn').addEventListener('click', function () {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message !== '') {
        sendMessageToServer(message);
        input.value = '';
    }
});

// Event listener for Enter key
document.getElementById('messageInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.getElementById('sendMessageBtn').click();
    }
});

// Function to send message to server
function sendMessageToServer(message) {
    const data = {
        type: 'message',
        name: 'User', // Replace with actual user name or identifier
        content: message,
    };
    socket.send(JSON.stringify(data));
}

// Handle incoming messages from server
socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    if (data.type === 'message') {
        const { name, content, timestamp } = data;
        addMessage(name, content, timestamp, false); // Add bot message to chat
    }
});
