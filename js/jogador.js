class Jogador extends Entidade {
  #vel;
  #vida;
  #cooldown;
  #range;
  #dano;
  constructor(x, y) {
    super(x, y);
    this.#vel = 2;
    this.#vida = 100;
    this.#cooldown = 0;
    this.#range = 50;
    this.#dano = 10;
  }

  mover() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) this.x -= this.#vel;
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) this.x += this.#vel;
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) this.y -= this.#vel;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) this.y += this.#vel;
    this.x = constrain(this.x, 10, width - 10);
    this.y = constrain(this.y, 10, height - 10);

    if (this.#cooldown > 0) this.#cooldown--;
  }

  colisao(inimigo) {
    let d = Utils.distancia(this, inimigo);
    return d < 20;
  }

  damage(inimigo) {
    if (inimigo && !inimigo.morto) {
      this.#vida -= inimigo.forca;
      this.#vida = max(this.#vida, 0);
    }
  }

  atualizarVida(amount) {
    this.#vida += amount;
    this.#vida = constrain(this.#vida, 0, 100);
  }

  ataque(inimigos) {
    if (keyIsDown(32) && this.#cooldown === 0) {
      // tecla espaço
      this.#cooldown = 30; // recarga em frames (~0.5s a 60fps)
      let acertou = false;

      for (let inimigo of inimigos) {
        let d = Utils.distancia(this, inimigo);
        if (d < this.#range && !inimigo.morto) {
          inimigo.damage(this.#dano); // aplica dano numérico
          acertou = true;
        }
      }

      // desenha o círculo de ataque brevemente
      if (acertou) {
        this.mostrarRangeAtaque();
      }
    }
  }

  mostrarRangeAtaque() {
    push();
    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);
    ellipse(this.x, this.y, this.#range * 2);
    pop();
  }

  desenhar() {
    fill(0, 255, 0);
    noStroke();
    ellipse(this.x, this.y, 20);

    // visual opcional de cooldown
    if (this.#cooldown > 0) {
      fill(0, 255, 0, 100);
      arc(
        this.x,
        this.y,
        22,
        22,
        -HALF_PI,
        -HALF_PI + TWO_PI * (1 - this.#cooldown / 30)
      );
    }
  }
  get vel() {
    return this.#vel;
  }
  get vida() {
    return this.#vida;
  }
  get cooldown() {
    return this.#cooldown;
  }
  get range() {
    return this.#range;
  }
  get dano() {
    return this.#dano;
  }
  set vel(vel) {
    this.#vel = vel;
  }
  set vida(vida) {
    this.#vida = vida;
  }
  set cooldown(cooldown) {
    this.#cooldown = cooldown;
  }
  set range(range) {
    this.#range = range;
  }
  set dano(dano) {
    this.#dano = dano;
  }
}
