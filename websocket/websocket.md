### Tic-Tac-Toe Game Built Using WebSocket

**Overview**

The Tic-Tac-Toe game developed using WebSocket technology allows real-time multiplayer interactions between two players. This web-based implementation provides a dynamic gaming experience where players can connect and compete against each other in a classic game of Xs and Os.

**Technology Stack**

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express, WebSocket
- **Communication Protocol**: WebSocket for real-time bidirectional communication

**Game Features**

1. **Real-Time Multiplayer**:
   - The game utilizes WebSocket to facilitate instant communication between players. As soon as one player makes a move, the other player sees the update in real-time without needing to refresh the page.

2. **Player Roles**:
   - The game assigns player symbols ('X' and 'O') based on the order of connection. The first player to connect becomes 'X', while the second player is assigned 'O'.

3. **Game Board**:
   - The board consists of a 3x3 grid, represented as an array. Players can click on empty cells to make their moves, and the game updates the board accordingly.

4. **Win Conditions**:
   - The game checks for win conditions after every move. It recognizes three consecutive symbols in a row, column, or diagonal as a win. If a player wins, a message is displayed, and the winning cells are highlighted.

5. **Draw Conditions**:
   - If all cells are filled without a winner, the game announces a draw.

6. **Dynamic User Interface**:
   - The game interface provides clear status updates, indicating whose turn it is, as well as displaying the winner or a draw when the game ends.

7. **User Experience Enhancements**:
   - Upon winning or drawing, a message is displayed, and the board becomes non-interactive to prevent further moves.

8. **Player Disconnection Handling**:
   - If a player disconnects, the game is terminated, and all connected players are notified that the game has ended.

**How It Works**

1. **WebSocket Server Setup**:
   - The server is set up using Node.js and the `ws` library. It listens for player connections and maintains a list of connected clients.
   - When a player connects, they are assigned a symbol, and the server initializes the game state.

2. **Handling Moves**:
   - Players send their moves to the server via WebSocket messages. The server processes these moves, updates the game state, and broadcasts the updated state to all connected clients.

3. **Game Logic**:
   - The server implements logic to check for winning combinations or draws after each move. It manages the current player's turn and handles game resets upon completion.

4. **Frontend Interactions**:
   - The frontend communicates with the WebSocket server, updates the UI based on messages received, and provides immediate feedback to players on their actions and game outcomes.

**Conclusion**

This WebSocket-based Tic-Tac-Toe game exemplifies real-time web application capabilities, providing an interactive platform for users to engage in multiplayer gaming. The use of WebSocket technology ensures a smooth and responsive user experience, making it an excellent project for learning about web development, real-time communication, and game design principles.