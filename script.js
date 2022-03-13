const CELL_SIZE = 20;

const CANVAS_SIZE_WIDTH = 800;
const CANVAS_SIZE_HEIGHT = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE_WIDTH / CELL_SIZE;
const HEIGHT = CANVAS_SIZE_HEIGHT / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};

let MOVE_INTERVAL = 200;
let level = 1;
let isEatLifes = false;

const dinding = [
  {
    level: 2,
    position: [
      {
        x: 2,
        y: 2,
      },
      {
        x: 3,
        y: 2,
      },
      {
        x: 4,
        y: 2,
      },
      {
        x: 5,
        y: 2,
      },
      {
        x: 11,
        y: 2,
      },
      {
        x: 12,
        y: 2,
      },
      {
        x: 13,
        y: 2,
      },
      {
        x: 14,
        y: 2,
      },
    ],
  },
  {
    level: 3,
    position: [
      {
        x: 2,
        y: 2,
      },
      {
        x: 2,
        y: 3,
      },
      {
        x: 2,
        y: 4,
      },
      {
        x: 2,
        y: 5,
      },
      {
        x: 3,
        y: 2,
      },
      {
        x: 3,
        y: 2,
      },
      {
        x: 5,
        y: 2,
      },
      {
        x: 4,
        y: 2,
      },
    ],
  },

  {
    level: 4,
    position: [
      {
        x: 11,
        y: 10,
      },
      {
        x: 12,
        y: 10,
      },
      {
        x: 13,
        y: 10,
      },
      {
        x: 14,
        y: 10,
      },
      {
        x: 15,
        y: 10,
      },
      {
        x: 9,
        y: 14,
      },
      {
        x: 7,
        y: 14,
      },
      {
        x: 8,
        y: 14,
      },
      {
        x: 23,
        y: 24,
      },
      {
        x: 24,
        y: 24,
      },
      {
        x: 25,
        y: 24,
      },
    ],
  },
  {
    level: 5,
    position: [
      {
        x: 18,
        y: 13,
      },
      {
        x: 18,
        y: 12,
      },
      {
        x: 18,
        y: 14,
      },
      {
        x: 17,
        y: 17,
      },
      {
        x: 16,
        y: 17,
      },
      {
        x: 15,
        y: 17,
      },
      {
        x: 5,
        y: 2,
      },
      {
        x: 4,
        y: 2,
      },
    ],
  },
];

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

//this
function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}
//this
function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    position: initPosition(),
    score: 0,
    lifes: 3,
  };
}
let snake1 = initSnake("blue");
let apples = [
  {
    position: initPosition(),
  },
  {
    position: initPosition(),
  },
];

let diamonds = [
  {
    id: "dd",
    color: "green",
    position: initPosition(),
  },
];

let lifeDiamond = {
  color: "white",
  position: initPosition(),
};

function getWallPosition() {
  let position;
  // Untuk Dinding
  if (level > 1) {
    const findLevel = dinding.find(v => v.level == level);
    if (findLevel && Array.isArray(findLevel.position)) {
      position = findLevel.position;
    }
  }
  return position;
}

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}
//untuk score ular
function drawScore(snake) {
  let textScore = document.getElementById("TextScore");
  textScore.textContent = snake.score;
}
//untuk nyawanya
function drawlife(snake) {
  let textLifes = document.getElementById("TextLifes");
  textLifes.textContent = snake.lifes;
}

//untuk Level
function drawLevel(snake) {
  let TextLevel = document.getElementById("TextLevel");
  TextLevel.textContent = level;
}

function getImage() {
  var img = document.createElement("img");
  img.src = "./assets/nyawa.png";
  img.height = "20";
  img.width = "20";
  img.style.marginRight = "5px";
  return img;
}

function drawNyawa() {
  setTimeout(function () {
    let nyawaImg = document.getElementById("Nyawa");

    // Remove Child Element //
    while (nyawaImg.lastElementChild) {
      nyawaImg.removeChild(nyawaImg.lastElementChild);
    }

    // Create Child Element //
    for (let i = 0; i < snake1.lifes; i++) {
      nyawaImg.appendChild(getImage());
    }
  }, 200);
}

