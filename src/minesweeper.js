console.log("Well played! You found the source code! But wait, there is no clue ...");
console.log("Minesweeper");
console.log("By: Sébastien Bourda --> https://www.linkedin.com/in/sebastien-bourda/");
const selectLevels = document.getElementById("levels");
const body = document.querySelector("body");
const minesweeper = document.getElementById("minesweeper");
const playground = [];
const bombsElt = [];
const disclaimer = document.createElement("div");
const boxes = document.querySelectorAll(".cell");

let level;


disclaimer.style.zIndex = "-1";
disclaimer.style.opacity = 0;

disclaimer.classList.add("disclaimer");

const playAgainButton = document.createElement("button");
playAgainButton.innerHTML = "Play again";
playAgainButton.classList.add("play-again");
playAgainButton.addEventListener("click", () => {
  location.reload();
});

let messageWrapper = document.createElement('div');
messageWrapper.id = "message-wrapper";


disclaimer.append(messageWrapper);
disclaimer.appendChild(playAgainButton);

body.appendChild(disclaimer);


let levels = {
  beginner: {
    rows: 9,
    columns: 9,
    mines: 10
  },
  intermediate: {
    rows: 16,
    columns: 16,
    mines: 40
  },
  advanced: {
    rows: 16,
    columns: 30,
    mines: 99
  },
  expert: {
    rows: 50,
    columns: 50,
    mines: 500
  },
  extraterrestrial: {
    rows: 100,
    columns: 100,
    mines: 2000
  }
};


level = levels[selectLevels.value];
let rows = level.rows;
let columns = level.columns;
let mines = level.mines;


function initializeGame() {
  minesweeper.innerHTML = ""; // Clear the minesweeper grid

  level = levels[selectLevels.value];

  // Update rows, columns, and mines
  rows = level.rows;
  columns = level.columns;
  mines = level.mines;


  playground.length = 0; // Clear the playground array
  bombsElt.length = 0; // Clear the bombsElt array


  initPlayground(level.rows, level.columns);
  setMines(level.rows, level.columns, level.mines);
  setPlayground(level.rows, level.columns);
  startGame();
  idBomb(level.rows, level.columns);
}


selectLevels.addEventListener("change", (event) => {
  initializeGame();
});


function attachEventListenersToCells() {
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
              // bomb.innerText += "X";
              bomb.classList.add('mine');
              bomb.classList.add('opened');
            });
            boxes.forEach((box) => {
              box.classList.add('disabled');
            });
            displayDisclaimer(false);
          } else {
            box.innerText += playground[row][column];
          }
        }
        checkWin();
      });
      box.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (box.classList.contains('unopened')) {
          if (!box.classList.contains('flagged') && !box.classList.contains('question')) {
            box.classList.add('flagged');
          } else if (box.classList.contains('flagged')) {
            box.classList.remove('flagged');
            box.classList.add('question');
          } else if (box.classList.contains('question')) {
            box.classList.remove('question');
          }
        }
        checkWin();
      });
    }
  });
}


function startGame() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight * 0.9;

  const rows = level.rows;
  const columns = level.columns;

  let cellHeight = Math.floor(screenHeight / rows) + 1;
  let cellWidth = Math.floor(screenWidth / columns);

  let grid = "";
  for (let i = 0; i < rows; i++) {
    let row = '<div class="line" style="height:' + cellHeight + 'px;">';
    for (let j = 0; j < columns; j++) {
      row += `<div id="${i}${j}" data-row="${i}" data-column="${j}" class="cell unopened" style="width:${cellWidth}px;height:${cellHeight}px;"></div>`;
    }
    row += '</div>';
    grid += row;
  }

  minesweeper.innerHTML = grid;

  // Call the function to attach event listeners to the new grid's cells
  attachEventListenersToCells();
}


function idBomb() {
  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < columns; j += 1) {
      if (playground[i][j] === "X") {
        bombsElt.push(document.getElementById(`${i}${j}`));
      }
    }
  }
  return bombsElt;
}

function initPlayground() {
  for (let i = 0; i < rows; i += 1) {
    let line = [];
    for (let j = 0; j < columns; j++) {
      line.push(0);
    }
    playground.push(line);
  }
}

function setMines() {
  for (let i = 0; i < mines; i += 1) {
    let row, column;
    do {
      row = Math.floor(Math.random() * rows);
      column = Math.floor(Math.random() * columns);
    } while (playground[row][column] === "X");

    playground[row][column] = "X";
  }
  // console.log(playground);
}


function inPlayground(x, y, i, j) {
  const inPlaygroundX = ((x + i) >= 0 && (x + i) < rows);
  const inPlaygroundY = ((y + j) >= 0 && (y + j) < columns);
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
  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < columns; j += 1) {
      if (playground[i][j] !== "X") {
        checkAround(i, j);
      }
    }
  }
}

initializeGame();


function checkWin() {
  const unopenedBoxes = document.querySelectorAll(".unopened");
  let win = false;
  let sum = 0;

  for (let i = 0; i < rows; i += 1) {
    for (let j = 0; j < columns; j += 1) {
      const box = document.getElementById(`${i}${j}`);
      if (box.classList.contains("unopened")) {
        const boxPlayground = playground[i][j];
        if (boxPlayground === "X") {
          sum += 1;
        }
      }
    }
  }
  if (sum === unopenedBoxes.length) {
    win = true
  }

  if (win) {
    boxes.forEach((box) => {
      box.classList.add("opened");
      box.classList.remove("flagged");
      box.classList.remove("question");
    });
    bombsElt.forEach(bomb => {
      bomb.classList.add("mine");
    });
    displayDisclaimer(true);
  }
}

const displayDisclaimer = (bool) => {
  let message = '';
  messageWrapper = document.getElementById('message-wrapper');
  if (bool) {
    message = "You won !";
  }else {
    message = "You loose !";
  }
  messageWrapper.innerHTML = message;
  disclaimer.hidden = false;
  disclaimer.style.zIndex = "1";
  disclaimer.style.opacity = "1";
}
