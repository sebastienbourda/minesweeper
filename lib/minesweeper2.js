const minesweeper = document.getElementById("minesweeper");
const playground = [];
const bombsElt = [];
const numCol = 20;
const numRow = 10;

function startGame() {
  console.log("coucou");
  for (let i = 0; i < numRow; i += 1) {
    let row = `<div class="line">`;
    for (let j = 0; j < numCol; j += 1) {
      row += `<div id="${i}${j}" data-row="${i}" data-column="${j}" class="cell unopened"></div>`;
    }
    row += '</div>';
    minesweeper.innerHTML += row;
  }
}

startGame();
