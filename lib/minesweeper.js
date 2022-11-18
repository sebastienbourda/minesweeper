const minesweeper = document.getElementById("minesweeper");
const playground = [];
const bombsElt = [];
const numCol = 20;
const numRow = 10;



function startGame() {
  for (let i = 0; i < numRow; i += 1) {
    let row = `<div class="line">`;
    for (let j = 0; j < numCol; j += 1) {
      row += `<div id="${i}${j}" data-row="${i}" data-column="${j}" class="cell unopened"></div>`;
    }
    row += '</div>';
    minesweeper.innerHTML += row;
  }
}
function idBomb() {
  for (let i = 0; i < numRow; i += 1) {
    for (let j = 0; j < numCol; j += 1) {
      if (playground[i][j] === "X") {
        bombsElt.push(document.getElementById(`${i}${j}`));
      }
    }
  }
  return bombsElt;
}

function initPlayground() {
  for (let i = 0; i < numRow; i += 1) {
    let line = [];
    for (let j = 0; j < numCol; j++) {
      line.push("0");
    }
    playground.push(line);
  }
}

function setMines() {
  const boxNumbers = (numCol * numRow);
  for (let i = 0; i < boxNumbers * 0.1 + 1; i += 1) {
    const row = Math.floor(Math.random() * numRow);
    const column = Math.floor(Math.random() * numCol);
    playground[row][column] = "X";
  }
  console.log(playground);
}

function inPlayground(x, y, i, j) {
  const inPlaygroundX = ((x + i) >= 0 && (x + i) < numRow);
  const inPlaygroundY = ((y + j) >= 0 && (y + j) < numCol);
  return (inPlaygroundX && inPlaygroundY);
}

function checkAround(x, y) {
  let sumMines = 0;
  for (let i = -1; i <= 1; i += 1) {
    for (let j = -1; j <= 1; j += 1) {
      if (!(i === 0 && j === 0)) {
        if (inPlayground(x, y, i, j)) {
          if (playground[x + i][y + j] === "X") {
            sumMines += 1;
          }
        }
      }
    }
    playground[x][y] = sumMines;
  }
}


const openNeighbour = (box, x, y) => {
  for (let i = -1; i <= 1; i += 1) {
    for (let j = -1; j <= 1; j += 1) {
      if (!(i === 0 && j === 0)) {
        if (inPlayground(x, y, i, j)) {
          const neighbour = document.getElementById(`${x + i}${y + j}`);
          if (neighbour.classList.contains("unopened")) {
            if (playground[x + i][y + j] === 0) {
              neighbour.classList.remove("unopened");
              neighbour.classList.add("opened");
              openNeighbour(neighbour, x + i, y + j);
            } else {
              neighbour.classList.remove("unopened");
              neighbour.classList.add("opened");
              neighbour.innerText += playground[x + i][y + j];
            }
          }
        }
      }
    }
  }
};

function setPlayground() {
  // Iterate on each box with coordinates
  for (let i = 0; i < numRow; i += 1) {
    for (let j = 0; j < numCol; j += 1) {
      if (playground[i][j] !== "X") {
        checkAround(i, j);
      }
    }
  }
}

function checkWin() {
  let sum = 0;
  for (let i = 0; i < numRow; i += 1) {
    for (let j = 0; j < numCol; j += 1) {
      const box = document.getElementById(`${i}${j}`);
      if (box.classList.contains("opened")) {
        sum += 1;
      }
    }
  }
  console.log(sum >= (numRow * numCol) - ((numCol * numRow) * 0.1))
  if (sum >= (numRow * numCol) - ((numCol * numRow) * 0.1)) {
    alert('you win');
  }
}

initPlayground();
setMines();
setPlayground();
startGame();
idBomb();

const boxes = document.querySelectorAll(".cell");

boxes.forEach((box) => {
  if (!box.classList.contains("disabled")) {
    box.addEventListener('click', (event) => {
      if (box.classList.contains("unopened")) {
        box.classList.remove("unopened");
        box.classList.remove("flagged");
        box.classList.remove("question");
        box.classList.add("opened");
        let row = parseInt(box.dataset.row, 10);
        let column = parseInt(box.dataset.column, 10);
        if (playground[row][column] === 0) {
          openNeighbour(box, row, column);
        } else if (playground[row][column] === "X") { // click on a bomb
          bombsElt.forEach((bomb) => {
            bomb.innerText += "X";
            bomb.classList.add('opened');
          });
          boxes.forEach((box) => {
            box.classList.add('disabled');
          });
        } else {
          box.innerText += playground[row][column];
        }
      }
      checkWin();
    });
    box.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      if (!box.classList.contains('flagged') && !box.classList.contains('question')) {
        box.classList.add('flagged');
      } else if (box.classList.contains('flagged')) {
        box.classList.remove('flagged');
        box.classList.add('question');
      } else if (box.classList.contains('question')) {
        box.classList.remove('question');
      }
    });
  }
});
