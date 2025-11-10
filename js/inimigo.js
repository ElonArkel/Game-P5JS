class Inimigo extends Entidade {
  #forca;
  #vel;
  #vida;
  #morto;
  constructor(x, y) {
    super(x, y);
    this.#forca = 15;
    this.#vel = 0.8;
    this.#vida = 20;
    this.#morto = false;
  }

  mover(jogador) {
    if (this.#morto) return;

    let dx = jogador.x - this.x;
    let dy = jogador.y - this.y;
    let distancia = dist(this.x, this.y, jogador.x, jogador.y);
    if (distancia > 1) {
      this.x += (dx / distancia) * this.#vel;
      this.y += (dy / distancia) * this.#vel;
    }
  }

  colisao(jogador) {
    let d = Utils.distancia(this, jogador);
    return d < 20;
  }

  damage(valor) {
    if (this.#morto) return;
    this.#vida -= valor;
    if (this.#vida <= 0) {
      this.#morto = true;
      this.morte();
    }
  }

  morte() {
    itens.push(new Item(this.x, this.y, "pontos"));
    setTimeout(() => {
      this.respawn();
    }, 2000);
  }

  respawn() {
    this.x = random(width);
    this.y = random(height);
    this.#vida = 20;
    this.#morto = false;
  }

  desenhar() {
    if (this.#morto) return;
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, 20);
  }

  get forca() {
    return this.#forca;
  }
  get vel() {
    return this.#vel;
  }
  get vida() {
    return this.#vida;
  }
  get morto() {
    return this.#morto;
  }
  set forca(forca) {
    this.#forca = forca;
  }
  set vel(vel) {
    this.#vel = vel;
  }
  set vida(vida) {
    this.#vida = vida;
  }
  set morto(morto) {
    this.#morto = morto;
  }
}
