document.addEventListener('DOMContentLoaded', () => {
  fetchStatistic();
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

async function fetchStatistic() {
  try {
      const response = await fetch('/stats'); // Sending a GET request to /stats
      if (!response.ok) {
          throw new Error('Failed to fetch statistics');
      }
      const stats = await response.json(); // Parse JSON response

      // Ensure uptime is a valid number
      if (typeof stats.uptime !== 'number' || isNaN(stats.uptime)) {
          throw new Error('Invalid uptime value');
      }

      // Convert uptime to formatted string
      const updateUptime = () => {
          const uptimeSeconds = Math.floor(stats.uptime);
          const uptimeMinutes = Math.floor(uptimeSeconds / 60) % 60;
          const uptimeHours = Math.floor(uptimeSeconds / 3600);
          const formattedUptime = `${uptimeHours} H, ${uptimeMinutes} M, ${uptimeSeconds % 60} S`;
          // Update DOM element with formatted uptime
          const uptimeElement = document.getElementById('uptime');
          uptimeElement.textContent = formattedUptime;
      };

      // Function to update uptime every second
      const startUptimeInterval = async () => {
          await updateUptime(); // initial update
          setInterval(updateUptime, 1000); // update every second
      };

      // Update response time (if needed)
      const responseTimeElement = document.getElementById('responseTime');
      responseTimeElement.textContent = `${(stats.responseTimeInSeconds + 5).toFixed(3)}s`; // Adding 5 seconds to response time

      // Start updating uptime
      await startUptimeInterval(); // await the initial update

  } catch (error) {
      console.error('Error fetching statistics:', error);
      // Optionally handle UI feedback for error state
      // Example: show an error message on the UI
      const uptimeElement = document.getElementById('uptime');
      uptimeElement.textContent = 'Error fetching uptime';
  }
}