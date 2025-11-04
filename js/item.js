class Item extends Entidade {
  constructor(x, y) {
    super(x, y);
    this.tipo = random(['vida', 'pontos']);
  }

  desenhar() {
    fill(0, 0, 255);
    ellipse(this.x, this.y, 20);
  }
}