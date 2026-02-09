/* --- JAVASCRIPT LOGIC --- */
const TARGET_WORD = "HII";
const MAX_TRIES = 4;
const WORD_LENGTH = 3;

let currentTry = 0;
let currentTile = 0;
let gameOver = false;
let guesses = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

const board = document.getElementById('game-board');
const keyboard = document.getElementById('keyboard');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const modalTitle = document.getElementById('modal-title');
const modalMsg = document.getElementById('modal-message');
const restartBtn = document.getElementById('restart-btn');

// Create Board
function createBoard() {
    for (let r = 0; r < MAX_TRIES; r++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let c = 0; c < WORD_LENGTH; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.id = `tile-${r}-${c}`;
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

// Create Keyboard
const keys = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM"
];

function createKeyboard() {
    keys.forEach((rowString, index) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'key-row';
        
        // Add Enter key at start of last row
        if(index === 2) {
            const enterKey = document.createElement('div');
            enterKey.className = 'key key-wide';
            enterKey.innerText = 'ENTER';
            enterKey.onclick = checkGuess;
            rowDiv.appendChild(enterKey);
        }

        for(let char of rowString) {
            const key = document.createElement('div');
            key.className = 'key';
            key.innerText = char;
            key.id = 'key-' + char;
            key.onclick = () => handleKey(char);
            rowDiv.appendChild(key);
        }

        // Add Backspace key at end of last row
        if(index === 2) {
            const backKey = document.createElement('div');
            backKey.className = 'key key-wide';
            backKey.innerText = '⌫';
            backKey.onclick = deleteLetter;
            rowDiv.appendChild(backKey);
        }
        keyboard.appendChild(rowDiv);
    });
}

function handleKey(letter) {
    if (gameOver) return;
    if (currentTile < WORD_LENGTH) {
        const tile = document.getElementById(`tile-${currentTry}-${currentTile}`);
        tile.innerText = letter;
        tile.style.borderColor = "#818384"; // Highlight border on type
        guesses[currentTry][currentTile] = letter;
        currentTile++;
    }
}

function deleteLetter() {
    if (gameOver) return;
    if (currentTile > 0) {
        currentTile--;
        const tile = document.getElementById(`tile-${currentTry}-${currentTile}`);
        tile.innerText = "";
        tile.style.borderColor = "#3a3a3c";
        guesses[currentTry][currentTile] = "";
    }
}

function checkGuess() {
    if (gameOver) return;
    if (currentTile < WORD_LENGTH) {
        // Not enough letters
        return; 
    }

    const guessArr = guesses[currentTry];
    const guessString = guessArr.join("");
    
    // Coloring Logic
    let targetTemp = TARGET_WORD.split(""); // Copy for handling duplicates
    
    // First pass: Greens (Correct position)
    guessArr.forEach((letter, index) => {
        const tile = document.getElementById(`tile-${currentTry}-${index}`);
        const key = document.getElementById(`key-${letter}`);

        if (letter === TARGET_WORD[index]) {
            tile.classList.add('correct');
            key.style.backgroundColor = '#538d4e';
            targetTemp[index] = null; // Mark as handled
        }
    });

    // Second pass: Yellows/Grays
    guessArr.forEach((letter, index) => {
        const tile = document.getElementById(`tile-${currentTry}-${index}`);
        const key = document.getElementById(`key-${letter}`);

        if (!tile.classList.contains('correct')) {
            if (targetTemp.includes(letter)) {
                tile.classList.add('present');
                 // Only color key yellow if it wasn't already green
                if (key.style.backgroundColor !== 'rgb(83, 141, 78)') {
                     key.style.backgroundColor = '#b59f3b';
                }
                const idx = targetTemp.indexOf(letter);
                targetTemp[idx] = null;
            } else {
                tile.classList.add('absent');
                if (key.style.backgroundColor === '') {
                     key.style.backgroundColor = '#3a3a3c';
                }
            }
        }
    });

    // ... inside checkGuess function ...

    // Win/Loss Check
    // Win/Loss Check
    if (guessString === TARGET_WORD) {
        gameOver = true;
        setTimeout(() => {
            // Show Success Modal with the "Continue" button
            showModal("Correct!", "You found the word! ❤️", false, true);
        }, 500);
    } else {
        if (currentTry >= MAX_TRIES - 1) {
            gameOver = true;
            // Show Failure Modal with "Restart" button
            setTimeout(() => showModal("Wrong!", "Game Over.", true, false), 500);
        } else {
            currentTry++;
            currentTile = 0;
            // Unlock hint logic
            if (currentTry === 2) {
                 const hintDiv = document.getElementById('hint-container');
                 hintDiv.classList.remove('locked');
            }
        }
    }
}


// Updated showModal to handle different buttons
function showModal(title, msg, showRestart = false, showContinue = false) {
    modalTitle.innerText = title;
    modalMsg.innerText = msg;
    overlay.style.display = 'block';
    modal.style.display = 'block';
    
    // Toggle buttons based on arguments
    document.getElementById('restart-btn').style.display = showRestart ? 'inline-block' : 'none';
    document.getElementById('continue-btn').style.display = showContinue ? 'inline-block' : 'none';
}

function toggleHint() {
    const container = document.getElementById('hint-container');
    container.classList.toggle('active');
}

// Initialize Game
createBoard();
createKeyboard();

// Physical Keyboard Support
document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    const key = e.key.toUpperCase();
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
        handleKey(key);
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (key === 'ENTER') {
        checkGuess();
    }
});

function playNotificationSound() {
    // Create a notification sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set frequency for a pleasant "ding" sound
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// --- UPDATED TRIGGER FUNCTION ---
function triggerNotification() {
    // 1. Close the modal
    overlay.style.display = 'none';
    modal.style.display = 'none';

    // 2. SHOW HACK SCREEN & PLAY STATIC
    const hackScreen = document.getElementById('hack-overlay');
    hackScreen.style.display = 'flex'; // Show the glitch
    playStaticSound();

    // 3. Wait 2.5 seconds, then stop hack and show message
    setTimeout(() => {
        // Hide Hack Screen
        hackScreen.style.display = 'none';

        // Show Messenger Notification
        const notif = document.getElementById('messenger-notification');
        notif.classList.add('show');
        
        // Play the "Ding" Pop sound
        playNotificationSound();

    }, 2500); // 2500ms = 2.5 seconds
}

function goToProposal() {
    // Redirect to your next page
    // Create a file named 'proposal.html' for this to work!
    window.location.href = "proposal.html";
}

// --- NEW AUDIO: Static Noise for Hack ---
function playStaticSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const bufferSize = audioContext.sampleRate * 2; // 2 seconds buffer
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill buffer with random noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1; // Volume of static

    noise.connect(gainNode);
    gainNode.connect(audioContext.destination);
    noise.start();
    
    // Stop after 2.5 seconds
    noise.stop(audioContext.currentTime + 2.5);
}