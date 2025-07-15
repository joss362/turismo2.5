
// Efecto hover para imágenes de festivales
document.querySelectorAll('.festival-image img, .gallery-item img').forEach(img => {
    img.addEventListener('mouseenter', function() {
        this.style.filter = 'grayscale(30%) contrast(110%)';
    });
    
    img.addEventListener('mouseleave', function() {
        this.style.filter = 'grayscale(80%) contrast(110%)';
    });
});

// Galería lightbox
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const imgSrc = this.querySelector('img').src;
        const caption = this.querySelector('.gallery-caption').textContent;
        
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${imgSrc}" alt="${caption}">
                <p>${caption}</p>
                <button class="close-lightbox"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Cerrar lightbox
        lightbox.querySelector('.close-lightbox').addEventListener('click', () => {
            lightbox.remove();
        });
        
        lightbox.addEventListener('click', (e) => {
            if(e.target === lightbox) {
                lightbox.remove();
            }
        });
    });
});

// Animación de tarjetas al aparecer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.festival-card, .calendar-month, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});