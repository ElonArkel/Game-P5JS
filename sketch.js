let jogador;
let inimigo;
let areas = [];
let grid;
let itens = [];
let gridCols = 30;
let gridRows = 30;
let cellSize = 20;
let cooldown = 0;
let estado = "menu"; // menu, jogo, vitoria, derrota ou pausado
let sprites = {
  idle_mc: [],
  idle_enemy: [],
  walk_mc: [],
  walk_enemy: [],
  attack_mc: [],
  attack_enemy: [],
};

function preload() {
  for (let i = 0; i <= 11; i++) {
    sprites.attack_mc.push(loadImage(`assets/Golem1/Attacking/Golem_01_Attacking_0${i}.png`));
    sprites.idle_mc.push(loadImage(`assets/Golem1/Idle/Golem_01_Idle_0${i}.png`));
    sprites.idle_enemy.push(loadImage(`assets/Golem2/Idle/Golem_02_Idle_0${i}.png`));
    sprites.attack_enemy.push(loadImage(`assets/Golem2/Attacking/Golem_02_Attacking_0${i}.png`));
  }
  for (let i = 0; i <= 17; i++) {
    sprites.walk_mc.push(loadImage(`assets/Golem1/Walking/Golem_01_Walking_0${i}.png`));
    sprites.walk_enemy.push(loadImage(`assets/Golem2/Walking/Golem_02_Walking_0${i}.png`));
  }
}

function setup() {
  createCanvas(600, 600);

  grid = new Grid(gridCols, gridRows, cellSize);

  jogador = new Jogador(width / 2, height / 2, sprites);
  inimigo = new Inimigo(random(width), random(height), sprites, grid);
  carregarPresetObstaculos(3);
}

function desenharGrid() {
  stroke(50);
  for (let i = 0; i <= grid.cols; i++) {
    line(i * cellSize, 0, i * cellSize, height);
  }
  for (let j = 0; j <= grid.rows; j++) {
    line(0, j * cellSize, width, j * cellSize);
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
    return;
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
    desenharGrid();
    desenharBloqueios();
    jogador.mover();
    jogador.ataque([inimigo]);
    jogador.atualizar();

    inimigo.mover(jogador);
    inimigo.atacar(jogador);

    if (!inimigo.morto && inimigo.colisao(jogador)) {
      jogador.damage(inimigo.forca);
    }

    for (let a of areas) a.desenhar();

    stroke(0, 255, 0);
    noFill();
    if (inimigo.path) {
      for (let p of inimigo.path) {
        let pos = grid.gridToWorld(p.i, p.j);
        ellipse(pos.x, pos.y, 10);
      }
    }

    jogador.desenhar();
    inimigo.desenhar();

    for (let item of itens) {
      item.desenhar();
      if (!item.coletado && item.colisao(jogador)) {
        item.coletar(jogador);
      }
    }

    itens = itens.filter((i) => !i.coletado);

    for (let a of areas) {
      let d = dist(
        jogador.x,
        jogador.y,
        a.x + areaSize / 2,
        a.y + areaSize / 2
      );

      if (d < 100 && !a.temItem && random() < 0.01) {
        let ix = a.x + random(40, areaSize - 40);
        let iy = a.y + random(40, areaSize - 40);
        itens.push(new Item(ix, iy, "cura"));
        a.temItem = true;
      }
    }

    fill(255);
    noStroke();
    textSize(14);

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

    text(`Vida Jogador: ${jogador.vida}`, 65, 40);
    text(`Vida Inimigo: ${inimigo.morto ? 0 : inimigo.vida}`, 58.5, 60);
    text(`Pontos: ${jogador.pontos}`, 41, 80);

    if (jogador.pontos == 100) {
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
    text("Pressione ESC para ir ao menu pricipal", width / 2, height / 2 + 40);
    if (keyIsDown(82)) {
      reiniciarJogo();
    } else if (keyIsDown(ESCAPE)) {
      estado = "menu";
    }
  }
}

function reiniciarJogo() {
  jogador = new Jogador(width / 2, height / 2, sprites);
  inimigo = new Inimigo(random(width), random(height), sprites, grid);
  itens = [];
  estado = "jogo";
}

function bloquearAreaWorld(x, y, w, h) {
  let start = grid.worldToGrid(x, y);
  let end = grid.worldToGrid(x + w, y + h);

  for (let i = start.i; i <= end.i; i++) {
    for (let j = start.j; j <= end.j; j++) {
      if (
        i >= 0 && j >= 0 &&
        i < grid.rows && j < grid.cols
      ) {
        grid.map[i][j] = 1;
      }
    }
  }
}

function desenharBloqueios() {
  noStroke();
  fill(200, 50, 50, 150); // vermelho translúcido

  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      if (grid.map[i][j] === 1) {
        rect(
          j * cellSize,
          i * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }
}

function carregarPresetObstaculos(preset) {

  for (let i = 0; i < grid.rows; i++) {
    for (let j = 0; j < grid.cols; j++) {
      grid.map[i][j] = 0;
    }
  }



  if (preset === 1) {

    bloquearAreaWorld(150, 100, 120, 60);
    bloquearAreaWorld(300, 250, 40, 200);
  }

  if (preset === 2) {

    bloquearAreaWorld(200, 0, 40, 600);
    bloquearAreaWorld(0, 300, 600, 40);
  }

  if (preset === 3) {

    bloquearAreaWorld(100, 100, 400, 40);
    bloquearAreaWorld(100, 460, 400, 40);
    bloquearAreaWorld(100, 140, 40, 280);
    bloquearAreaWorld(460, 140, 40, 200);
  }

  if (preset === 4) {
    bloquearAreaWorld(100, 100, 60, 60);
    bloquearAreaWorld(200, 150, 60, 60);
    bloquearAreaWorld(300, 200, 60, 60);
    bloquearAreaWorld(400, 250, 60, 60);
  }
}