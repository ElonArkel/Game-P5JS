class Jogador extends Entidade {
  #vel;
  #vida;
  #cooldown;
  #damageCooldown;
  #estado;
  #frame;
  #sprites;
  #range;
  #dano;
  constructor(x, y, sprites) {
    super(x, y);
    this.pontos = 0;
    this.#vel = 2;
    this.#vida = 100;
    this.#cooldown = 0;
    this.#damageCooldown = 0;
    this.#estado = "idle";
    this.#frame = 0;
    this.#sprites = sprites;
    this.#range = 50;
    this.#dano = 10;
  }

  mover() {
    let movendo = false;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= this.#vel;
      movendo = true;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.#vel;
      movendo = true;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.y -= this.#vel;
      movendo = true;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.y += this.#vel;
      movendo = true;
    }

    if (this.#cooldown > 0) this.#cooldown--;

    if (this.#estado !== "attack") {
      this.#estado = movendo ? "walk" : "idle";
    }
  }

  colisao(inimigo) {
    let d = Utils.distancia(this, inimigo);
    return d < 20;
  }

  damage(valor) {
    if (this.#damageCooldown === 0) {
      this.#vida -= valor;
      this.#vida = max(this.#vida, 0);
      this.#damageCooldown = 30;
    }
  }
  atualizar() {
    if (this.#damageCooldown > 0) this.#damageCooldown--;
  }

  atualizarVida(amount) {
    this.#vida += amount;
    this.#vida = constrain(this.#vida, 0, 100);
  }

  ataque(inimigos) {
    if (keyIsDown(32) && this.#cooldown === 0) {
      this.#cooldown = 30;
      this.#estado = "attack";
      this.#frame = 0;

      for (let inimigo of inimigos) {
        let d = Utils.distancia(this, inimigo);
        if (d < this.#range && !inimigo.morto) {
          inimigo.damage(this.#dano);
        }
      }

      setTimeout(() => {
        if (this.#estado === "attack") this.#estado = "idle";
      }, 400);
    }
  }

  desenhar() {
    let anim = this.#sprites[this.#estado];
    if (!anim || anim.length === 0) return;

    if (frameCount % 5 === 0) {
      this.#frame = (this.#frame + 1) % anim.length;
    }

    let img = anim[this.#frame];
    if (!img) return;

    imageMode(CENTER);
    image(img, this.x, this.y, 60, 60);
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
  get damageCooldown() {
    return this.#damageCooldown;
  }
  get estado() {
    return this.#estado;
  }
  get frame() {
    return this.#frame;
  }
  get sprites() {
    return this.#sprites;
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
  set damageCooldown(damageCooldown) {
    this.#damageCooldown = damageCooldown;
  }
  set estado(estado) {
    this.#estado = estado;
  }
  set frame(frame) {
    this.#frame = frame;
  }
  set sprites(sprites) {
    this.#sprites = sprites;
  }
}
