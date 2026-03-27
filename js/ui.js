const game = new Sudoku();
let currentPuzzle = [];
let initialGrid = [];
let selectedCell = null;

function startGame(difficulty) {
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('difficulty-label').innerText = difficulty.toUpperCase();
    
    selectedCell = null;
    currentPuzzle = game.generate(difficulty);
    initialGrid = [...currentPuzzle];
    renderGrid();

    // Add to history so browser back button works
    history.pushState({ screen: 'game' }, '');
}

function showHome() {
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('game-screen').classList.add('hidden');
}

// Handle browser back button
window.onpopstate = function(event) {
    showHome();
};

function renderGrid() {
    const gridDiv = document.getElementById('sudoku-grid');
    gridDiv.innerHTML = '';
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        
        // If 0, it stays empty
        if (currentPuzzle[i] !== 0) {
            cell.innerText = currentPuzzle[i];
            if (initialGrid[i] !== 0) {
                cell.classList.add('fixed');
            } else {
                cell.classList.add('user-val');
            }
        } else {
            cell.innerText = ''; // Explicitly clear
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

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (document.getElementById('game-screen').classList.contains('hidden')) return;
    if (selectedCell === null) return;

    if (e.key >= '1' && e.key <= '9') {
        inputNumber(parseInt(e.key));
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        inputNumber(0);
    }
});
