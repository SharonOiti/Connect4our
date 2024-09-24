const WIDTH = 7;
const HEIGHT = 6;

class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor() {
    this.board = [];
    this.currPlayer = null;
    this.players = [];
    this.isGameOver = false;

    this.makeBoard();
    this.makeHtmlBoard();
    this.addStartButtonListener();
  }

  makeBoard() {
    this.board = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null));
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', (evt) => this.handleClick(evt));

    for (let x = 0; x < WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < HEIGHT; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  addStartButtonListener() {
    document.getElementById('startButton').addEventListener('click', () => {
      const player1Color = document.getElementById('player1Color').value || 'red';
      const player2Color = document.getElementById('player2Color').value || 'blue';
      this.startGame(player1Color, player2Color);
    });
  }

  startGame(player1Color, player2Color) {
    this.makeBoard();
    this.players = [new Player(player1Color), new Player(player2Color)];
    this.currPlayer = this.players[0]; // Start with Player 1
    this.isGameOver = false;
    this.makeHtmlBoard();
  }

  findSpotForCol(x) {
    for (let y = HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color; // Set color dynamically
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
    this.isGameOver = true; // Set the game as over
  }

  handleClick(evt) {
    if (this.isGameOver) return; // Prevent further moves if game is over

    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) return;

    this.board[y][x] = this.currPlayer; // Track the current player
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`Player with color ${this.currPlayer.color} wins!`);
    }

    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  checkForWin() {
    const _win = (cells) => cells.every(([y, x]) =>
      y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && this.board[y][x] === this.currPlayer
    );

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

const game = new Game();
