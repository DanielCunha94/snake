const canvas = document.getElementById("cvs");
const c = canvas.getContext("2d");
let gameSpeed = 9;
let speedIncrementor = 50;
let frames = 0;
let score = 0;
let bestScore = 0;

const state = {
  current: 1,
  restart: 0,
  game: 1,
};

const snake = {
  body: [
    { x: 300, y: 400 },
    { x: 320, y: 400 },
    { x: 340, y: 400 },
    { x: 360, y: 400 },
  ],

  speed: { x: -20, y: 0 },

  draw: function () {
    for (let i = 0; i <= this.body.length - 1; i++) {
      c.fillStyle = "#696969";
      c.strokeStyle = "black";
      c.fillRect(this.body[i].x, this.body[i].y, 20, 20);
      c.strokeRect(this.body[i].x, this.body[i].y, 20, 20);
    }
  },

  update: function () {
    if (
      this.body[0].x >= 0 &&
      this.body[0].x <= 580 &&
      this.body[0].y >= 0 &&
      this.body[0].y <= 580
    ) {
      for (let i = this.body.length - 1; i >= 1; i--) {
        this.body[i].x = this.body[i - 1].x;
        this.body[i].y = this.body[i - 1].y;
      }
      this.body[0].x += this.speed.x;
      this.body[0].y += this.speed.y;
    }

    
  },

  move: function (x) {
    switch (x) {
      case "a":
        if (this.speed.x != 20) {
          this.speed.x = -20;
          this.speed.y = 0;
        }
        break;
      case "d":
        if (this.speed.x != -20) {
          this.speed.x = 20;
          this.speed.y = 0;
        }
        break;
      case "w":
        if (this.speed.y != 20) {
          this.speed.x = 0;
          this.speed.y = -20;
        }
        break;
      case "s":
        if (this.speed.y != -20) {
          this.speed.x = 0;
          this.speed.y = 20;
        }
        break;
    }
  },

  isEating: function (x, y) {
    if (this.body[0].x === x && this.body[0].y === y) {
      return true;
    } else {
      return false;
    }
  },

  grow: function () {
    this.body.push({ x: 1, y: 1 });
  },

  isDead: function () {
    let flag = 0;
    for (var i = 1; i <= this.body.length - 1; i++) {
      if (
        this.body[0].x === this.body[i].x &&
        this.body[0].y === this.body[i].y
      ) {
        flag = 1;
      }
    }
    if (
      flag == 1 ||
      this.body[0].x < 0 ||
      this.body[0].x > 580 ||
      this.body[0].y < 0 ||
      this.body[0].y > 580
    ) {
      return true;
    } else {
      return false;
    }
  },
};

const food = {
  x: 240,
  y: 240,

  draw: function () {
    c.fillStyle = "red";
    c.strokeStyle = "black";
    c.fillRect(this.x, this.y, 20, 20);
    c.strokeRect(this.x, this.y, 20, 20);
  },

  update: function () {
    this.x = (Math.floor(Math.random() * 29 - 0.5) + 1) * 20;
    this.y = (Math.floor(Math.random() * 29 - 0.5) + 1) * 20;
  },
};

loop();

function loop() {
  frames++;
  if (frames % gameSpeed === 0) {
    update();
  }
  document.getElementById("score").innerHTML = "Score: " + score;
  document.getElementById("bestScore").innerHTML = " Best Score: " + bestScore;
  window.requestAnimationFrame(loop);
}

function update() {
  if (!snake.isDead()) {
    c.fillStyle = "#9ed670";
    c.fillRect(0, 0, 600, 600);
    snake.update();
    snake.draw();
    console.log(snake.isEating(food.x, food.y));
    if (snake.isEating(food.x, food.y)) {
      snake.grow();
      food.update();
      score += 10;
    }
    food.draw();
    if (score % speedIncrementor === 0 && gameSpeed > 3 && score > 0) {
      speedIncrementor *= 2;
      gameSpeed--;
    }
  } else {
    if (score > bestScore) {
      bestScore = score;
    }
    state.current = state.restart;
  }
}

document.addEventListener("keypress", function (e) {
  switch (state.current) {
    case state.restart:
      if (e.key === " ") {
        gameSpeed = 9;
        speedIncrementor = 50;
        snake.body = [
          { x: 300, y: 400 },
          { x: 320, y: 400 },
          { x: 340, y: 400 },
          { x: 360, y: 400 },
        ];
        snake.speed = { x: -20, y: 0 };
        food.update();
        score = 0;
        frames = 0;
        state.current = state.game;
      }
      break;
    case state.game:
      if (e.key == "a" || e.key == "w" || e.key == "s" || e.key == "d") {
        snake.move(e.key);
        update();
      }
      break;
  }
});
