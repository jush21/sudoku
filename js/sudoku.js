class Sudoku {
    constructor() {
        this.grid = Array(81).fill(0);
        this.solution = Array(81).fill(0);
    }

    generate(difficulty) {
        let targetClues = 36; // Easy
        if (difficulty === 'medium') targetClues = 30;
        if (difficulty === 'hard') targetClues = 24;

        let attempts = 0;
        while (attempts < 20) {
            this.grid = Array(81).fill(0);
            if (this.fillGrid()) {
                this.solution = [...this.grid];
                if (this.removeNumbers(targetClues)) {
                    // Final safety check: must be unique and have correct clue count
                    const clues = this.grid.filter(n => n !== 0).length;
                    if (clues <= targetClues + 2) {
                        return this.grid;
                    }
                }
            }
            attempts++;
        }
        return this.grid;
    }

    fillGrid() {
        const solve = (idx) => {
            if (idx === 81) return true;
            let nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
            for (let n of nums) {
                if (this.isSafe(this.grid, idx, n)) {
                    this.grid[idx] = n;
                    if (solve(idx + 1)) return true;
                    this.grid[idx] = 0;
                }
            }
            return false;
        };
        return solve(0);
    }

    removeNumbers(target) {
        let currentClues = 81;
        let attempts = 0;
        // High attempt count to ensure we actually reach the difficulty
        while (attempts < 2000 && currentClues > target) {
            let cell = Math.floor(Math.random() * 81);
            if (this.grid[cell] !== 0) {
                let backup = this.grid[cell];
                this.grid[cell] = 0;

                if (this.countSolutions() !== 1) {
                    this.grid[cell] = backup;
                } else {
                    currentClues--;
                }
            }
            attempts++;
        }
        return true;
    }

    // Strict safety checker
    isSafe(grid, idx, val) {
        let row = Math.floor(idx / 9);
        let col = idx % 9;
        let boxRow = Math.floor(row / 3) * 3;
        let boxCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 9; i++) {
            // Check row
            if (grid[row * 9 + i] === val) return false;
            // Check column
            if (grid[i * 9 + col] === val) return false;
            // Check 3x3 box
            let r = boxRow + Math.floor(i / 3);
            let c = boxCol + (i % 3);
            if (grid[r * 9 + c] === val) return false;
        }
        return true;
    }

    countSolutions() {
        let count = 0;
        let tempGrid = [...this.grid];

        const solve = (idx) => {
            if (idx === 81) {
                count++;
                return count > 1;
            }
            if (tempGrid[idx] !== 0) return solve(idx + 1);

            for (let n = 1; n <= 9; n++) {
                if (this.isSafe(tempGrid, idx, n)) {
                    tempGrid[idx] = n;
                    if (solve(idx + 1)) return true;
                    tempGrid[idx] = 0;
                }
            }
            return false;
        };
        solve(0);
        return count;
    }
}
