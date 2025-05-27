const model = {
  score: 0,
  timeLeft: 30,
  maxMoles: 3,
  intervalId: null,
  timerId: null,
  snakeIntervalId: null,
  snakeIndex: null,
  moleTimeouts: [],
  boardStatus: Array.from({ length: 12 }, (_, i) => ({
    id: i,
    hasMole: false,
    hasSnake: false,
  }))
};

const view = {
  scoreDisplay: document.getElementById("score"),
  timerDisplay: document.getElementById("timer"),
  board: document.getElementById("gameBoard"),
  startButton: document.getElementById("startBtn"),

  renderBoard() {
    this.board.innerHTML = "";
    for (let i = 0; i < 12; i++) {
      const hole = document.createElement("div");
      hole.classList.add("hole");
      hole.dataset.id = i;
      hole.addEventListener("click", controller.hitEmpty);
      this.board.appendChild(hole);
    }
  },

  showMole(index) {
    if (model.boardStatus[index].hasSnake) return; // Don't show mole where snake is

    const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
    const img = document.createElement("img");
    img.src = "mole.jpeg";
    img.alt = "mole";
    img.classList.add("mole");
    img.addEventListener("click", controller.hitMole);
    hole.innerHTML = "";
    hole.appendChild(img);
    model.boardStatus[index].hasMole = true;

    const timeout = setTimeout(() => {
      view.clearMole(index);
    }, 2000);
    model.moleTimeouts.push(timeout);
  },

  clearMole(index) {
    const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
    if (hole && model.boardStatus[index].hasMole) {
      hole.innerHTML = "";
      model.boardStatus[index].hasMole = false;
    }
  },

  showSnake(index) {
    const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
    if (!hole) return;

    const img = document.createElement("img");
    img.src = "snake.jpg"; // Make sure the file name and path are correct
    img.alt = "snake";
    img.classList.add("snake");
    img.addEventListener("click", controller.hitSnake);
    hole.innerHTML = ""; // Replace any mole
    hole.appendChild(img);
    model.boardStatus[index].hasSnake = true;
  },

  clearSnake(index) {
    const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
    if (hole && model.boardStatus[index].hasSnake) {
      hole.innerHTML = "";
      model.boardStatus[index].hasSnake = false;
    }
  },

  showAllSnakes() {
    for (let i = 0; i < 12; i++) {
      const hole = this.board.querySelector(`.hole[data-id="${i}"]`);
      const img = document.createElement("img");
      img.src = "snake.jpg";
      img.alt = "snake";
      img.classList.add("snake");
      hole.innerHTML = "";
      hole.appendChild(img);
      model.boardStatus[i].hasSnake = true;
    }
  },

  updateScore(score) {
    this.scoreDisplay.textContent = score;
  },

  updateTimer(time) {
    this.timerDisplay.textContent = time;
  },

  clearAllMoles() {
    for (let i = 0; i < 12; i++) {
      this.clearMole(i);
    }
    model.boardStatus.forEach(b => b.hasMole = false);
    model.moleTimeouts.forEach(clearTimeout);
    model.moleTimeouts = [];
  },

  gameOver(message = "Time is Over!") {
    clearInterval(model.intervalId);
    clearInterval(model.timerId);
    clearInterval(model.snakeIntervalId);
    model.intervalId = null;
    model.timerId = null;
    model.snakeIntervalId = null;
    this.clearAllMoles();
    alert(message);
  }
};

const controller = {
  startGame() {
    model.score = 0;
    model.timeLeft = 30;
    model.boardStatus.forEach(b => {
      b.hasMole = false;
      b.hasSnake = false;
    });
    view.updateScore(model.score);
    view.updateTimer(model.timeLeft);
    view.renderBoard();

    model.intervalId = setInterval(controller.spawnMole, 1000);
    model.timerId = setInterval(controller.countdown, 1000);
    model.snakeIntervalId = setInterval(controller.spawnSnake, 2000);
  },

  spawnMole() {
    const emptySpots = model.boardStatus
      .map((b, i) => i)
      .filter(i => !model.boardStatus[i].hasMole && !model.boardStatus[i].hasSnake);

    const moleCount = model.boardStatus.filter(b => b.hasMole).length;
    if (moleCount >= model.maxMoles || emptySpots.length === 0) return;

    const randomIndex = emptySpots[Math.floor(Math.random() * emptySpots.length)];
    view.showMole(randomIndex);
  },

  spawnSnake() {
    if (model.snakeIndex !== null) {
      view.clearSnake(model.snakeIndex);
    }

    const randomIndex = Math.floor(Math.random() * 12);
    model.snakeIndex = randomIndex;
    view.showSnake(randomIndex);
  },

  hitMole(e) {
    e.stopPropagation();
    const hole = e.target.parentElement;
    const id = parseInt(hole.dataset.id);

    if (model.boardStatus[id].hasMole) {
      model.score++;
      model.boardStatus[id].hasMole = false;
      view.clearMole(id);
      view.updateScore(model.score);
    }
  },

  hitEmpty(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    // Optional: handle miss
  },

  hitSnake(e) {
    e.stopPropagation();
    view.showAllSnakes();
    view.gameOver("Game Over! You hit the snake!");
  },

  countdown() {
    model.timeLeft--;
    view.updateTimer(model.timeLeft);
    if (model.timeLeft <= 0) {
      view.gameOver("Time is Over!");
    }
  }
};

view.startButton.addEventListener("click", controller.startGame);