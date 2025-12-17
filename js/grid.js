class Grid {
    constructor(cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        this.map = [];

        for (let i = 0; i < rows; i++) {
            this.map[i] = [];
            for (let j = 0; j < cols; j++) {
                this.map[i][j] = 0; // livre
            }
        }
    }

    worldToGrid(x, y) {
        let i = floor(y / this.cellSize);
        let j = floor(x / this.cellSize);

        i = constrain(i, 0, this.rows - 1);
        j = constrain(j, 0, this.cols - 1);

        return { i, j };
    }

    gridToWorld(i, j) {
        return {
            x: j * this.cellSize + this.cellSize / 2,
            y: i * this.cellSize + this.cellSize / 2,
        };
    }
}