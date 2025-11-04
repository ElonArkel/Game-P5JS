class Entidade {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  mover(nx, ny) {
    this.x = nx;
    this.y = ny;
  }

  desenhar() {
    // Polimorfismo: cada classe filha sobrescreve esse método
  }
}