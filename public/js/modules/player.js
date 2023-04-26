export default class Player {
  constructor(id, username, x, y) {
    this.id = id;
    this.username = username;
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.width = 100;
    this.height = 15;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.height, this.width);
    ctx.strokeRect(this.x, this.y, this.height, this.width);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
