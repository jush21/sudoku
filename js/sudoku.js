class Sudoku {
    constructor() {
        this.grid = Array(81).fill(0);
        this.solution = Array(81).fill(0);
    }

    generate(difficulty) {
        this.grid = Array(81).fill(0);
        this.fillGrid();
        this.solution = [...this.grid];
        
        let cellsToRemove = 30;
        if (difficulty === 'medium') cellsToRemove = 45;
        if (difficulty === 'hard') cellsToRemove = 55;

        let attempts = 0;
        while (attempts < cellsToRemove) {
            let index = Math.floor(Math.random() * 81);
            if (this.grid[index] !== 0) {
                let backup = this.grid[index];
                this.grid[index] = 0;
                if (!this.hasUniqueSolution()) {
                    this.grid[index] = backup;
                }
                attempts++;
            }
        }
        return this.grid;
    }

    fillGrid() {
        const solve = (idx) => {
            if (idx === 81) return true;
            let nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
            for (let n of nums) {
                if (this.isValid(idx, n)) {
                    this.grid[idx] = n;
                    if (solve(idx + 1)) return true;
                    this.grid[idx] = 0;
                }
            }
            return false;
        };
        solve(0);
    }

    isValid(idx, val, grid = this.grid) {
        let row = Math.floor(idx / 9);
        let col = idx % 9;
        let boxRow = Math.floor(row / 3) * 3;
        let boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 9; i++) {
            if (grid[row * 9 + i] === val) return false;
            if (grid[i * 9 + col] === val) return false;
            let r = boxRow + Math.floor(i / 3);
            let c = boxCol + (i % 3);
            if (grid[r * 9 + c] === val) return false;
        }
        return true;
    }

    hasUniqueSolution() {
        let count = 0;
        const solve = (idx) => {
            if (idx === 81) {
                count++;
                return count > 1;
            }
            if (this.grid[idx] !== 0) return solve(idx + 1);
            for (let n = 1; n <= 9; n++) {
                if (this.isValid(idx, n)) {
                    this.grid[idx] = n;
                    if (solve(idx + 1)) return true;
                    this.grid[idx] = 0;
                }
            }
            return false;
        };
        solve(0);
        return count === 1;
    }
}
