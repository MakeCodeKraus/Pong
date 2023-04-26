document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

let axis = {
  vertical: 0,
};

const UP_KEY = 38;
const DOWN_KEY = 40;

const playerMoveEvent = new Event("playerMove");

function keyDownHandler(event) {
  const keyPressed = event.keyCode;
  if (keyPressed === UP_KEY) {
    axis.vertical = -1;
  }
  if (keyPressed === DOWN_KEY) {
    axis.vertical = 1;
  }
  if (keyPressed === DOWN_KEY || keyPressed === UP_KEY) {
    document.dispatchEvent(playerMoveEvent);
  }
}

function keyUpHandler(event) {
  const keyPressed = event.keyCode;
  if (keyPressed === UP_KEY || keyPressed === DOWN_KEY) {
    axis.vertical = 0;
    document.dispatchEvent(playerMoveEvent);
  }
}

export { axis };
