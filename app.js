let currentState = {
    expression: 0,
    color: 0,
    accessory: null,
    soundEnabled: true
};

// Каталог реакций для нового персонажа
const reactions = {
    expressions: [
        { eyes: 'normal', mouth: 'smile', brows: 'neutral' },      // 😊
        { eyes: 'wide', mouth: 'open', brows: 'raised' },          // 😮
        { eyes: 'closed', mouth: 'neutral', brows: 'neutral' },    // 😌
        { eyes: 'angry', mouth: 'grumpy', brows: 'angry' },        // 😠
        { eyes: 'hearts', mouth: 'smile', brows: 'neutral' },      // 😍
        { eyes: 'sleepy', mouth: 'yawn', brows: 'neutral' },       // 🥱
        { eyes: 'wink', mouth: 'smile', brows: 'neutral' },        // 😉
        { eyes: 'sad', mouth: 'sad', brows: 'sad' }                // 😢
    ],
    
    colors: [
        '#FFCCAA',  // цвет кожи 1
        '#FFD7BA',  // цвет кожи 2  
        '#E6B89C',  // цвет кожи 3
        '#FFE4CC',  // цвет кожи 4
        '#FFB380',  // цвет кожи 5
        '#FFAA80',  // цвет кожи 6
        '#FF9966',  // цвет кожи 7
        '#E68A6C'   // цвет кожи 8
    ],
    
    accessories: [
        null,           // ничего
        'glasses',      // очки
        'hat',          // шляпа
        'halo',         // нимб
        'crown',        // корона
        'bow',          // бант
        'mustache',     // усы
        'flower'        // цветок
    ]
};

// История последних реакций
let history = [];
const HISTORY_SIZE = 4;

// Элементы нового SVG
const head = document.getElementById('head');
const eyeLeft = document.getElementById('pupil-left');
const eyeRight = document.getElementById('pupil-right');
const eyeLeftBg = document.getElementById('eye-left-bg');
const eyeRightBg = document.getElementById('eye-right-bg');
const browLeft = document.getElementById('brow-left');
const browRight = document.getElementById('brow-right');
const mouth = document.getElementById('mouth');
const accessories = document.getElementById('accessories');
const character = document.getElementById('character');
const soundToggle = document.getElementById('sound-toggle');

// Инициализация
function init() {
    const savedState = localStorage.getItem('morphState');
    if (savedState) {
        currentState = JSON.parse(savedState);
    }
    
    currentState.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    updateSoundButton();
    updateCharacter();
    
    character.addEventListener('click', handleTap);
    character.addEventListener('touchstart', handleTap);
    soundToggle.addEventListener('click', toggleSound);
    
    document.addEventListener('click', hideHint, { once: true });
    document.addEventListener('touchstart', hideHint, { once: true });
}

// Обработка касания
function handleTap(e) {
    e.preventDefault();
    
    const random = Math.random();
    let layer;
    
    if (random < 0.6) layer = 'expression';    // 60% - выражение
    else if (random < 0.85) layer = 'color';   // 25% - цвет
    else layer = 'accessory';                   // 15% - аксессуар
    
    const newIndex = getNewRandomIndex(layer);
    
    if (layer === 'expression') currentState.expression = newIndex;
    else if (layer === 'color') currentState.color = newIndex;
    else currentState.accessory = newIndex;
    
    const reactionKey = `${layer}-${newIndex}`;
    history.push(reactionKey);
    if (history.length > HISTORY_SIZE) history.shift();
    
    updateCharacter();
    playSound(layer);
    saveState();
}

// Получить новый случайный индекс
function getNewRandomIndex(layer) {
    const array = reactions[layer + 's'];
    let newIndex;
    let attempts = 0;
    
    do {
        newIndex = Math.floor(Math.random() * array.length);
        attempts++;
        if (attempts > 100) break;
        const reactionKey = `${layer}-${newIndex}`;
        if (!history.includes(reactionKey)) break;
    } while (true);
    
    return newIndex;
}

// Обновить персонажа
function updateCharacter() {
    // Цвет лица
    head.setAttribute('fill', reactions.colors[currentState.color]);
    
    // Выражение
    const expr = reactions.expressions[currentState.expression];
    updateEyes(expr.eyes);
    updateMouth(expr.mouth);
    updateBrows(expr.brows);
    
    // Аксессуары
    updateAccessories(currentState.accessory);
}

