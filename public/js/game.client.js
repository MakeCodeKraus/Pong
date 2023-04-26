const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let STATE = {};

function drawPlayer(player) {
  ctx.beginPath();
  ctx.fillRect(player.x, player.y, player.height, player.width);
  ctx.strokeRect(player.x, player.y, player.height, player.width);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = ball.color;
  ctx.fill();
  ctx.closePath();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (STATE.player1 && STATE.player2) {
    drawPlayer(STATE.player1);
    drawPlayer(STATE.player2);
    drawBall(STATE.ball);
  }
}

function loop() {
  draw();
}

export function updateState(state) {
  STATE = state;
}
setInterval(loop, 100);
