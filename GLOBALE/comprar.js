// =============================================
// CÓDIGO CON DEBUG COMPLETO
// =============================================

// Función con DEBUG COMPLETO
function añadirAlCarrito(nombreJuego) {
    console.log('🛒 ===== INICIANDO AÑADIR AL CARRITO =====');
    console.log('📝 Nombre recibido:', nombreJuego);
    console.log('🎯 Botón clickeado:', event.target);
    
    // Buscar el precio en el h5 con clase "precio-act"
    const precio = buscarPrecioEspecifico();
    
    if (!precio) {
        console.error('❌ ERROR: No se pudo encontrar el precio del producto');
        console.log('💡 SUGERENCIA: Revisa que exista un elemento h5 con clase "precio-act" cerca del botón');
        mostrarError('No se pudo encontrar el precio del producto');
        return;
    }
    
    console.log('✅ Precio encontrado:', precio);
    
    // Obtener carrito actual
    let carrito = JSON.parse(sessionStorage.getItem('carrito') || '[]');
    console.log('🛍️ Carrito actual:', carrito);
    
    // Verificar si el juego ya está en el carrito
    const juegoExistente = carrito.find(item => item.nombre === nombreJuego);
    
    if (juegoExistente) {
        juegoExistente.cantidad += 1;
        juegoExistente.precioTotal = calcularPrecioTotal(juegoExistente.precioUnitario, juegoExistente.cantidad);
        console.log('📦 Producto existente, cantidad aumentada:', juegoExistente.cantidad);
    } else {
        const precioUnitario = extraerPrecioNumerico(precio);
        const nuevoProducto = {
            nombre: nombreJuego,
            precioUnitario: precioUnitario,
            precio: precio,
            precioTotal: precioUnitario,
            cantidad: 1,
            id: Date.now()
        };
        carrito.push(nuevoProducto);
        console.log('🆕 Nuevo producto añadido:', nuevoProducto);
    }
    
    // Guardar en sessionStorage
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar confirmación
    mostrarConfirmacionCarrito(nombreJuego);
    
    console.log('✅ PRODUCTO AÑADIDO EXITOSAMENTE');
    console.log('🛍️ Carrito actualizado:', carrito);
    
    // Actualizar contador del carrito si existe
    actualizarContadorCarrito();
}

// Función con DEBUG DETALLADO
function buscarPrecioEspecifico() {
    const button = event.target;
    console.log('🔎 ===== BUSCANDO PRECIO =====');
    console.log('📍 Botón:', button);
    console.log('📋 Clases del botón:', button.className);
    
    // Buscar en diferentes contenedores posibles
    const contenedores = [
        button.closest('.juego'),
        button.closest('.card'),
        button.closest('.game'),
        button.closest('.producto'),
        button.closest('div'),
        button.parentElement,
        button.parentElement?.parentElement
    ];
    
    let card = null;
    for (let contenedor of contenedores) {
        if (contenedor) {
            card = contenedor;
            console.log('✅ Contenedor encontrado:', contenedor);
            console.log('🏷️ Clases del contenedor:', contenedor.className);
            break;
        }
    }
    
    if (!card) {
        console.log('❌ No se encontró ningún contenedor padre');
        console.log('🔍 Estructura HTML alrededor del botón:');
        let elementoActual = button;
        for (let i = 0; i < 5 && elementoActual; i++) {
            console.log(`   Nivel ${i}: <${elementoActual.tagName.toLowerCase()} class="${elementoActual.className}">`);
            elementoActual = elementoActual.parentElement;
        }
        return null;
    }
    
    // BUSCAR PRECIO en h5.precio-act
    console.log('💰 Buscando elemento h5.precio-act...');
    const precioElement = card.querySelector('h5.precio-act');
    
    if (precioElement) {
        const precio = precioElement.textContent.trim();
        console.log('✅ PRECIO ENCONTRADO:', precio);
        console.log('📍 Elemento encontrado:', precioElement);
        return precio;
    } else {
        console.log('❌ No se encontró h5.precio-act en el contenedor');
        
        // DEBUG COMPLETO: Mostrar TODOS los elementos en el contenedor
        console.log('🔍 === ELEMENTOS EN EL CONTENEDOR ===');
        const todosElementos = card.querySelectorAll('*');
        console.log(`📊 Total de elementos en el contenedor: ${todosElementos.length}`);
        
        todosElementos.forEach((elemento, index) => {
            if (elemento.textContent.trim()) { // Solo mostrar elementos con texto
                console.log(`   [${index}] <${elemento.tagName.toLowerCase()} class="${elemento.className}">: "${elemento.textContent.trim()}"`);
            }
        });
        
        // Buscar cualquier h5 como alternativa
        console.log('🔍 Buscando cualquier elemento h5...');
        const todosH5 = card.querySelectorAll('h5');
        if (todosH5.length > 0) {
            console.log(`📊 Se encontraron ${todosH5.length} elementos h5:`);
            todosH5.forEach((h5, index) => {
                console.log(`   h5[${index}] class="${h5.className}": "${h5.textContent.trim()}"`);
            });
        } else {
            console.log('❌ No se encontró ningún elemento h5');
        }
        
        // Buscar cualquier elemento con clase que contenga "precio"
        console.log('🔍 Buscando elementos con "precio" en la clase...');
        const elementosPrecio = card.querySelectorAll('[class*="precio"]');
        if (elementosPrecio.length > 0) {
            console.log(`📊 Elementos con "precio" en clase: ${elementosPrecio.length}`);
            elementosPrecio.forEach((elem, index) => {
                console.log(`   [${index}] <${elem.tagName.toLowerCase()} class="${elem.className}">: "${elem.textContent.trim()}"`);
            });
        }
    }
    
    return null;
}

