class Inimigo extends Entidade {
  #forca;
  #vel;
  #vida;
  #morto;
  constructor(x, y, sprites) {
  super(x, y);
  this.#forca = 15;
  this.#vel = 0.8;
  this.#vida = 20;
  this.#morto = false;
  this.estado = "idle_enemy";
  this.frame = 0;
  this.sprites = sprites;
  this.range = 30;
  this.cooldown = 0;
}

  mover(jogador) {
  if (this.#morto) return;

  let dx = jogador.x - this.x;
  let dy = jogador.y - this.y;
  let distancia = dist(this.x, this.y, jogador.x, jogador.y);

  if (distancia > this.range) {
    this.x += (dx / distancia) * this.#vel;
    this.y += (dy / distancia) * this.#vel;
    this.estado = "walk_enemy";
  } 
  else {
    this.estado = "attack_enemy";
    this.atacar(jogador);
  }

  if (distancia > this.range * 2) {
    this.estado = "idle_enemy";
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

  atacar(jogador) {
  if (this.cooldown > 0) {
    this.cooldown--;
    return;
  }
  if (this.colisao(jogador)) {
    jogador.damage(this.#forca);
    this.cooldown = 60; // 1 segundo de delay a 60 fps
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

  let anim = this.sprites[this.estado];
  if (!anim || anim.length === 0) return;

  if (frameCount % 5 === 0) {
    this.frame = (this.frame + 1) % anim.length;
  }

  imageMode(CENTER);
  image(anim[this.frame], this.x, this.y, 60, 60);
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
