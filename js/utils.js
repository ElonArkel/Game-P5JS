class Utils {
  static gerarPosicaoAleatoria() {
    return int(random(0, 3));
  }

  static distancia(a, b) {
    return dist(a.x, a.y, b.x, b.y);
  }

  static malhaParaCoordenada(i, j) {
    return { x: 100 + j * 100, y: 100 + i * 100 };
  }
}