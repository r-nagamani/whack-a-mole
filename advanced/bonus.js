model.snakeIndex = null;
model.snakeIntervalId = null;

view.showSnake = function(index) {
  const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
  const img = document.createElement("img");
  img.src = "snake.jpg";
  img.alt = "snake";
  img.classList.add("snake");
  img.addEventListener("click", controller.hitSnake);
  hole.innerHTML = "";
  hole.appendChild(img);
  model.boardStatus[index].hasSnake = true;
};

view.showAllSnakes = function () {
  model.boardStatus.forEach((_, index) => {
    const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
    const img = document.createElement("img");
    img.src = "snake.jpg";
    img.alt = "snake";
    img.classList.add("snake");
    hole.innerHTML = "";
    hole.appendChild(img);
  });
};

view.clearHole = function(index) {
  const hole = this.board.querySelector(`.hole[data-id="${index}"]`);
  if (hole) {
    hole.innerHTML = "";
    model.boardStatus[index].hasSnake = false;
  }
};

const originalGameOver = view.gameOver.bind(view);
view.gameOver = function (message) {
  clearInterval(model.snakeIntervalId);
  model.snakeIntervalId = null;
  originalGameOver(message);
};

controller.spawnSnake = function () {
  if (model.snakeIndex !== null) {
    view.clearHole(model.snakeIndex);
    model.boardStatus[model.snakeIndex].hasSnake = false;
  }

  const randomIndex = Math.floor(Math.random() * 12);
  model.snakeIndex = randomIndex;
  view.showSnake(randomIndex);
};

controller.hitSnake = function (e) {
  e.stopPropagation();
  view.showAllSnakes();
  view.gameOver("Game Over! You hit the snake!");
};

const originalStartGame = controller.startGame.bind(controller);
controller.startGame = function () {
  if (model.snakeIntervalId) {
    clearInterval(model.snakeIntervalId);
    model.snakeIntervalId = null;
  }

  originalStartGame();
  model.snakeIntervalId = setInterval(() => controller.spawnSnake(), 2000);
};
