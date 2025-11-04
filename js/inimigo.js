class Inimigo extends Entidade {
  constructor(x, y) {
    super(x, y);
    this.forca = int(random(1, 3));
  }

  desenhar() {
    fill(255, 0, 0);
    rect(this.x - 15, this.y - 15, 30, 30);
  }
}