// Обновить глаза
function updateEyes(type) {
    switch(type) {
        case 'normal':
            eyeLeft.setAttribute('r', '3');
            eyeRight.setAttribute('r', '3');
            eyeLeftBg.setAttribute('rx', '6');
            eyeRightBg.setAttribute('rx', '6');
            break;
        case 'wide':
            eyeLeft.setAttribute('r', '4');
            eyeRight.setAttribute('r', '4');
            eyeLeftBg.setAttribute('rx', '8');
            eyeRightBg.setAttribute('rx', '8');
            break;
        case 'closed':
            eyeLeft.setAttribute('r', '0');
            eyeRight.setAttribute('r', '0');
            break;
        case 'angry':
            eyeLeft.setAttribute('r', '2.5');
            eyeRight.setAttribute('r', '2.5');
            break;
        case 'hearts':
            // Здесь можно добавить сердечки
            break;
        case 'wink':
            eyeLeft.setAttribute('r', '3');
            eyeRight.setAttribute('r', '0');
            break;
        case 'sad':
            eyeLeft.setAttribute('r', '2.5');
            eyeRight.setAttribute('r', '2.5');
            break;
    }
}

// Обновить рот
function updateMouth(type) {
    switch(type) {
        case 'smile':
            mouth.setAttribute('d', 'M 40 68 Q 50 73 60 68');
            break;
        case 'open':
            mouth.setAttribute('d', 'M 45 68 A 5 5 0 1 0 55 68');
            break;
        case 'neutral':
            mouth.setAttribute('d', 'M 40 68 Q 50 68 60 68');
            break;
        case 'grumpy':
            mouth.setAttribute('d', 'M 40 72 Q 50 67 60 72');
            break;
        case 'sad':
            mouth.setAttribute('d', 'M 40 72 Q 50 77 60 72');
            break;
        case 'yawn':
            mouth.setAttribute('d', 'M 40 70 Q 50 75 60 70 A 3 3 0 1 0 50 75');
            break;
    }
}

// Обновить брови
function updateBrows(type) {
    switch(type) {
        case 'neutral':
            browLeft.setAttribute('d', 'M 33 35 Q 38 32 43 35');
            browRight.setAttribute('d', 'M 57 35 Q 62 32 67 35');
            break;
        case 'raised':
            browLeft.setAttribute('d', 'M 33 32 Q 38 28 43 32');
            browRight.setAttribute('d', 'M 57 32 Q 62 28 67 32');
            break;
        case 'angry':
            browLeft.setAttribute('d', 'M 33 38 Q 38 35 43 38');
            browRight.setAttribute('d', 'M 57 38 Q 62 35 67 38');
            break;
        case 'sad':
            browLeft.setAttribute('d', 'M 33 37 Q 38 40 43 37');
            browRight.setAttribute('d', 'M 57 37 Q 62 40 67 37');
            break;
    }
}

// Обновить аксессуары
function updateAccessories(index) {
    // Очищаем
    const accessoriesGroup = document.getElementById('accessories');
    if (accessoriesGroup) accessoriesGroup.innerHTML = '';
    
    // Создаем если нужно
    if (index === 0 || !reactions.accessories[index]) return;
    
    const type = reactions.accessories[index];
    let svgElement;
    
    switch(type) {
        case 'glasses':
            svgElement = `<circle cx="40" cy="45" r="10" fill="none" stroke="#333" stroke-width="2"/>
                          <circle cx="60" cy="45" r="10" fill="none" stroke="#333" stroke-width="2"/>
                          <line x1="50" y1="45" x2="50" y2="45" stroke="#333" stroke-width="2"/>`;
            break;
        case 'hat':
            svgElement = `<path d="M 30 25 Q 50 15 70 25 Q 65 20 50 20 Q 35 20 30 25" fill="#8B4513"/>`;
            break;
        // ... другие аксессуары
    }
    
    if (svgElement && accessoriesGroup) {
        accessoriesGroup.innerHTML = svgElement;
    }
}

// Звук
function playSound(layer) {
    if (!currentState.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        let frequency = 440;
        if (layer === 'expression') frequency = 523;
        else if (layer === 'color') frequency = 659;
        else frequency = 784;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Звук не поддерживается', e);
    }
}

// Управление звуком
function toggleSound() {
    currentState.soundEnabled = !currentState.soundEnabled;
    updateSoundButton();
    localStorage.setItem('soundEnabled', currentState.soundEnabled);
}

function updateSoundButton() {
    soundToggle.textContent = currentState.soundEnabled ? '🔊' : '🔈';
    soundToggle.classList.toggle('muted', !currentState.soundEnabled);
}

// Сохранить состояние
function saveState() {
    localStorage.setItem('morphState', JSON.stringify(currentState));
}

// Скрыть подсказку
function hideHint() {
    const hint = document.querySelector('.hint');
    if (hint) {
        hint.style.opacity = '0';
        setTimeout(() => hint.remove(), 500);
    }
}

// Запуск
window.addEventListener('DOMContentLoaded', init);