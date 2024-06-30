document.addEventListener('DOMContentLoaded', () => {
    const userCountElement = document.getElementById('buddysonline');
  
    // Replace 'ws://localhost:4000' with your WebSocket server URL
    const socket = new WebSocket('ws://localhost:4000');
  
    socket.addEventListener('open', () => {
      console.log('Connected to the server');
    });
  
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
  
      if (data.type === 'userCount') {
        // Update the user count in the UI
        userCountElement.textContent = `${data.count}`;
      }
    });
  
    socket.addEventListener('close', () => {
      console.log('Disconnected from the server');
    });
  
    socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });