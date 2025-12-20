const character = document.getElementById('character');
const soundToggle = document.getElementById('sound-toggle');

// Список милых звуков (bubble pop и boing — идеально для детей)
const soundUrls = [
    'https://cdn.pixabay.com/download/audio/2022/08/02/audio_8e6ff7d3b5.mp3?filename=bubble-pop-1-103661.mp3',  // Весёлый пузырь
    'https://cdn.pixabay.com/download/audio/2022/08/02/audio_5d6f9c1e5e.mp3?filename=bubble-pop-2-103662.mp3',  // Ещё один поп
    'https://assets.mixkit.co/sfx/preview/mixkit-cartoon-bubble-pop-2930.mp3'  // Лёгкий boing/pop
];

let soundEnabled = true; // Включён по умолчанию
let audioContextUnlocked = false; // Для разблокировки на мобильных

// Переключатель звука
soundToggle.onclick = function() {
    soundEnabled = !soundEnabled;
    this.textContent = soundEnabled ? '🔊' : '🔈';
};

// Разблокировка AudioContext на мобильных (нужна для первого тапа)
function unlockAudio() {
    if (audioContextUnlocked) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state !== 'running') {
            ctx.resume();
        }
        audioContextUnlocked = true;
    }
}

// Играть рандомный звук
function playRandomSound() {
    if (!soundEnabled) return;
    
    unlockAudio(); // Разблокируем при первом тапе
    
    const randomUrl = soundUrls[Math.floor(Math.random() * soundUrls.length)];
    const audio = new Audio(randomUrl);
    audio.volume = 0.7; // Не слишком громко
    audio.play().catch(e => console.log("Звук не сыграл (возможно, первый тап):", e));
}

function morph() {
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

    // Звук при тапе
    playRandomSound();
}

// Тап/клик
character.onclick = morph;
character.addEventListener('touchstart', (e) => {
    e.preventDefault();
    morph();
});