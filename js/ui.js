const sudokuGame = new Sudoku();
let selectedCell = null;
let currentPuzzle = [];
let initialGrid = [];

function startGame(difficulty) {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('difficulty-label').innerText = difficulty;
    
    selectedCell = null;
    currentPuzzle = sudokuGame.generate(difficulty);
    initialGrid = [...currentPuzzle];
    renderGrid();
}

function showHome() {
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
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

    if (!currentPuzzle.includes(0)) {
        if (isSolved()) {
            setTimeout(() => {
                alert('Congratulations! You solved it!');
                showHome();
            }, 100);
        }
    }
}

function isSolved() {
    return currentPuzzle.every((val, i) => val === sudokuGame.solution[i]);
}
