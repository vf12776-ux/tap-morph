const character = document.getElementById('character');
const soundToggle = document.getElementById('sound-toggle');

let soundEnabled = true;
let tapSound = null; // Звук загрузим один раз

// Загрузка звука (один раз при первом тапе)
function loadSound() {
    if (tapSound) return;
    tapSound = new Audio('sounds/i951.mp3');
    tapSound.volume = 0.8; // Громкость для детей
}

// Переключатель
soundToggle.onclick = function() {
    soundEnabled = !soundEnabled;
    this.textContent = soundEnabled ? '🔊' : '🔈';
};

function playTapSound() {
    if (!soundEnabled || !tapSound) return;
    tapSound.currentTime = 0;
    tapSound.play().catch(e => console.log("Звук не сыграл:", e));
}

function morph() {
    loadSound(); // Загрузим при первом тапе

    // Анимация нажатия
    character.style.transform = 'scale(0.95)';
    setTimeout(() => character.style.transform = 'scale(1)', 200);

    // Морфинг
    const hue = Math.floor(Math.random() * 360);
    const rotate = Math.random() * 40 - 20;
    const scale = 0.9 + Math.random() * 0.3;

    character.style.filter = `hue-rotate(${hue}deg) brightness(1.3) saturate(1.5)`;
    character.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

    setTimeout(() => {
        character.style.filter = '';
        character.style.transform = 'scale(1) rotate(0deg)';
    }, 1000);

    playTapSound(); // Звук!
}

character.onclick = morph;
character.addEventListener('touchstart', (e) => {
    e.preventDefault();
    morph();
});