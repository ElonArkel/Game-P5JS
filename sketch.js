let jogador;
let inimigo;
let areas = [];
let itens = [];
let gridSize = 3;
let areaSize = 200;
let cooldown = 0;
let estado = "menu"; // menu, jogo, vitoria, derrota ou pausado
let sprites = {
  idle: [],
  walk: [],
  attack: []
};

function preload() {
  for (let i = 0; i <= 11; i++) {
    sprites.attack.push(loadImage(`assets/Golem1/Attacking/Golem_01_Attacking_0${i}.png`));
    sprites.idle.push(loadImage(`assets/Golem1/Idle/Golem_01_Idle_0${i}.png`));
  }
  for (let i = 0; i <= 17; i++) {
    sprites.walk.push(loadImage(`assets/Golem1/Walking/Golem_01_Walking_0${i}.png`));
  }
}

function setup() {
  createCanvas(gridSize * areaSize, gridSize * areaSize);
  jogador = new Jogador(width / 2, height / 2, sprites);
  inimigo = new Inimigo(random(width), random(height));
  // cria as áreas da grade
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let x = j * areaSize;
      let y = i * areaSize;
      areas.push(new Area(x, y, areaSize));
    }
  }
}

function draw() {
  background(30);

  // movimentação do jogador
  jogador.mover();

  // ataque do jogador (espaço)
  jogador.ataque([inimigo]);

  // movimentação do inimigo
  inimigo.mover(jogador);

  // dano ao jogador se colidir com inimigo vivo
  if (!inimigo.morto && inimigo.colisao(jogador)) {
    jogador.damage(inimigo.forca);
  }

  // desenha as áreas da grade
  for (let a of areas) a.desenhar();

  // desenha o jogador e inimigo
  jogador.desenhar();
  inimigo.desenhar();
  jogador.atualizar();

  if (!inimigo.morto && inimigo.colisao(jogador)) {
    jogador.damage(inimigo.forca);
  }

  for (let item of itens) {
    item.desenhar();
    if (!item.coletado && item.colisao(jogador)) {
      item.coletar(jogador);
    }
  }

  // desenha itens coletáveis
  for (let item of itens) {
    item.desenhar();
    if (!item.coletado && item.colisao(jogador)) {
      item.coletar(jogador);
    }
  }

  // 2️⃣ Remove itens coletados da lista
  itens = itens.filter(i => !i.coletado);

  // 3️⃣ Spawna novos itens próximos, liberando áreas quando o item sumiu
  for (let a of areas) {
    // Libera a área para novo item se o anterior foi coletado
    if (a.temItem && !itens.some(i => i.x > a.x && i.x < a.x + areaSize && i.y > a.y && i.y < a.y + areaSize)) {
      a.temItem = false;
    }

    let d = dist(jogador.x, jogador.y, a.x + areaSize / 2, a.y + areaSize / 2);
    if (d < 100 && !a.temItem && random() < 0.01) {
      let ix = a.x + random(40, areaSize - 40);
      let iy = a.y + random(40, areaSize - 40);
      itens.push(new Item(ix, iy, "cura"));
      a.temItem = true;
    }
  }

  // HUD — informações do jogo
  fill(255);
  noStroke();
  textSize(14);

  // exibe célula atual do jogador
  for (let a of areas) {
    if (a.contem(jogador.x, jogador.y)) {
      text(`Célula: (${a.x / areaSize}, ${a.y / areaSize})`, 10, 20);
      break;
    }
  }

  if (estado == "jogo" && keyIsPressed && keyCode === ESCAPE) {
    estado = "pausado";
  } else if (estado == "pausado" && keyIsPressed && keyCode === ESCAPE) {
    estado = "jogo";
  }

  if (estado == "pausado") {
    background(30, 30, 30, 200);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("JOGO PAUSADO", width / 2, height / 2);
  }

  if (estado == "jogo") {
    background(30);

    // movimentação do jogador
    jogador.mover();

    // ataque do jogador (espaço)
    jogador.ataque([inimigo]);

    // movimentação do inimigo
    inimigo.mover(jogador);

    // dano ao jogador se colidir com inimigo vivo
    if (!inimigo.morto && inimigo.colisao(jogador)) {
      jogador.damage(inimigo.forca);
    }

    // desenha as áreas da grade
    for (let a of areas) a.desenhar();

    // desenha o jogador e inimigo
    jogador.desenhar();
    inimigo.desenhar();

    // HUD — informações do jogo
    fill(255);
    noStroke();
    textSize(14);

    // exibe célula atual do jogador
    for (let a of areas) {
      if (a.contem(jogador.x, jogador.y)) {
        text(
          `Célula: (${a.x / areaSize + 1}, ${a.y / areaSize + 1})`,
          47.5,
          20
        );
        break;
      }
    }

    // mostra status
    text(`Vida Jogador: ${jogador.vida}`, 65, 40);
    text(`Vida Inimigo: ${inimigo.morto ? "Morto" : inimigo.vida}`, 58.5, 60);

    if (inimigo.morto) {
      estado = "vitoria";
      background(30, 30, 30, 200);
      fill(0, 255, 0);
      textSize(32);
      text("🎉 Vitória!", width / 2, height / 3);
    } else if (jogador.vida <= 0) {
      estado = "derrota";
      background(30, 30, 30, 200);
      fill(255, 0, 0);
      textSize(32);
      text("💀 Game Over!", width / 2, height / 3);
    }
  }
  if (estado === "vitoria" || estado === "derrota") {
    text("Pressione R para reiniciar", width / 2, height / 2);
    text("Pressione ESC para reiniciar", width / 2, height / 2 + 40);
    if (keyIsDown(82)) {
      reiniciarJogo();
    } else if (keyIsDown(ESCAPE)) {
      estado = "menu";
    }
  }
}

function reiniciarJogo() {
  jogador = new Jogador(width / 2, height / 2);
  inimigo = new Inimigo(random(width), random(height));
  estado = "jogo";
}
