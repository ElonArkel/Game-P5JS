class Area {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  desenhar() {
    noFill();
    stroke(255, 80);
    rect(this.x, this.y, this.size, this.size);
  }

  contem(px, py) {
    return (
      px >= this.x &&
      px < this.x + this.size &&
      py >= this.y &&
      py < this.y + this.size
    );
  }
}
