class Jogador {
  constructor(x, y, sprites) {
    this.x = x;
    this.y = y;
    this.vel = 2;
    this.vida = 100;
    this.cooldown = 0;
    this.damageCooldown = 0;
    this.estado = "idle";
    this.frame = 0;
    this.sprites = sprites;
    this.range = 50;   // alcance do ataque
    this.dano = 10;    // dano fixo
  }

  mover() {
    let movendo = false;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= this.vel; // A
      movendo = true;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.vel;
      movendo = true;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      this.y -= this.vel;
      movendo = true;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      this.y += this.vel;
      movendo = true;
    }

    if (this.cooldown > 0) this.cooldown--;

    if (this.estado !== "attack") {
      this.estado = movendo ? "walk" : "idle";
    }
  }

  colisao(inimigo) {
    let d = Utils.distancia(this, inimigo);
    return d < 20;
  }

  damage(valor) {
    if (this.damageCooldown === 0) {
      this.vida -= valor;
      this.vida = max(this.vida, 0);
      this.damageCooldown = 30;
    }
  }
  atualizar() {
    if (this.damageCooldown > 0) this.damageCooldown--; 
  }

  atualizarVida(amount) {
    this.vida += amount;
    this.vida = constrain(this.vida, 0, 100);
  }

  ataque(inimigos) {
    if (keyIsDown(32) && this.cooldown === 0) { // tecla espaço
      this.cooldown = 30; // recarga em frames (~0.5s a 60fps)
      this.estado = "attack";
      this.frame = 0;


      for (let inimigo of inimigos) {
        let d = Utils.distancia(this, inimigo);
        if (d < this.range && !inimigo.morto) {
          inimigo.damage(this.dano); // aplica dano numérico
        }
      }

      setTimeout(() => {
        if (this.estado === "attack")
          this.estado = "idle";
      }, 400);
    }
  }

  desenhar() {
    let anim = this.sprites[this.estado];
    if (!anim || anim.length === 0) return;

    if (frameCount % 5 === 0) {
      this.frame = (this.frame + 1) % anim.length;
    }

    let img = anim[this.frame];
    if (!img) return; // evita erro

    imageMode(CENTER);
    image(img, this.x, this.y, 60, 60);
  }
}
