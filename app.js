document.getElementById('character').onclick = function() {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => this.style.transform = '', 200);
};
