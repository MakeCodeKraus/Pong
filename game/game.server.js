const { Player } = require("./player.server");
const { Ball } = require("./ball.server");

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const LOOP_PERIOD = 100;
const MAX_SCORE = 10;

let io;
let STATE = {
  player1: null,
  player2: null,
  ball: null,
  score: {
    player1: 0,
    player2: 0,
  },
  paused: false,
};

STATE.ball = new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

const initialize = (socketIO) => {
  io = socketIO;
  setInterval(update, LOOP_PERIOD);
};

const cancelMatch = () => {
  STATE.player1 = null;
  STATE.player2 = null;
  STATE.ball.reset(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  STATE.score.player1 = 0;
  STATE.score.player2 = 0;
  
  io.emit("cancelMatch");
};

const spawnPlayer = (id, username) => {
  if (!STATE.player1) {
    STATE.player1 = new Player(id, username, 0, CANVAS_HEIGHT / 2);
  } else if (!STATE.player2) {
    STATE.player2 = new Player(
      id,
      username,
      CANVAS_WIDTH - 15,
      CANVAS_HEIGHT / 2
    );
  }
};

const update = () => {
  if (STATE.paused) {
    return;
  }

  if (STATE.player1 && STATE.player2) {
    STATE.player1.move(CANVAS_HEIGHT);
    STATE.player2.move(CANVAS_HEIGHT);
    STATE.ball.move(CANVAS_WIDTH, CANVAS_HEIGHT);
    STATE.ball.bounce(STATE.player1, STATE.player2);

    if (STATE.score.player1 >= MAX_SCORE || STATE.score.player2 >= MAX_SCORE) {
      // Reiniciar el juego si un jugador alcanza los 10 puntos
      if (STATE.score.player1 >= MAX_SCORE) {
        console.log(`¡Jugador 1 ha ganado la partida!`);
      } else if (STATE.score.player2 >= MAX_SCORE) {
        console.log(`¡Jugador 2 ha ganado la partida!`);
      }

      STATE.score.player1 = 0;
      STATE.score.player2 = 0;
      STATE.ball.reset(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    io.emit("updateState", STATE);
  }
};

const setAxis = (playerId, axis) => {
  if (STATE.player1 && STATE.player1.id === playerId) {
    STATE.player1.axis = axis;
  } else if (STATE.player2 && STATE.player2.id === playerId) {
    STATE.player2.axis = axis;
  }
};

const togglePause = () => {
  if (STATE.paused) {
    if (STATE.player1 || STATE.player2) {
      cancelMatch();
    }
  } else {
    STATE.paused = true;
  }
  
  io.emit("pauseGame", STATE.paused);
};

module.exports = {
  initialize,
  spawnPlayer,
  setAxis,
  togglePause,
  STATE,
  update,
  cancelMatch,
};
