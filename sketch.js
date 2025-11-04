let jogador;
let inimigos = [];
let grid = [];

function setup() {
  createCanvas(400, 400);

  // Criar 9 malhas (3x3)
  for (let i = 0; i < 3; i++) {
    grid[i] = [];
    for (let j = 0; j < 3; j++) {
      grid[i][j] = Utils.malhaParaCoordenada(i, j);
    }
  }

  const centro = grid[1][1];
  jogador = new Jogador(centro.x, centro.y);
}

function draw() {
  background(30);

  // Desenha malhas
  stroke(255);
  noFill();
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let pos = grid[i][j];
      rect(pos.x - 30, pos.y - 30, 60, 60);
    }
  }

  // Desenha inimigos
  for (let inimigo of inimigos) {
    inimigo.desenhar();
    if (Utils.distancia(inimigo, jogador) < 30) {
      jogador.perderVida();
    }
  }

  // Desenha jogador
  jogador.desenhar();

  // Exibe HUD
  noStroke();
  fill(255);
  textSize(16);
  text(`Vida: ${jogador.vida}`, 10, 20);
}

function keyPressed() {
  let iAtual, jAtual;

  // Encontra posição atual do jogador
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let pos = grid[i][j];
      if (pos.x === jogador.x && pos.y === jogador.y) {
        iAtual = i;
        jAtual = j;
      }
    }
  }

  if (keyCode === UP_ARROW && iAtual > 0)
    jogador.mover(grid[iAtual - 1][jAtual].x, grid[iAtual - 1][jAtual].y);
  else if (keyCode === DOWN_ARROW && iAtual < 2)
    jogador.mover(grid[iAtual + 1][jAtual].x, grid[iAtual + 1][jAtual].y);
  else if (keyCode === LEFT_ARROW && jAtual > 0)
    jogador.mover(grid[iAtual][jAtual - 1].x, grid[iAtual][jAtual - 1].y);
  else if (keyCode === RIGHT_ARROW && jAtual < 2)
    jogador.mover(grid[iAtual][jAtual + 1].x, grid[iAtual][jAtual + 1].y);

  // Gera até 2 inimigos em malhas próximas
  inimigos = [];
  for (let k = 0; k < 2; k++) {
    let ni = constrain(iAtual + int(random(-1, 2)), 0, 2);
    let nj = constrain(jAtual + int(random(-1, 2)), 0, 2);
    let pos = grid[ni][nj];
    inimigos.push(new Inimigo(pos.x, pos.y));
  }
}