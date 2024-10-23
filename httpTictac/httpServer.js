const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let playerX = null; // Holds Player X's name
let playerO = null; // Holds Player O's name
let players = 0; // Track the number of players

// Check for a winner
function checkWinner(board) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Serve static HTML and assets
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Handle player joining the game
app.post('/join', (req, res) => {
  if (!playerX) {
    playerX = 'Player X';
    players++;
    return res.json({ player: 'X', playerName: playerX });
  } else if (!playerO) {
    playerO = 'Player O';
    players++;
    return res.json({ player: 'O', playerName: playerO });
  } else {
    return res.status(400).json({ error: 'Two players have already joined' });
  }
});

// Handle move requests
app.post('/move', (req, res) => {
  const { index, player } = req.body;
  if (typeof index !== 'number' || index < 0 || index > 8) {
    return res.status(400).json({ error: 'Invalid index' });
  }
  if (gameOver || board[index] !== null) {
    return res.status(400).json({ error: 'Invalid move or game is over' });
  }

  board[index] = currentPlayer;
  const winner = checkWinner(board);

  if (winner) {
    gameOver = true;
    return res.json({ board, message: `${winner === 'X' ? playerX : playerO} wins!`, currentPlayer, playerX, playerO });
  } else if (board.every(cell => cell !== null)) {
    gameOver = true;
    return res.json({ board, message: 'It\'s a draw!', currentPlayer, playerX, playerO });
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  res.json({ board, currentPlayer, playerX, playerO });
});

// Fetch the latest game state
app.get('/state', (req, res) => {
  res.json({ board, currentPlayer, gameOver, playerX, playerO });
});

// Reset the game
app.post('/reset', (req, res) => {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  players = 0;
  playerX = null;
  playerO = null;
  res.json({ message: 'Game has been reset', board, currentPlayer });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
