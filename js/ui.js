const game = new Sudoku();
let currentPuzzle = [];
let initialGrid = [];
let selectedCell = null;
let currentDifficulty = '';

window.onload = () => {
    const saved = localStorage.getItem('sudoku_save');
    if (saved) {
        const data = JSON.parse(saved);
        currentPuzzle = data.currentPuzzle;
        initialGrid = data.initialGrid;
        currentDifficulty = data.difficulty;
        game.solution = data.solution;
        
        applyGameUI(currentDifficulty);
        renderGrid();
    } else {
        applyHomeUI();
    }
};

function applyHomeUI() {
    document.body.className = 'home-bg';
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
}

function applyGameUI(difficulty) {
    document.body.className = 'game-bg';
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    const label = document.getElementById('difficulty-label');
    label.innerText = difficulty.toUpperCase();
    label.className = ''; // Reset classes
    label.classList.add(difficulty);
}

function saveGame() {
    localStorage.setItem('sudoku_save', JSON.stringify({
        currentPuzzle,
        initialGrid,
        difficulty: currentDifficulty,
        solution: game.solution
    }));
}

function startGame(difficulty) {
    currentDifficulty = difficulty;
    applyGameUI(difficulty);
    
    selectedCell = null;
    currentPuzzle = game.generate(difficulty);
    initialGrid = [...currentPuzzle];
    saveGame();
    renderGrid();

    history.pushState({ screen: 'game' }, '');
}

function showHome() {
    localStorage.removeItem('sudoku_save');
    applyHomeUI();
}

window.onpopstate = function(event) {
    showHome();
};

function renderGrid() {
    const gridDiv = document.getElementById('sudoku-grid');
    gridDiv.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        if (currentPuzzle[i] !== 0) {
            cell.innerText = currentPuzzle[i];
            if (initialGrid[i] !== 0) {
                cell.classList.add('fixed');
            } else {
                cell.classList.add('user-val');
            }
        } else {
            cell.innerText = '';
        }

        if (selectedCell === i) cell.classList.add('selected');
        
        cell.addEventListener('click', () => {
            if (initialGrid[i] === 0) {
                selectedCell = i;
                renderGrid();
            }
        });
        gridDiv.appendChild(cell);
    }
}

function inputNumber(num) {
    if (selectedCell === null) return;
    currentPuzzle[selectedCell] = num;
    saveGame();
    renderGrid();
    
    if (!currentPuzzle.includes(0)) {
        if (currentPuzzle.every((val, i) => val === game.solution[i])) {
            setTimeout(() => {
                alert('Success!');
                showHome();
            }, 100);
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (document.getElementById('game-screen').classList.contains('hidden')) return;
    if (selectedCell === null) return;

    if (e.key >= '1' && e.key <= '9') {
        inputNumber(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        e.preventDefault();
        inputNumber(0);
    }
});
