document.addEventListener('DOMContentLoaded', function() {
    const carrusel = document.querySelector('.juegos-top');
    const productos = document.querySelectorAll('.producto-1');
    const container = document.querySelector('.carrusel-container');
    
    let currentIndex = 1;
    const gap = 30;
    let productWidth = 300;
    let isAnimating = false;

    // Prevenir scroll de rueda del mouse en el carrusel
    container.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });

    // Prevenir arrastre que cause scroll
    container.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });

    function inicializarCarrusel() {
        if (productos.length > 0) {
            productWidth = productos[0].offsetWidth;
            centrarCarrusel();
            aplicarEfectosCentrado();
        }
    }

    function centrarCarrusel() {
        if (isAnimating) return;
        isAnimating = true;

        const containerWidth = container.offsetWidth;
        const totalProductWidth = productWidth + gap;
        
        const desplazamiento = (currentIndex * totalProductWidth) - 
                             ((containerWidth - productWidth) / 2);
        
        carrusel.style.transform = `translateX(-${desplazamiento}px)`;
        
        // Resetear flag de animación
        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    function aplicarEfectosCentrado() {
        productos.forEach((producto, index) => {
            producto.classList.remove('producto-central', 'producto-lateral', 'producto-lejano');
            
            const distancia = Math.abs(index - currentIndex);
            
            if (distancia === 0) {
                producto.classList.add('producto-central');
            } else if (distancia === 1) {
                producto.classList.add('producto-lateral');
            } else {
                producto.classList.add('producto-lejano');
            }
        });
    }

    function siguienteProducto() {
        if (isAnimating) return;
        
        if (currentIndex < productos.length - 2) {
            currentIndex++;
        } else {
            currentIndex = 1;
        }
        centrarCarrusel();
        aplicarEfectosCentrado();
    }

    function productoAnterior() {
        if (isAnimating) return;
        
        if (currentIndex > 1) {
            currentIndex--;
        } else {
            currentIndex = productos.length - 2;
        }
        centrarCarrusel();
        aplicarEfectosCentrado();
    }

    // Navegación con teclado (opcional)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            productoAnterior();
        } else if (e.key === 'ArrowRight') {
            siguienteProducto();
        }
    });

    // Botones de navegación
    function crearBotonesNavegacion() {
        const btnPrev = document.createElement('button');
        btnPrev.innerHTML = '‹';
        btnPrev.className = 'nav-btn prev';
        btnPrev.onclick = productoAnterior;
        
        const btnNext = document.createElement('button');
        btnNext.innerHTML = '›';
        btnNext.className = 'nav-btn next';
        btnNext.onclick = siguienteProducto;
        
        container.appendChild(btnPrev);
        container.appendChild(btnNext);
    }

    // Estilos para botones
    const style = document.createElement('style');
    style.textContent = `
        .nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(59, 130, 246, 0.8);
            color: white;
            border: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            font-size: 28px;
            cursor: pointer;
            z-index: 100;
            transition: all 0.3s ease;
        }
        .nav-btn:hover {
            background: rgba(59, 130, 246, 1);
            transform: translateY(-50%) scale(1.1);
        }
        .prev { left: 20px; }
        .next { right: 20px; }
    `;
    document.head.appendChild(style);

    // Inicializar
    inicializarCarrusel();
    crearBotonesNavegacion();

    // Carrusel automático
    let intervalo = setInterval(siguienteProducto, 4000);

    // Pausar/reanudar automático
    container.addEventListener('mouseenter', () => {
        clearInterval(intervalo);
    });

    container.addEventListener('mouseleave', () => {
        intervalo = setInterval(siguienteProducto, 4000);
    });

    window.addEventListener('resize', inicializarCarrusel);
});