class Item extends Entidade {
  constructor(x, y, tipo) {
    super(x, y);
    this.tipo = tipo;
    this.x = x;
    this.y = y;
    this.tamanho = 15;
    this.coletado = false;
  }

  desenhar() {
    if (this.coletado) return;
    if (this.tipo === "cura") fill(0, 200, 255);
    else if (this.tipo === "pontos") fill(255, 215, 0);

    noStroke();
    ellipse(this.x, this.y, this.tamanho);
  }

  colisao(jogador) {
    return dist(this.x, this.y, jogador.x, jogador.y) < 15;
  }

  coletar(jogador) {
    if (this.tipo === "cura") jogador.atualizarVida(20);
    else if (this.tipo === "pontos") jogador.pontos += 10;
    this.coletado = true;
  }
}