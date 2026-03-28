const game = new Sudoku();
let currentPuzzle = [];
let initialGrid = [];
let selectedCell = null;
let currentDifficulty = '';
let hintsUsed = [];

window.onload = () => {
    const saved = localStorage.getItem('sudoku_save');
    if (saved) {
        const data = JSON.parse(saved);
        currentPuzzle = data.currentPuzzle;
        initialGrid = data.initialGrid;
        currentDifficulty = data.difficulty;
        game.solution = data.solution;
        hintsUsed = data.hintsUsed || [];
        
        applyGameUI(currentDifficulty);
        renderGrid();
    } else {
        applyHomeUI();
    }

    // Setup mobile hidden input
    const mobileInput = document.getElementById('mobile-input');
    mobileInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value.slice(-1));
        if (!isNaN(val)) {
            inputNumber(val);
        }
        e.target.value = ''; // Reset for next input
    });
};

function applyHomeUI() {
    document.body.className = 'home-bg';
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('success-overlay').classList.add('hidden');
}

function applyGameUI(difficulty) {
    document.body.className = 'game-bg';
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    const label = document.getElementById('difficulty-label');
    label.innerText = difficulty.toUpperCase();
    label.className = '';
    label.classList.add(difficulty);
}

function saveGame() {
    localStorage.setItem('sudoku_save', JSON.stringify({
        currentPuzzle,
        initialGrid,
        difficulty: currentDifficulty,
        solution: game.solution,
        hintsUsed
    }));
}

function startGame(difficulty) {
    currentDifficulty = difficulty;
    applyGameUI(difficulty);
    
    selectedCell = null;
    hintsUsed = [];
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
            } else if (hintsUsed.includes(i)) {
                cell.classList.add('hint-val');
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
                // Trigger mobile keyboard
                document.getElementById('mobile-input').focus();
            }
        });
        gridDiv.appendChild(cell);
    }
}

function inputNumber(num) {
    if (selectedCell === null) return;
    currentPuzzle[selectedCell] = num;
    const hintIdx = hintsUsed.indexOf(selectedCell);
    if (hintIdx > -1) hintsUsed.splice(hintIdx, 1);
    
    saveGame();
    renderGrid();
    checkWin();
}

function giveHint() {
    if (selectedCell === null) {
        alert("Please select an empty cell first!");
        return;
    }
    if (initialGrid[selectedCell] !== 0) return;

    const correctVal = game.solution[selectedCell];
    currentPuzzle[selectedCell] = correctVal;
    if (!hintsUsed.includes(selectedCell)) hintsUsed.push(selectedCell);
    
    saveGame();
    renderGrid();
    checkWin();
}

function solveGame() {
    if (confirm("Are you sure you want to reveal the full solution?")) {
        currentPuzzle = [...game.solution];
        renderGrid();
        setTimeout(() => {
            alert("Game Over - Solution Revealed");
            showHome();
        }, 500);
    }
}

function checkWin() {
    if (!currentPuzzle.includes(0)) {
        if (currentPuzzle.every((val, i) => val === game.solution[i])) {
            setTimeout(() => {
                document.getElementById('success-overlay').classList.remove('hidden');
            }, 200);
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
