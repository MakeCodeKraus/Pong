class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.speed = 10;
    this.dx = this.speed;
    this.dy = this.speed;
    this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    this.score1 = 0;
    this.score2 = 0;
  }

  reset(x, y) {
    this.x = x;
    this.y = y;
    this.dx = Math.random() * 2 - 1;
    this.dy = Math.random() * 2 - 1;
    this.dx = this.dx / Math.abs(this.dx);
    this.dy = this.dy / Math.abs(this.dy);
    this.dx *= this.speed;
    this.dy *= this.speed;
  }

  move(width, height) {
    if (this.y + this.dy > height - this.radius || this.y + this.dy < this.radius) {
      this.dy = -this.dy; // Invertir la dirección vertical
    }

    if (this.x + this.dx > width - this.radius) {
      console.log("Punto para el Jugador 1");
      this.score1++;
      if (this.score1 >= 10) {
        console.log("¡Jugador 1 ha ganado!");
        // Aquí puedes realizar las acciones correspondientes al anunciar al ganador
      }
      this.reset(width / 2, height / 2);
    } else if (this.x + this.dx < this.radius) {
      console.log("Punto para el Jugador 2");
      this.score2++;
      if (this.score2 >= 10) {
        console.log("¡Jugador 2 ha ganado!");
        // Aquí puedes realizar las acciones correspondientes al anunciar al ganador
      }
      this.reset(width / 2, height / 2);
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  bounce(player1, player2) {
    let distX1 = Math.abs(this.x - player1.x - player1.height / 2);
    let distY1 = Math.abs(this.y - player1.y - player1.width / 2);

    if (
      distX1 <= player1.height / 2 + this.radius &&
      distY1 <= player1.width / 2 + this.radius
    ) {
      console.log("Rebote con el Jugador 1");
      this.dx = -this.dx;
    }

    let distX2 = Math.abs(this.x - player2.x - player2.height / 2);
    let distY2 = Math.abs(this.y - player2.y - player2.width / 2);

    if (
      distX2 <= player2.height / 2 + this.radius &&
      distY2 <= player2.width / 2 + this.radius
    ) {
      console.log("Rebote con el Jugador 2");
      this.dx = -this.dx;
    }
  }
}

module.exports = {
  Ball,
};
