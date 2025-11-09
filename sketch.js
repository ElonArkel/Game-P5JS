let jogador;
let inimigo;
let areas = [];
let gridSize = 3;
let areaSize = 200;
let cooldown = 0;
let estado = "menu"; // menu, jogo, vitoria, derrota ou pausado

function setup() {
  createCanvas(gridSize * areaSize, gridSize * areaSize);
  jogador = new Jogador(width / 2, height / 2);
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
  if (estado == "menu") {
    background(30);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Pressione ENTER para começar", width / 2, height / 2);
    if (keyIsPressed && keyCode === ENTER) {
      reiniciarJogo();
      estado = "jogo";
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
