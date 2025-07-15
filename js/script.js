// Menu Toggle para móviles
document.querySelector('.menu-toggle').addEventListener('click', function() {
    const navbar = document.querySelector('.navbar ul');
    navbar.classList.toggle('show');
    this.querySelector('i').classList.toggle('fa-times');
});

// Efecto hover para títulos
document.querySelectorAll('.hero-title, .nav-link').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Cambio de color al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'var(--rojo)';
    } else {
        header.style.background = 'linear-gradient(90deg, var(--rojo) 0%, var(--blanco) 50%, var(--verde) 100%)';
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // Menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    menuToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Scroll header
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Cerrar menú móvil si está abierto
                if (navList.classList.contains('active')) {
                    navList.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Animación de marcadores del mapa
    const markers = document.querySelectorAll('.map-marker');
    
    markers.forEach(marker => {
        marker.addEventListener('mouseenter', function() {
            const tooltip = this.querySelector('.map-tooltip');
            tooltip.style.opacity = '1';
            tooltip.style.bottom = 'calc(100% + 10px)';
        });
        
        marker.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.map-tooltip');
            tooltip.style.opacity = '0';
            tooltip.style.bottom = '100%';
        });
    });
    
    // Carga progresiva de imágenes
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});