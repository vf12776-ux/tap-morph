document.getElementById('character').onclick = function() {
    console.log('ТАП РАБОТАЕТ!');
    
    // Масштаб
    this.style.transform = 'scale(0.95)';
    
    // Моргание глаз
    document.getElementById('eye-left-bg').style.opacity = '0.3';
    document.getElementById('eye-right-bg').style.opacity = '0.3';
    
    // Улыбка
    document.getElementById('mouth').setAttribute('d', 'M 40 65 Q 50 75 60 65');
    
    // Звук
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/241/241-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Звук:', e));
    
    // Возврат
    setTimeout(() => {
        this.style.transform = '';
        document.getElementById('eye-left-bg').style.opacity = '1';
        document.getElementById('eye-right-bg').style.opacity = '1';
        document.getElementById('mouth').setAttribute('d', 'M 40 68 Q 50 73 60 68');
    }, 200);
};