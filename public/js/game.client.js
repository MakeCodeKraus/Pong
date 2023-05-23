const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let STATE = {};
let paused = false;

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

    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(STATE.player1.username, 10, STATE.player1.y - 10);
    ctx.fillText(STATE.player2.username, 400, STATE.player2.y - 10);

    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(`${STATE.score1} - ${STATE.score2}`, 225, 40);
  }
  if (paused) {
    ctx.font = "bold 48px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText("Juego en pausa", 130, 200);
  }
}

function loop() {
  if (!paused) {
    draw();
  }
}

export function updateState(state) {
  STATE = { ...state };

  if (state.score) {
    STATE.score1 = state.score.player1;
    STATE.score2 = state.score.player2;
  }

  console.log("Puntaje recibido del servidor:", STATE.score1, "-", STATE.score2);
}

document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    paused = !paused;
  }
});

setInterval(loop, 200);