function primaryNumberCheck(snake) {
  let isPrimaryNumber = true;
  for (let i = 1; i <= snake.score; i++) {
    // Jika i bukan angka 1 atau skor //
    if ([1, snake.score].includes(i) == false) {
      // Jika Score mod i adalah 0 //
      if (snake.score % i == 0) {
        isPrimaryNumber = false;
        break;
      }
    }
  }
  return isPrimaryNumber;
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");

    ctx.clearRect(0, 0, CANVAS_SIZE_WIDTH, CANVAS_SIZE_HEIGHT);

    //import kepala ular
    let shead = document.getElementById("SnakeHead");

    ctx.drawImage(
      shead,
      snake1.head.x * CELL_SIZE,
      snake1.head.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    //Untuk manjangin ekor pas makan
    for (let i = 1; i < snake1.body.length; i++) {
      drawCell(ctx, snake1.body[i].x, snake1.body[i].y, snake1.color);
    }

    //untuk apel
    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i];
      var img = document.getElementById("apple");
      ctx.drawImage(
        img,
        apple.position.x * CELL_SIZE,
        apple.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }

    // Untuk Dinding
    let wallPosition = getWallPosition();
    if (Array.isArray(wallPosition)) {
      for (let i = 0; i < wallPosition.length; i++) {
        drawCell(ctx, wallPosition[i].x, wallPosition[i].y, "grey");
      }
    }

    //munculin score sama nyawa
    drawScore(snake1);
    drawlife(snake1);
    drawLevel(snake1);
  }, REDRAW_INTERVAL);

  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");
    //untuk diamond
    let isPrimaryNumber = primaryNumberCheck(snake1);

    // Jika Score adalah primary number dan di skor tersebut belum makan nyawa
    if (isPrimaryNumber && isEatLifes == false) {
      drawCell(
        ctx,
        lifeDiamond.position.x,
        lifeDiamond.position.y,
        lifeDiamond.color
      );

      var diamon = document.createElement("img");
      diamon.src = "./assets/diamond.png";
      diamon.height = "20";
      diamon.width = "20";

      ctx.drawImage(
        diamon,
        lifeDiamond.position.x * CELL_SIZE,
        lifeDiamond.position.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    }
  }, 200);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE_WIDTH / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE_HEIGHT / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}
//this
function eat(snake, apples, diamond) {
  let isEatApple = false;
  let x = snake.head.x;
  let y = snake.head.y;

  // Snake and apple
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];
    if (x == apple.position.x && y == apple.position.y) {
      snake.score++; //nambah score

      apple.position = initPosition();
      snake.body.push({ x, y }); //badan panjang
      isEatApple = true;

      if (snake.score % 5 == 0) {
        level++;

        // Jika Level kurang dari 5
        if (level < 6) {
          setTimeout(function () {
            alert(`Anda sekarang level ${level}`);
          }, 100);
          MOVE_INTERVAL -= 30;
        } else {
          // Jika Level lebih dari 5 (Permainan Selesai)
          MOVE_INTERVAL = 200;
          setTimeout(function () {
            alert(`Permainan Selesai`);
          }, 100);
          let headAndBody = initHeadAndBody();
          snake.head = headAndBody.head;
          snake.body = headAndBody.body;
          snake.lifes = 3;
          snake.direction = initDirection();
          snake.score = 0; //Balikan score 1
          level = 1; //Balikan level 1
          drawNyawa();
        }

        // Jeda dalam 1 detik untuk keluar allert
      }
      break;

      // Untuk Level
    }
  }

  // Snake and diamond
  if (x == diamond.position.x && y == diamond.position.y) {
    isEatLifes = true;
    drawNyawa();
    diamond.position = initPosition();
    snake.lifes++; //nambah nyawa
  }

  // Jika Ular makan Apple, maka nyawa berganti posisi
  else if (isEatApple) {
    diamond.position = initPosition();
    isEatLifes = false;
  }

  // Snake And Wall
  if (level > 1) {
    let wallPosition = getWallPosition();
    if (Array.isArray(wallPosition)) {
      for (let i = 0; i < wallPosition.length; i++) {
        let position = wallPosition[i];
        if (x == position.x && y == position.y) {
          snake.lifes--;
          drawNyawa();
          let headAndBody = initHeadAndBody();
          snake.head = headAndBody.head;
          snake.body = headAndBody.body;

          // Jika nyawa kurang atau sama dengan 0, maka game over
          if (snake.lifes <= 0) {
            setTimeout(function () {
              alert("Game Over!");
            }, 200);
            snake.lifes = 3;
            snake.direction = initDirection();
            snake.score = 0; //Balikan score 1
            level = 1; //Balikan level 1
            MOVE_INTERVAL = 200; //Balikan kecepatan awal
          }
          break;
        }
      }
    }
  }
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      snake.head.x--;
      break;
    case DIRECTION.RIGHT:
      snake.head.x++;
      break;
    case DIRECTION.DOWN:
      snake.head.y++;
      break;
    case DIRECTION.UP:
      snake.head.y--;
      break;
  }
  teleport(snake);
  eat(snake, apples, lifeDiamond);
  moveBody(snake);

  setTimeout(function () {
    move(snake);
  }, MOVE_INTERVAL);
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
  drawNyawa(snake1);
}
initGame();
