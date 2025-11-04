let jogador;
let areas = [];
let gridSize = 3;   // 3x3 células
let areaSize = 200; // tamanho de cada célula

function setup() {
  createCanvas(gridSize * areaSize, gridSize * areaSize);
  jogador = new Jogador(width / 2, height / 2);

  // cria as células do grid
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

  // atualiza jogador
  jogador.mover();

  // desenha todas as áreas
  for (let a of areas) a.desenhar();

  // desenha jogador
  jogador.desenhar();

  // mostra em qual célula o jogador está
  for (let a of areas) {
    if (a.contem(jogador.x, jogador.y)) {
      fill(255);
      noStroke();
      textSize(14);
      text(`Célula: (${a.x / areaSize}, ${a.y / areaSize})`, 10, 20);
      text(`Vida: ${jogador.vida}`, 10, 40);
      break;
    }
  }
}