const character = document.getElementById('character');
const soundToggle = document.getElementById('sound-toggle');
const sounds = [
    document.getElementById('pop1'),
    document.getElementById('boing')
];

let soundEnabled = true; // Звук включён по умолчанию

// Переключатель (меняет эмодзи и статус)
soundToggle.onclick = function() {
    soundEnabled = !soundEnabled;
    this.textContent = soundEnabled ? '🔊' : '🔈';
};

// Играть рандомный звук
function playRandomSound() {
    if (!soundEnabled || sounds.length === 0) return;
    
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    randomSound.currentTime = 0; // Сброс для повторного воспроизведения
    randomSound.play().catch(() => {}); // Игнорируем ошибки (на мобильных иногда блокирует до тапа)
}

function morph() {
    // Анимация нажатия
    character.style.transform = 'scale(0.95)';
    setTimeout(() => character.style.transform = 'scale(1)', 200);

    // Морфинг (цвет, поворот, масштаб)
    const hue = Math.floor(Math.random() * 360);
    const rotate = Math.random() * 40 - 20;
    const scale = 0.9 + Math.random() * 0.3;

    character.style.filter = `hue-rotate(${hue}deg) brightness(1.3) saturate(1.5)`;
    character.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

    // Сброс морфинга
    setTimeout(() => {
        character.style.filter = '';
        character.style.transform = 'scale(1) rotate(0deg)';
    }, 1000);

    // Звук!
    playRandomSound();
}

// События тапа/клика
character.onclick = morph;
character.addEventListener('touchstart', (e) => {
    e.preventDefault();
    morph();
});