const { exec } = require('child_process');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Start the server based on the selected game mode
app.post('/startGame', (req, res) => {
  const { mode } = req.body;

  if (mode === 'http') {
    // Start HTTP server
    exec('node ./http/server.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting HTTP server: ${error.message}`);
        return res.status(500).json({ error: 'Error starting HTTP server' });
      }
      console.log(stdout);
      const shareableUrl = `http://localhost:8080/index.html`; // URL for HTTP mode
      return res.json({ message: `Game started in HTTP mode! Share this URL: ${shareableUrl}` });
    });
  } else if (mode === 'websocket') {
    // Start WebSocket server
    exec('node ./websocket/server.js', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting WebSocket server: ${error.message}`);
        return res.status(500).json({ error: 'Error starting WebSocket server' });
      }
      console.log(stdout);
      const shareableUrl = `http://localhost:8080/index.html`; // URL for WebSocket mode
      return res.json({ message: `Game started in WebSocket mode! Share this URL: ${shareableUrl}` });
    });
  } else {
    return res.status(400).json({ error: 'Invalid game mode' });
  }
});

// Serve the main menu
app.use(express.static(path.join(__dirname, 'public'))); // Serve your main HTML menu here

app.listen(PORT, () => {
  console.log(`Main server running on http://localhost:${PORT}`);
});
