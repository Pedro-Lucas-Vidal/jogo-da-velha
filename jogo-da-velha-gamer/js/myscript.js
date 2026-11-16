// Jogo da velha com tema de videogames. Duas pessoas jogam na mesma tela.
// As regras são as mesmas do jogo clássico, mas os símbolos são 🎮 e 👾.

const cells = Array.from(document.querySelectorAll('.cell'));
const statusElement = document.getElementById('status');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');
const restartButton = document.getElementById('reset-button');
const resetScoreButton = document.getElementById('reset-score');

const players = {
  X: { name: 'Controle', symbol: '🎮' },
  O: { name: 'Alien', symbol: '👾' }
};

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let finished = false;
let scores = { X: 0, O: 0, draws: 0 };

function playerTag(player) {
  return `<span class="team-name mark-${player.toLowerCase()}">${players[player].symbol} ${players[player].name}</span>`;
}

function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.draws;
}

function getWinningLine() {
  return winningLines.find(([a, b, c]) => board[a] !== '' && board[a] === board[b] && board[b] === board[c]);
}

function playTurn(index) {
  if (finished || board[index] !== '') return;

  board[index] = currentPlayer;
  const cell = cells[index];
  cell.textContent = players[currentPlayer].symbol;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.setAttribute('aria-label', `Linha ${Math.floor(index / 3) + 1}, coluna ${index % 3 + 1}, ${players[currentPlayer].name}`);
  cell.disabled = true;

  const winningLine = getWinningLine();
  if (winningLine) {
    finished = true;
    scores[currentPlayer]++;
    updateScoreboard();
    winningLine.forEach(position => cells[position].classList.add('winner'));
    statusElement.innerHTML = `${playerTag(currentPlayer)} venceu a partida! 🏆`;
    cells.forEach(button => button.disabled = true);
    return;
  }

  if (board.every(position => position !== '')) {
    finished = true;
    scores.draws++;
    updateScoreboard();
    statusElement.textContent = 'Empate! Comece outra partida.';
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusElement.innerHTML = `Vez de ${playerTag(currentPlayer)}`;
}

function newGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  finished = false;
  cells.forEach((cell, index) => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
    cell.setAttribute('aria-label', `Linha ${Math.floor(index / 3) + 1}, coluna ${index % 3 + 1}, vazio`);
  });
  statusElement.innerHTML = `Vez de ${playerTag('X')}`;
}

if (cells.length === 9 && statusElement && restartButton && resetScoreButton) {
  cells.forEach((cell, index) => cell.addEventListener('click', () => playTurn(index)));
  restartButton.addEventListener('click', newGame);
  resetScoreButton.addEventListener('click', () => {
    scores = { X: 0, O: 0, draws: 0 };
    updateScoreboard();
    newGame();
  });
}
