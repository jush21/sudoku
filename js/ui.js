const sudokuGame = new Sudoku();
let selectedCell = null;
let currentPuzzle = [];
let initialGrid = [];

function newGame(difficulty) {
    currentPuzzle = sudokuGame.generate(difficulty);
    initialGrid = [...currentPuzzle];
    renderGrid();
}

function renderGrid() {
    const gridElement = document.getElementById('sudoku-grid');
    gridElement.innerHTML = '';
    
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        if (currentPuzzle[i] !== 0) {
            cell.innerText = currentPuzzle[i];
            if (initialGrid[i] !== 0) {
                cell.classList.add('fixed');
            }
        }
        
        if (selectedCell === i) {
            cell.classList.add('selected');
        }

        cell.addEventListener('click', () => selectCell(i));
        gridElement.appendChild(cell);
    }
}

function selectCell(index) {
    if (initialGrid[index] === 0) {
        selectedCell = index;
    } else {
        selectedCell = null;
    }
    renderGrid();
}

function inputNumber(num) {
    if (selectedCell === null) return;
    
    currentPuzzle[selectedCell] = num === 0 ? 0 : num;
    renderGrid();

    // Check if solved
    if (!currentPuzzle.includes(0)) {
        if (isSolved()) {
            setTimeout(() => alert('Congratulations! You solved it!'), 100);
        }
    }
}

function isSolved() {
    // Basic check against the solution stored in the Sudoku class
    return currentPuzzle.every((val, i) => val === sudokuGame.solution[i]);
}

// Start a game by default
newGame('easy');
