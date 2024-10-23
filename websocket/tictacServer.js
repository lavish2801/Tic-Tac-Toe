const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = [];
let board = Array(9).fill(' ');
let currentPlayer = 'X';
let winningIndex = null; // Variable to track the winning move index

app.use(express.static(path.join(__dirname, 'public')));

function broadcast(message) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
  )
}

function isWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    if (pattern.every(index => board[index] === currentPlayer)) {
      winningIndex = pattern; // Store the winning pattern indices
      return true;
    }
  }
  return false;
}

function isDraw() {
  return board.every(cell => cell !== ' ');
}

wss.on('connection', (socket) => {
  if (clients.length >= 2) {
    socket.send(JSON.stringify({ type: 'error', message: 'Game is full!' }));
    socket.close();
    return;
  }

  const playerSymbol = clients.length === 0 ? 'X' : 'O';
  clients.push(socket);

  socket.send(JSON.stringify({
    type: 'init',
    board,
    currentPlayer,
    playerSymbol,
  }));

  socket.on('message', (message) => {
    const { index } = JSON.parse(message);

    // Ignore the move if it's invalid or the game is over
    if (board[index] !== ' ' || currentPlayer !== playerSymbol || winningIndex) return;

    board[index] = currentPlayer;

    // Check for a winner right after a move
    if (isWinner()) {
      clients.forEach(client => {
        client.send(JSON.stringify({ type: 'end', message: `${playerSymbol} wins!`, winningIndex }));
      });
      board = Array(9).fill(' ');
      winningIndex = null; // Reset winning index for the next game
    } else if (isDraw()) {
      clients.forEach(client => {
        client.send(JSON.stringify({ type: 'end', message: 'Draw!' }));
      });
      board = Array(9).fill(' ');
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Switch player
      // Broadcast the updated game state to all clients
      clients.forEach(client => {
        client.send(JSON.stringify({ type: 'update', board, currentPlayer }));
      });
    }
  });

  socket.on('close', () => {
    clients = clients.filter(client => client !== socket);
    clients.forEach(client => {
      client.send(JSON.stringify({ type: 'end', message: 'A player left. Game over!' }));
    });
    board = Array(9).fill(' ');
    winningIndex = null; // Reset winning index
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
