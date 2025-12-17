class Inimigo extends Entidade {
  #forca;
  #vel;
  #vida;
  #morto;
  constructor(x, y, sprites, grid) {
    super(x, y);
    this.grid = grid;
    this.path = [];
    this.pathIndex = 0;
    this.#forca = 15;
    this.#vel = 0.8;
    this.#vida = 20;
    this.#morto = false;
    this.estado = "idle_enemy";
    this.frame = 0;
    this.sprites = sprites;
    this.range = 30;
    this.cooldown = 0;
    this.direcao = 1;
    this.atacando = false;
    this.attackTimer = 0;
    this.hitFrame = 10;
    this.danoAplicado = false;
  }

  mover(jogador) {
    if (this.morto) return;

    if (this.atacando) {
      this.attackTimer--;
      if (this.attackTimer <= 0) {
        this.atacando = false;
      }
      return; // não anda durante ataque
    }

    let start = this.grid.worldToGrid(this.x, this.y);
    let goal = this.grid.worldToGrid(jogador.x, jogador.y);

    if (frameCount % 30 === 0) {
      this.path = aStar(this.grid, start, goal);
      this.pathIndex = 0;
    }

    if (this.path.length > 0 && this.pathIndex < this.path.length) {
      let target = this.grid.gridToWorld(
        this.path[this.pathIndex].i,
        this.path[this.pathIndex].j
      );

      let dx = target.x - this.x;
      let dy = target.y - this.y;
      let d = dist(this.x, this.y, target.x, target.y);
      if (dx <= 0) {
        this.direcao = -1;
      } else {
        this.direcao = 1;
      }

      if (d < 5) {
        this.pathIndex++;
      } else {
        this.x += (dx / d) * this.vel;
        this.y += (dy / d) * this.vel;
        if (!this.atacando) {
          this.estado = "walk_enemy";
        }
      }
    } else {
      if (!this.atacando) {
        this.estado = "idle_enemy";
      }
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
    if (this.cooldown > 0 || this.atacando) {
      this.cooldown--;
      return;
    }

    if (this.colisao(jogador)) {
      this.atacando = true;
      this.attackTimer = 20;
      this.estado = "attack_enemy";
      this.frame = 0;
      this.danoAplicado = false;
      this.cooldown = 60;
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

    // DANO NO FRAME CERTO
    if (
      this.atacando &&
      !this.danoAplicado &&
      this.frame === this.hitFrame
    ) {
      this.jogadorAlvo.damage(this.#forca);
      this.danoAplicado = true;
    }

    if (frameCount % 5 === 0) {
      this.frame++;
    }

    if (this.frame >= anim.length) {
      this.frame = 0;
      if (this.atacando) {
        this.atacando = false;
        this.estado = "idle_enemy";
      }
    }

    let img = anim[this.frame];

    imageMode(CENTER);
    push();
    translate(this.x, this.y);
    scale(this.direcao, 1);
    image(img, 0, 0, 60, 60);
    pop();
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
