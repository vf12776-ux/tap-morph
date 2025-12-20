const character = document.getElementById('character');

function morph() {
    // Анимация нажатия
    character.style.transform = 'scale(0.95)';
    setTimeout(() => {
        if (character.style.transform === 'scale(0.95)') {
            character.style.transform = 'scale(1)';
        }
    }, 200);

    // Рандомный морфинг
    const hue = Math.floor(Math.random() * 360);
    const rotate = Math.random() * 40 - 20; // от -20 до +20 градусов
    const scale = 0.9 + Math.random() * 0.3; // от 0.9 до 1.2

    character.style.filter = `hue-rotate(${hue}deg) brightness(1.3) saturate(1.5)`;
    character.style.transform = `scale(${scale}) rotate(${rotate}deg)`;

    // Сброс через секунду, чтобы можно было тапать снова
    setTimeout(() => {
        character.style.filter = '';
        character.style.transform = 'scale(1) rotate(0deg)';
    }, 1000);
}

// Клик для ПК
character.onclick = morph;

// Тач для мобильных
character.addEventListener('touchstart', (e) => {
    e.preventDefault();
    morph();
});