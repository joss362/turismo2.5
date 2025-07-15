// Mostrar/ocultar recetas
document.querySelectorAll('.recipe-toggle').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.toggle('active');
        const recipe = this.nextElementSibling;
        recipe.classList.toggle('show');
    });
});

// Efecto hover para imágenes
document.querySelectorAll('.dish-image img, .ingredient-card img, .restaurant-card img').forEach(img => {
    img.addEventListener('mouseenter', function() {
        this.style.filter = 'grayscale(30%) contrast(110%)';
    });
    
    img.addEventListener('mouseleave', function() {
        this.style.filter = 'grayscale(80%) contrast(110%)';
    });
});

// Slider de restaurantes
const slider = document.querySelector('.restaurants-slider');
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
});

slider.addEventListener('mouseup', () => {
    isDown = false;
});

slider.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
});