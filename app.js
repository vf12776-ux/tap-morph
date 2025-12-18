// Состояние приложения
let currentState = {
    effect: 0,
    soundEnabled: true
};

// Эффекты для картинки
const effects = [
    { filter: 'none', transform: 'scale(1)' },          // 0: нормально
    { filter: 'hue-rotate(90deg)', transform: 'scale(1.1)' }, // 1: цвет + увеличение
    { filter: 'saturate(2)', transform: 'rotate(10deg)' },    // 2: насыщенность + поворот
    { filter: 'invert(1)', transform: 'scale(0.9)' },         // 3: инвертирование
    { filter: 'sepia(1)', transform: 'scale(1)' },            // 4: сепия
    { filter: 'blur(2px)', transform: 'scale(1.05)' },        // 5: размытие
    { filter: 'brightness(1.5)', transform: 'skewX(10deg)' }, // 6: яркость + наклон
    { filter: 'contrast(2)', transform: 'scale(1)' },         // 7: контраст
    { filter: 'drop-shadow(10px 10px 5px #666)', transform: 'scale(1)' }, // 8: тень
    { filter: 'grayscale(1)', transform: 'scale(1)' },        // 9: ч/б
    { filter: 'hue-rotate(180deg) saturate(3)', transform: 'scale(1.2)' }, // 10: психоделия
    { filter: 'none', transform: 'scale(1) rotate(360deg)' }  // 11: вращение
];

// История последних эффектов
let history = [];
const HISTORY_SIZE = 4;

// Элементы
const character = document.getElementById('character');
const soundToggle = document.getElementById('sound-toggle');

// Инициализация
function init() {
    // Загрузка состояния
    const savedState = localStorage.getItem('morphState');
    if (savedState) {
        currentState = JSON.parse(savedState);
    }
    
    // Звук
    currentState.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    updateSoundButton();
    
    // Первый эффект
    updateCharacter();
    
    // Обработчики
    character.addEventListener('click', handleTap);
    character.addEventListener('touchstart', handleTap);
    soundToggle.addEventListener('click', toggleSound);
    
    // Подсказка
    document.addEventListener('click', hideHint, { once: true });
    document.addEventListener('touchstart', hideHint, { once: true });
}

// Обработка касания
function handleTap(e) {
    e.preventDefault();
    
    // Выбираем новый эффект, избегая повторений
    let newEffect;
    do {
        newEffect = Math.floor(Math.random() * effects.length);
        if (history.length < HISTORY_SIZE) break;
    } while (history.includes(newEffect));
    
    // Обновляем историю
    history.push(newEffect);
    if (history.length > HISTORY_SIZE) {
        history.shift();
    }
    
    // Применяем
    currentState.effect = newEffect;
    updateCharacter();
    playSound();
    saveState();
    
    // Анимация тапа
    character.style.transform = effects[newEffect].transform + ' scale(0.95)';
    setTimeout(() => {
        character.style.transform = effects[newEffect].transform;
    }, 150);
}

// Обновить картинку
function updateCharacter() {
    const effect = effects[currentState.effect];
    character.style.filter = effect.filter;
    character.style.transform = effect.transform;
    character.style.transition = 'all 0.3s ease';
}

// Звук
function playSound() {
    if (!currentState.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Разные ноты для разных эффектов
        const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
        const frequency = notes[currentState.effect % notes.length];
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
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