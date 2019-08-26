window.onload = function() {
  const canvas = document.getElementById("canvas");
  const directionContainer = document.getElementById("direction-container");
  const context = canvas.getContext("2d");
  const CELL_SIZE = 25;
  const GRID_WIDTH = 15;
  const GRID_HEIGHT = 15;
  const FONT_FAMILY = "Courier";
  const STROKE_COLOR = "#DDDDDD";
  const STROKE_WIDTH = 0;
  const SCENE_COLOR = "#111111";
  const TILE_VAL = 1;
  const GOAL_VAL = 2;
  const PLAYER_VAL = 3;
  const DELAY = 10;
  const canvasStyles = {
    color: "#111111",
    border: { width: 4, color: "#222222", radius: 10 }
  };
  const player = { x: 5, y: 7, dir: {x: 0, y: 0 }, color: "orange" };
  const KEY_MAP = { 37: "left", 39: "right", 38: "up", 40: "down" };
  const colorMap = {
    0: "#333333",
    1: "#4466FF",
    2: "red",
    3: "teal",
    4: "#FF4488",
    5: "yellow",
    6: "#234F8F",
  };
  const moveRoutine = {
    left:function() {
      move(0, -1);
    },
    right: function() {
      move(0, 1);
    },
    up: function() {
      move(-1, 0);
    },
    down: function() {
      move(1, 0);
    }
  };
  const moveList = [];
  let grid = [];
  let isGameWin = false;
  let puzzleIndex = 0;
  let moveIndex = 0;
  let isPlay = false;
  let countToMove = 0;

  const loadPuzzle = function(index) {
    reset();
    grid = buildGrid(GRID_HEIGHT, GRID_WIDTH);
    addMatrixToGrid(puzzles[index], 2, 3);
  };

  const move = function(row, col) {
    const val = grid[player.y + row][player.x + col];

    if (val === 0 || val === GOAL_VAL) {
      player.x += col;
      player.y += row;
    }
  };

  const reset = function() {
    isGameWin = false;
    moveList.length = 0;
    moveIndex = 0;
    isPlay = false;
    directionContainer.innerHTML = "";
    clearGrid();
  };

  const setupScene = function() {
    document.body.style.background = SCENE_COLOR;
    canvas.style.background = canvasStyles.color;
    canvas.style.border = `solid ${canvasStyles.border.width}px
      ${canvasStyles.border.color}`;
    canvas.style.borderRadius = `${canvasStyles.border.radius}px`;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.width = CELL_SIZE * grid[0].length;
    canvas.height = grid.length * CELL_SIZE;
    canvas.style.marginTop = `${((window.innerHeight / 2) - (canvas.height / 2))}px`;
  };

  const buildGrid = function(rows, cols) {
    const matrix = [];

    for (let i = 0; i < rows; i ++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j ++)
            matrix[i][j] = 0;
    }
    return matrix;
  };

  const clearGrid = function() {
    for (let i = 0; i < grid.length; i ++) {
        for (let j = 0; j < grid[i].length; j ++)
            grid[i][j] = 0;
    }
  };

  const addMatrixToGrid = function(matrix, row, col) {
    let y = 0;
    let x = 0;

    for (let i = row; i < row + matrix.length; i ++) {
      for (let j = col; j < col + matrix[y].length; j ++) {
        if (matrix[y][x] !== 0 && matrix[y][x])
          grid[i][j] = matrix[y][x];

        x ++;
        if (x >= matrix[y].length) {
          if (y < matrix.length - 1) {
            x = 0;
            y ++;
          }
        }
        if (grid[i][j] === PLAYER_VAL) {
          player.x = j;
          player.y = i;
        }

      }
    }
  };

  const renderGrid = function(matrix) {
    for (let i = 0; i < matrix.length; i ++) {
      for (let j = 0; j < matrix[i].length; j ++) {
        context.lineWidth = STROKE_WIDTH;
        context.strokeStyle = STROKE_COLOR;
        context.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        context.fillStyle = colorMap[matrix[i][j]];
        context.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  const renderPlayer = function() {
    context.lineWidth = STROKE_WIDTH;
    context.strokeStyle = STROKE_COLOR;
    context.fillStyle = player.color;
    context.fillRect(player.x * CELL_SIZE, player.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    context.strokeRect(player.x * CELL_SIZE, player.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  };

  const update = function() {
    if (isPlay) {
      countToMove ++;
      if (countToMove >= DELAY) {
        countToMove = 0;
        if (moveIndex < moveList.length - 1) {
          const keyCode = moveList[moveIndex];
          moveRoutine[KEY_MAP[keyCode]]();
          moveIndex ++;
        } else {
          if (grid[player.y][player.x] === GOAL_VAL) {
            isGameWin = true;
            // console.log("Win");
          } else {
            // console.log('Lost');
          }
        }
      }
    }
  };

  const draw = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderGrid(grid);
    renderPlayer();
  };

  const tick = function() { update(); draw(); requestAnimationFrame(tick); };

  document.onkeydown = function({ keyCode }) {
     if (moveRoutine[KEY_MAP[keyCode]]) {
       moveList.push(keyCode);
       directionContainer.innerHTML += KEY_MAP[keyCode].toUpperCase() + " ";
     }
  };

  loadPuzzle(puzzleIndex);

  setupScene();

  context.font = `${CELL_SIZE * 0.8}px ${FONT_FAMILY}`;
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  startBtn.onclick = function() {
    isPlay = true;
  };

  nextBtn.onclick = function() {
    if (puzzleIndex < puzzles.length - 1) {
      puzzleIndex ++;
      reset();
      loadPuzzle(puzzleIndex);
    }
  };

  prevBtn.onclick = function() {
    if (puzzleIndex > 0) {
      puzzleIndex --;
      reset();
      loadPuzzle(puzzleIndex);
    }
  };

  tick();
}
