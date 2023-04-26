const { Player } = require("./player.server");
const { Ball } = require("./ball.server");

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const LOOP_PERIOD = 100;

const STATE = {
  ball: new Ball(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
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
  if (STATE.player1 && STATE.player2) {
    STATE.player1.move(CANVAS_HEIGHT);
    STATE.player2.move(CANVAS_HEIGHT);
    STATE.ball.move(CANVAS_WIDTH, CANVAS_HEIGHT);
    STATE.ball.bounce(STATE.player1);
    STATE.ball.bounce(STATE.player2);
  }
};

const setAxis = (playerId, axis) => {
  if (STATE.player1.id == playerId) {
    STATE.player1.axis = axis;
  } else if (STATE.player2.id == playerId) {
    STATE.player2.axis = axis;
  }
};

setInterval(update, LOOP_PERIOD);

module.exports = {
  spawnPlayer,
  setAxis,
  STATE,
};
