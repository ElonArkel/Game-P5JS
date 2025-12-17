function heuristic(a, b) {
    return abs(a.i - b.i) + abs(a.j - b.j);
}

function aStar(grid, start, goal) {
    let open = [];
    let closed = [];

    open.push({
        i: start.i,
        j: start.j,
        g: 0,
        h: heuristic(start, goal),
        f: heuristic(start, goal),
        parent: null
    });

    while (open.length > 0) {


        let currentIndex = 0;
        for (let i = 0; i < open.length; i++) {
            if (open[i].f < open[currentIndex].f) {
                currentIndex = i;
            }
        }

        let current = open.splice(currentIndex, 1)[0];
        closed.push(current);


        if (current.i === goal.i && current.j === goal.j) {
            let path = [];
            let temp = current;
            while (temp) {
                path.push(temp);
                temp = temp.parent;
            }
            return path.reverse();
        }

        let neighbors = [
            { i: current.i + 1, j: current.j },
            { i: current.i - 1, j: current.j },
            { i: current.i, j: current.j + 1 },
            { i: current.i, j: current.j - 1 },
        ];

        for (let n of neighbors) {


            if (
                n.i < 0 || n.j < 0 ||
                n.i >= grid.rows || n.j >= grid.cols
            ) continue;

            if (grid.map[n.i][n.j] === 1) continue;


            if (closed.some(c => c.i === n.i && c.j === n.j)) continue;

            let g = current.g + 1;
            let h = heuristic(n, goal);
            let f = g + h;

            let existing = open.find(o => o.i === n.i && o.j === n.j);

            if (!existing) {
                open.push({
                    i: n.i,
                    j: n.j,
                    g,
                    h,
                    f,
                    parent: current
                });
            }
        }
    }

    return [];
}