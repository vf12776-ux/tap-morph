console.log('app.js ЗАГРУЖЕН');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM готов');
    
    const character = document.getElementById('character');
    console.log('Персонаж найден?', !!character);
    
    if (!character) {
        console.error('Элемент #character не найден!');
        return;
    }
    
    character.addEventListener('click', function(event) {
        console.log('ТАП!', event.clientX, event.clientY);
        
        character.style.transform = 'scale(0.95)';
        setTimeout(() => {
            character.style.transform = 'scale(1)';
        }, 200);
        
        const audio = new Audio();
        audio.src = 'https://assets.mixkit.co/active_storage/sfx/241/241-preview.mp3';
        audio.volume = 0.3;
        audio.play().catch(e => console.log('Звук не воспроизведён:', e));
    });
    
    console.log('Обработчик тапа установлен');
});
