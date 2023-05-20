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
    // Dibuja el nombre de usuario de cada jugador sobre su barra
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(STATE.player1.username, 10, STATE.player1.y - 10);
    ctx.fillText(STATE.player2.username, 400, STATE.player2.y - 10);

    // Dibuja el puntaje de cada jugador en la parte superior del canvas
    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = "white";
    ctx.fillText(`${STATE.score1} - ${STATE.score2}`, 220, 40);
  }
}

function loop() {
    draw();
}

export function updateState(state) {
  STATE = state;
  console.log("Updated state:", STATE);
}

setInterval(loop, 100);