// Las demás funciones se mantienen igual...
function extraerPrecioNumerico(precioString) {
    if (!precioString) return 0;
    
    console.log('🔢 Extrayendo número de:', precioString);
    
    const numeros = precioString.replace(/[^\d.,]/g, '');
    const numeroLimpio = numeros.replace(',', '.');
    
    const resultado = parseFloat(numeroLimpio) || 0;
    console.log('💰 Número extraído:', resultado);
    
    return resultado;
}

function calcularPrecioTotal(precioUnitario, cantidad) {
    return precioUnitario * cantidad;
}

function mostrarConfirmacionCarrito(nombreJuego) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
    `;
    notificacion.innerHTML = `✅ ${nombreJuego} añadido al carrito`;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

function mostrarError(mensaje) {
    const notificacion = document.createElement('div');
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
    `;
    notificacion.innerHTML = `❌ ${mensaje}`;
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito') || '[]');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    const contador = document.querySelector('.carrito-contador, .cart-count, [class*="contador"]');
    if (contador) {
        contador.textContent = totalItems;
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

window.añadirAlCarrito = añadirAlCarrito;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Página de inicio cargada');
    actualizarContadorCarrito();
});
// =============================================
// DETECCIÓN AUTOMÁTICA PARA FORMULARIO CORRECTO
// =============================================

function redirigirAFormularioCorrecto() {
    console.log('🛒 ===== REDIRIGIENDO A FORMULARIO =====');
    
    // Obtener la página actual para detectar qué formulario usar
    const urlActual = window.location.pathname;
    const nombreArchivo = urlActual.split('/').pop().toLowerCase();
    console.log('📄 Archivo actual:', nombreArchivo);
    
    let formularioDestino = '../PEDIDOS/pedidos.html'; // Por defecto
    
    // Detectar si estamos en una página de PS2
    if (nombreArchivo.includes('ps2') || 
        nombreArchivo.includes('playstation2') ||
        urlActual.includes('PLAYSTATION%202') ||
        urlActual.includes('PLAYSTATION 2')) {
        formularioDestino = '../PEDIDOS/pedidosps2.html';
        console.log('🎯 Detectada página PS2 -> Formulario PS2');
    }
    // Detectar si estamos en una página de PS3, PS4, PS5
    else if (nombreArchivo.includes('ps3') || nombreArchivo.includes('ps4') || nombreArchivo.includes('ps5') ||
             nombreArchivo.includes('playstation3') || nombreArchivo.includes('playstation4') || nombreArchivo.includes('playstation5') ||
             urlActual.includes('PLAYSTATION%204-5') ||
             urlActual.includes('PLAYSTATION 4-5')) {
        formularioDestino = '../PEDIDOS/pedidos.html';
        console.log('🎯 Detectada página PS3/PS4/PS5 -> Formulario normal');
    }
    
    console.log('📍 Redirigiendo a:', formularioDestino);
    
    // Redirigir al formulario correspondiente
    window.location.href = formularioDestino;
}

function configurarBotonCarritoCompleto() {
    const botones = document.querySelectorAll('button, a');
    
    botones.forEach(boton => {
        if (boton.textContent.toLowerCase().includes('ver carrito completo')) {
            console.log('🎯 Configurando botón "Ver Carrito Completo"');
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                redirigirAFormularioCorrecto();
            });
            // Remover cualquier onclick existente
            if (boton.hasAttribute('onclick')) {
                boton.removeAttribute('onclick');
            }
        }
    });
}

// Configurar el botón cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Página de inicio cargada');
    actualizarContadorCarrito();
    configurarBotonCarritoCompleto();
});

// También configurar cuando se hace clic en el botón flotante del carrito
document.addEventListener('click', function(e) {
    if (e.target.closest('.carrito-flotante') || 
        e.target.closest('[class*="carrito"]') ||
        e.target.textContent.toLowerCase().includes('ver carrito completo')) {
        console.log('🔄 Reconfigurando botón carrito...');
        setTimeout(configurarBotonCarritoCompleto, 100);
    }
});

// Hacer la función global
window.redirigirAFormularioCorrecto = redirigirAFormularioCorrecto;

