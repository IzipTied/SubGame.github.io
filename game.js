const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const submarineImg = new Image();
submarineImg.src = "assets/submarine.png";

const bubbleImg = new Image();
bubbleImg.src = "assets/bubble.png";

const mineImg = new Image();
mineImg.src = "assets/mine.png";

let submarine = {
  x: 50,
  y: 200,
  width: 60,
  height: 30,
  speed: 2
};

let keys = {};
let bubbles = [];
let mines = [];
let score = 0;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function spawnBubble() {
  let y = Math.random() * canvas.height;
  bubbles.push({ x: canvas.width, y, width: 20, height: 20 });
}

function spawnMine() {
  let y = Math.random() * (canvas.height - 30);
  mines.push({ x: canvas.width, y, width: 30, height: 30 });
}

function drawSubmarine() {
  ctx.drawImage(submarineImg, submarine.x, submarine.y, submarine.width, submarine.height);
}

function drawBubbles() {
  for (let b of bubbles) {
    ctx.drawImage(bubbleImg, b.x, b.y, b.width, b.height);
  }
}

function drawMines() {
  for (let m of mines) {
    ctx.drawImage(mineImg, m.x, m.y, m.width, m.height);
  }
}

function update() {
  if (keys["ArrowUp"]) submarine.y -= submarine.speed;
  if (keys["ArrowDown"]) submarine.y += submarine.speed;
  if (keys["ArrowRight"]) submarine.x += submarine.speed;

  // Keep submarine within canvas
  submarine.y = Math.max(0, Math.min(canvas.height - submarine.height, submarine.y));
  submarine.x = Math.max(0, Math.min(canvas.width - submarine.width, submarine.x));

  // Move bubbles and check for collection
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].x -= 2;
    if (bubbles[i].x + bubbles[i].width < 0) {
      bubbles.splice(i, 1);
    } else if (
      bubbles[i].x < submarine.x + submarine.width &&
      bubbles[i].x + bubbles[i].width > submarine.x &&
      bubbles[i].y < submarine.y + submarine.height &&
      bubbles[i].y + bubbles[i].height > submarine.y
    ) {
      bubbles.splice(i, 1);
      score += 10;
    }
  }

  // Move mines and check for collision
  for (let i = mines.length - 1; i >= 0; i--) {
    mines[i].x -= 3;
    if (mines[i].x + mines[i].width < 0) {
      mines.splice(i, 1);
    } else if (
      mines[i].x < submarine.x + submarine.width &&
      mines[i].x + mines[i].width > submarine.x &&
      mines[i].y < submarine.y + submarine.height &&
      mines[i].y + mines[i].height > submarine.y
    ) {
      alert("Game Over! Your score: " + score);
      document.location.reload();
    }
  }
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSubmarine();
  drawBubbles();
  drawMines();
  drawScore();
  update();
  requestAnimationFrame(gameLoop);
}

// Start the game
setInterval(spawnBubble, 2000);
setInterval(spawnMine, 3000);
gameLoop();
