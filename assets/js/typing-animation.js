// Rotating typing animation
document.addEventListener('DOMContentLoaded', function() {
    const h1 = document.querySelector('.profile .profile_inner h1');
    if (!h1) return;
    
    const texts = [
        'Merhaba, Ben VyOfGod',
        'Siber Güvenlik Uzmanı',
        'Full Stack Developer',
        'Penetration Tester'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isPaused) {
            setTimeout(type, 2000);
            isPaused = false;
            isDeleting = true;
            return;
        }
        
        if (isDeleting) {
            h1.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 500);
                return;
            }
        } else {
            h1.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isPaused = true;
            }
        }
        
        const speed = isDeleting ? 50 : 100;
        setTimeout(type, speed);
    }
    
    // Start typing
    type();
});
