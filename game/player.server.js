class Player {
  constructor(id, username, x, y) {
    this.id = id;
    this.username = username;
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.width = 100;
    this.height = 15;
    this.axis = { vertical: 0 };
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  move(canvasHeight) {
    if (this.axis.vertical > 0 && this.y < canvasHeight - this.width) {
      this.y += this.speed;
    } else if (this.axis.vertical < 0 && this.y > 0) {
      this.y -= this.speed;
    }
  }
}
module.exports = {
  Player,
};
