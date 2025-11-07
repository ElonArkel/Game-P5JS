let jogador;
let inimigo;
let areas = [];
let itens = [];
let gridSize = 3;
let areaSize = 200;

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

  for (let item of itens) {
    item.desenhar();
    if (!item.coletado && item.colisao(jogador)) {
      item.coletar(jogador);
    }
  }

  // desenha itens coletáveis
  for (let a of areas) {
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

  // mostra status
  text(`Vida Jogador: ${jogador.vida}`, 10, 40);
  text(`Vida Inimigo: ${inimigo.morto ? 'Morto' : inimigo.vida}`, 10, 60);
}
