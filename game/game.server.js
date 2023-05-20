const { Player } = require("./player.server");
const { Ball } = require("./ball.server");

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const LOOP_PERIOD = 100;

const STATE = {
  ball: new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
  player1: null,
  player2: null,
  score1: 0,
  score2: 0,
  gamePaused: false,
};

const spawnPlayer = (id, username) => {
  if (!STATE.player1) {
    STATE.player1 = new Player(id, username, 0, CANVAS_HEIGHT / 2);
  } else {
    STATE.player2 = new Player(
      id,
      username,
      CANVAS_WIDTH - 15,
      CANVAS_HEIGHT / 2
    );
  }
};

const update = () => {
  if (STATE.player1 && STATE.player2 && !STATE.gamePaused) {
    STATE.player1.move(CANVAS_HEIGHT);
    STATE.player2.move(CANVAS_HEIGHT);
    STATE.ball.move(CANVAS_WIDTH, CANVAS_HEIGHT);
    STATE.ball.bounce(STATE.player1);
    STATE.ball.bounce(STATE.player2);

    // Verifica si la pelota sale por el lado del jugador 1
    if (STATE.ball.x < STATE.player1.x - STATE.ball.radius) {
      STATE.score2++;
      console.log("Punto para jugador 2: ", STATE.score2);
      STATE.ball.reset(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    // Verifica si la pelota sale por el lado del jugador 2
    if (STATE.ball.x > STATE.player2.x + STATE.ball.radius) {
      STATE.score1++;
      console.log("Punto para jugador 1: ", STATE.score1);
      STATE.ball.reset(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
  }
};

const setAxis = (playerId, axis) => {
  if (STATE.player1.id == playerId) {
    STATE.player1.axis = axis;
  } else if (STATE.player2.id == playerId) {
    STATE.player2.axiss = axis;
  }
};

setInterval(update, LOOP_PERIOD);

module.exports = {
  spawnPlayer,
  setAxis,
  STATE,
};