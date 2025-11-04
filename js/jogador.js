class Jogador extends Entidade {
  constructor(x, y) {
    super(x, y);
    this._vida = 3; // atributo privado
  }

  get vida() {
    return this._vida;
  }

  set vida(v) {
    this._vida = constrain(v, 0, 5);
  }

  perderVida() {
    this._vida--;
  }

  desenhar() {
    fill(0, 255, 0);
    ellipse(this.x, this.y, 40);
  }
}