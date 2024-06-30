let socket;
let username;

// Assuming you have a function to fetch data asynchronously
async function fetchOwnerName() {
    try {
        const response = await fetch('/ownername'); // Sending a GET request to /ownername
        if (!response.ok) {
            throw new Error('Failed to fetch owner name');
        }
        const ownerName = await response.text(); // Assuming the response is plain text
       username = ownerName
    } catch (error) {
        console.error('Error fetching owner name:', error);
    }
}

// Call fetchOwnerName when needed, such as when the page loads
fetchOwnerName();

// Function to initialize WebSocket connection
function initWebSocket() {
    socket = new WebSocket('ws://localhost:4000'); // Replace with your WebSocket server URL

    // Handle WebSocket connection opened
    socket.addEventListener('open', function (event) {
        console.log('WebSocket connected');
    });

    // Handle incoming messages from WebSocket server
    socket.addEventListener('message', function (event) {
        const data = JSON.parse(event.data);
        switch (data.type) {
            case 'message':
                displayMessage(data);
                break;
            case 'userCount':
                updateOnlineUsers(data.count);
                break;
            case 'typing':
                updateTypingIndicator(data.name, data.typing);
                break;
            // Add more cases for handling status updates, user list, etc.
            default:
                console.log('Unknown message type:', data.type);
        }
    });

    // Handle WebSocket connection closed
    socket.addEventListener('close', function (event) {
        console.log('WebSocket disconnected');
    });

    // Handle WebSocket errors
    socket.addEventListener('error', function (error) {
        console.error('WebSocket error:', error);
    });
}

// Open chat box
function openChat() {
    const chatBox = document.querySelector('.chat-container');
    chatBox.classList.remove('hidden');
    document.querySelector('.chatBoxOpen').classList.add('hidden');
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        initWebSocket();
    }
}

// Close chat box
function hideChat() {
    const chatBox = document.querySelector('.chat-container');
    chatBox.classList.add('hidden');
    document.querySelector('.chatBoxOpen').classList.remove('hidden');
}

// Function to send a message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message !== '' && socket && socket.readyState === WebSocket.OPEN) {
        const data = {
            type: 'message',
            name: username, // Replace with actual username if available
            content: message,
        };
        socket.send(JSON.stringify(data));
        messageInput.value = '';
    }
}

// Function to display a message in the chat box
function displayMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', 'animate-fadeIn', message.clientId === 'moderator' ? 'bot-message' : 'user-message');
    messageElement.innerHTML = `
        <span class="message-info">${message.name} • ${formatTimestamp(message.timestamp)}</span>
        <p class="message-content">${message.content}</p>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
}

// Format timestamp to HH:MM
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Function to update online user count
function updateOnlineUsers(count) {
    const connectionStatus = document.querySelector('.connection-status');
    connectionStatus.classList.toggle('bg-green-400', count > 0);
    connectionStatus.classList.toggle('bg-red-400', count === 0);
    connectionStatus.title = `${count} user${count !== 1 ? 's' : ''} online`;
}

// Function to update typing indicator
function updateTypingIndicator(name, typing) {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typing) {
        typingIndicator.textContent = `${name} is typing...`;
        typingIndicator.classList.remove('hidden');
    } else {
        typingIndicator.classList.add('hidden');
    }
}


