// ===== FUNCIONES PARA EL CARRITO FLOTANTE =====

// Función para actualizar el contador del carrito flotante
function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito') || '[]');
    const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const contador = document.getElementById('contadorCarritoFlotante');
    const contadorHeader = document.getElementById('contador-carrito');
    
    if (contador) {
        contador.textContent = totalProductos;
        if (totalProductos === 0) {
            contador.style.display = 'none';
        } else {
            contador.style.display = 'flex';
        }
    }
    
    if (contadorHeader) {
        contadorHeader.textContent = totalProductos;
    }
}

// Función para mostrar/ocultar el mini carrito
function toggleCarritoFlotante() {
    const miniCarrito = document.getElementById('miniCarritoFlotante');
    if (miniCarrito) {
        miniCarrito.classList.toggle('mostrar');
        if (miniCarrito.classList.contains('mostrar')) {
            actualizarMiniCarrito();
        }
    }
}

// Función para actualizar el contenido del mini carrito
function actualizarMiniCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito') || '[]');
    const contenido = document.getElementById('contenidoMiniCarrito');
    const totalElement = document.getElementById('totalMiniCarrito');
    
    if (!contenido) return;
    
    // Calcular total
    let total = 0;
    carrito.forEach(item => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        total += precioNumerico * item.cantidad;
    });
    
    const totalMostrar = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    if (totalElement) {
        totalElement.textContent = `${totalMostrar} Gs`;
    }
    
    if (!carrito || carrito.length === 0) {
        contenido.innerHTML = '<div class="mini-carrito-vacio">Carrito vacío</div>';
        return;
    }
    
    let html = '';
    carrito.forEach(item => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        const precioMostrar = precioNumerico.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        html += `
            <div class="item-mini-carrito">
                <div class="info-mini-item">
                    <div class="nombre-mini">${item.nombre || 'Juego sin nombre'}</div>
                    <div class="detalle-mini">${precioMostrar} Gs x ${item.cantidad}</div>
                </div>
            </div>
        `;
    });
    
    contenido.innerHTML = html;
}

// Función para ir al carrito completo - SIN PS3
function irAlCarrito() {
    const currentUrl = window.location.href;
    
    console.log('🔍 URL actual:', currentUrl);
    
    // Detectar PS2
    if (currentUrl.includes('PLAYSTATION 2') || 
        currentUrl.includes('playstation%202') ||
        currentUrl.includes('/PLAYSTATION%202/')) {
        
        console.log('🎮 Detectada página PS2, redirigiendo a pedidosps2.html');
        window.location.href = '/PEDIDOS/pedidosps2.html';
        return;
    } 
    // Detectar PS4/PS5
    else if (currentUrl.includes('PLAYSTATION 4') || 
             currentUrl.includes('PLAYSTATION 5') ||
             currentUrl.includes('playstation%204') ||
             currentUrl.includes('playstation%205')) {
        
        console.log('🎮 Detectada página PS4/PS5, redirigiendo a pedidos.html');
        window.location.href = '/PEDIDOS/pedidos.html';
        return;
    }
    // Página general
    else {
        console.log('🌐 Página general, redirigiendo a pedidos.html');
        window.location.href = '/PEDIDOS/pedidos.html';
        return;
    }
}

// Cerrar el mini carrito al hacer clic fuera de él
document.addEventListener('click', function(event) {
    const carritoFlotante = document.getElementById('carritoFlotante');
    const miniCarrito = document.getElementById('miniCarritoFlotante');
    const btnCarrito = document.querySelector('.btn-carrito-flotante');
    
    if (miniCarrito && miniCarrito.classList.contains('mostrar') && 
        !carritoFlotante.contains(event.target) && 
        event.target !== btnCarrito) {
        miniCarrito.classList.remove('mostrar');
    }
});

// Función para añadir producto al carrito
function añadirAlCarrito(nombreJuego) {
    console.log('🛒 Añadiendo al carrito:', nombreJuego);
    
    // Buscar automáticamente el precio
    let precioJuego = 'Consultar precio';
    const button = event.target;
    const card = button.closest('.juego, .card, .game');
    
    if (card) {
        const precioElement = card.querySelector('h5.precio-act, .precio, .price');
        if (precioElement) {
            precioJuego = precioElement.textContent.trim();
        }
    }
    
    // Obtener carrito actual
    let carrito = JSON.parse(sessionStorage.getItem('carrito') || '[]');
    
    // Verificar si el juego ya está en el carrito
    const juegoExistente = carrito.find(item => item.nombre === nombreJuego);
    
    if (juegoExistente) {
        juegoExistente.cantidad += 1;
    } else {
        carrito.push({
            nombre: nombreJuego,
            precio: precioJuego,
            cantidad: 1,
            id: Date.now()
        });
    }
    
    // Guardar en sessionStorage
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar contador del carrito flotante
    actualizarContadorCarrito();
    
    console.log('✅ Producto añadido. Carrito actual:', carrito);
}

// Inicializar contador al cargar la página
function inicializarCarrito() {
    console.log('🏠 Inicializando carrito...');
    actualizarContadorCarrito();
    
    // Agregar event listener al botón de ver carrito completo
    const btnVerCarrito = document.querySelector('.btn-ver-carrito-completo');
    if (btnVerCarrito) {
        // Remover event listeners existentes para evitar duplicados
        btnVerCarrito.replaceWith(btnVerCarrito.cloneNode(true));
        
        // Agregar nuevo event listener
        document.querySelector('.btn-ver-carrito-completo').addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔄 Botón Ver Carrito clickeado');
            irAlCarrito();
        });
        console.log('✅ Event listener agregado al botón Ver Carrito');
    } else {
        console.log('❌ No se encontró el botón Ver Carrito');
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCarrito);
} else {
    inicializarCarrito();
}

// Hacer funciones globales
window.añadirAlCarrito = añadirAlCarrito;
window.toggleCarritoFlotante = toggleCarritoFlotante;
window.irAlCarrito = irAlCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito;

console.log('✅ btncarrito.js cargado correctamente (SIN PS3)');