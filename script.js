const model = {
  score: 0,
  timeLeft: 30,
  maxMoles: 3,
  intervalId: null,
  timerId: null,
  boardStatus: Array.from({ length: 12 }, (_, i) => ({
    id: i,
    hasMole: false
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
    const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
    const img = document.createElement("img");
    img.src = "mole.jpeg";
    img.alt = "mole";
    img.classList.add("mole");
    img.addEventListener("click", controller.hitMole);
    hole.innerHTML = "";
    hole.appendChild(img);
  },

  clearMole(index) {
    const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
    hole.innerHTML = "";
  },

  updateScore(score) {
    this.scoreDisplay.textContent = score;
  },

  updateTimer(time) {
    this.timerDisplay.textContent = time;
  },

  gameOver() {
    clearInterval(model.intervalId);
    clearInterval(model.timerId);
    this.clearAllMoles();
    alert("Time is Over!");
  },

  clearAllMoles() {
    for (let i = 0; i < 12; i++) {
      this.clearMole(i);
      model.boardStatus[i].hasMole = false;
    }
  }
};

const controller = {
  startGame() {
    model.score = 0;
    model.timeLeft = 30;
    model.boardStatus.forEach(b => b.hasMole = false);
    view.updateScore(model.score);
    view.updateTimer(model.timeLeft);
    view.renderBoard();

    model.intervalId = setInterval(this.spawnMole, 1000);
    model.timerId = setInterval(this.countdown, 1000);
  },

  spawnMole() {
    const emptySpots = model.boardStatus.filter(b => !b.hasMole);
    if (emptySpots.length === 0) return;

    const moleCount = model.boardStatus.filter(b => b.hasMole).length;
    if (moleCount >= model.maxMoles) return;

    const randomIndex = Math.floor(Math.random() * emptySpots.length);
    const moleSpot = emptySpots[randomIndex];
    moleSpot.hasMole = true;
    view.showMole(moleSpot.id);
  },

  hitMole(e) {
    e.stopPropagation();
    const hole = e.target.parentElement;
    const id = parseInt(hole.dataset.id);

    if (model.boardStatus[id].hasMole) {
      model.score += 1;
      model.boardStatus[id].hasMole = false;
      view.clearMole(id);
      view.updateScore(model.score);
    }
  },

  hitEmpty(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    if (!model.boardStatus[id].hasMole) {
      // Do nothing on empty hit
    }
  },

  countdown() {
    model.timeLeft -= 1;
    view.updateTimer(model.timeLeft);

    if (model.timeLeft === 0) {
      view.gameOver();
    }
  }
};

view.startButton.addEventListener("click", () => controller.startGame());