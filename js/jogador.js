class Jogador {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vel = 2;
    this.vida = 100;
  }

  mover() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.vel;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.vel;
    if (keyIsDown(UP_ARROW)) this.y -= this.vel;
    if (keyIsDown(DOWN_ARROW)) this.y += this.vel;
  }

  desenhar() {
    fill(0, 255, 0);
    noStroke();
    ellipse(this.x, this.y, 20);
  }
}