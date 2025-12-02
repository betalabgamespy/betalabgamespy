console.log('🎯 formulariops2.js INICIADO - script cargado');

// Función para obtener los datos del CARRITO - USANDO sessionStorage
function obtenerDatosCarrito() {
    console.log('🔍 Ejecutando obtenerDatosCarrito()');
    const carritoGuardado = sessionStorage.getItem('carrito');
    console.log('📦 sessionStorage carrito:', carritoGuardado);
    
    if (!carritoGuardado || carritoGuardado === 'null' || carritoGuardado === '[]') {
        console.log('📭 Carrito vacío');
        return [];
    }
    
    try {
        return JSON.parse(carritoGuardado);
    } catch (error) {
        console.error('❌ Error parseando carrito:', error);
        return [];
    }
}

// FUNCIÓN VACIAR CARRITO - SIN CONFIRMACIÓN
function vaciarCarrito() {
    console.log('🔄 vaciarCarrito ejecutada');
    
    // Verificar si hay algo que vaciar
    const carritoSession = sessionStorage.getItem('carrito');
    
    if (!carritoSession || carritoSession === 'null' || carritoSession === '[]') {
        alert('❌ El carrito ya está vacío');
        return;
    }
    
    // VACIAR DIRECTAMENTE SIN CONFIRMACIÓN
    localStorage.removeItem('carrito');
    sessionStorage.removeItem('carrito');
    
    console.log('✅ Storages limpiados');
    alert('✅ Carrito vaciado correctamente');
    
    // RECARGAR INMEDIATAMENTE
    location.reload();
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOMContentLoaded - Página lista');
    
    const carrito = obtenerDatosCarrito();
    console.log('📦 Carrito al cargar:', carrito);
    
    if (carrito.length > 0) {
        console.log('✅ Mostrando carrito con', carrito.length, 'items');
        mostrarResumenCarrito(carrito);
    } else {
        console.log('📝 Mostrando formulario individual');
        const { nombreJuego, precioJuego } = obtenerDatosJuego();
        document.getElementById('nombreJuego').textContent = nombreJuego;
    }
});

// Función para calcular el total del carrito
function calcularTotalCarrito(carrito) {
    let total = 0;
    carrito.forEach(item => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        total += precioNumerico * item.cantidad;
    });
    return total;
}

// Función para formatear números con puntos
function formatearNumero(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Función para mostrar el resumen del carrito
function mostrarResumenCarrito(carrito) {
    const tituloElement = document.getElementById('nombreJuego');
    
    if (!carrito || carrito.length === 0) {
        tituloElement.textContent = 'Carrito vacío';
        return;
    }
    
    const totalJuegos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    // Actualizar títulos
    const tituloFormulario = document.querySelector('.titulo-formulario');
    if (tituloFormulario) {
        tituloFormulario.textContent = '🛒 Pedir Videojuegos del Carrito';
    }
    
    const h3Element = document.querySelector('#infoJuego h3');
    if (h3Element) {
        h3Element.textContent = '🎮 Juegos en tu Carrito:';
    }
    
    tituloElement.textContent = `Pedido de ${totalJuegos} juego(s)`;
    
    // Crear HTML del resumen
    let htmlResumen = '<div class="resumen-pedido">';
    htmlResumen += '<h4>📋 Detalles de tu pedido:</h4>';
    htmlResumen += '<div class="lista-juegos">';
    
    carrito.forEach((item) => {
        let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
        precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
        const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
        const subtotal = precioNumerico * item.cantidad;
        
        const precioMostrar = formatearNumero(precioNumerico);
        const subtotalMostrar = formatearNumero(subtotal);
        
        htmlResumen += `
            <div class="item-resumen">
                <div class="info-juego-item">
                    <span class="nombre-juego">${item.nombre || 'Juego sin nombre'}</span>
                    <span class="precio-juego">${precioMostrar} Gs x ${item.cantidad}</span>
                </div>
                <div class="subtotal-juego">Subtotal: ${subtotalMostrar} Gs</div>
            </div>
        `;
    });
    
    const total = calcularTotalCarrito(carrito);
    const totalMostrar = formatearNumero(total);
    
    // BOTÓN VACIAR CARRITO
    htmlResumen += `
    </div>
    <div class="total-pedido">
        <strong>💰 Total a pagar: ${totalMostrar} Gs</strong>
    </div>
    <button type="button" class="btn-vaciar-carrito" onclick="vaciarCarrito()">
        🗑️ Vaciar Carrito
    </button>
</div>`;
    
    // Insertar en el DOM
    const nombreJuegoElement = document.getElementById('nombreJuego');
    if (nombreJuegoElement && nombreJuegoElement.parentNode) {
        const resumenAnterior = document.getElementById('resumen-carrito');
        if (resumenAnterior) {
            resumenAnterior.remove();
        }
        
        const contenedorResumen = document.createElement('div');
        contenedorResumen.id = 'resumen-carrito';
        contenedorResumen.className = 'resumen-carrito';
        contenedorResumen.innerHTML = htmlResumen;
        nombreJuegoElement.parentNode.insertBefore(contenedorResumen, nombreJuegoElement.nextSibling);
    }
    
    // Ocultar sección de juegos PS2
    const seccionJuegosPS2 = document.querySelector('.seccion-formulario:nth-child(3)');
    if (seccionJuegosPS2) {
        seccionJuegosPS2.style.display = 'none';
    }
    
    console.log('✅ Resumen del carrito mostrado');
}

// Función para obtener datos del juego individual
function obtenerDatosJuego() {
    let nombreJuego = 'Juego no especificado';
    let precioJuego = 'Consultar precio';
    
    const juegoSession = sessionStorage.getItem('juegoSeleccionado');
    const precioSession = sessionStorage.getItem('precioJuego');
    
    if (juegoSession) {
        nombreJuego = juegoSession;
    }
    
    if (precioSession) {
        precioJuego = precioSession;
    }
    
    console.log('🎮 Datos del juego:', { nombreJuego, precioJuego });
    return { nombreJuego, precioJuego };
}

// FUNCIÓN SIMPLE PARA ENVIAR A GMAIL
function enviarAGmail(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const juegosPS2 = document.getElementById('juegosPS2').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validar campos requeridos
    if (!nombre || !apellido || !telefono || !email) {
        alert('❌ Por favor completa todos los campos requeridos');
        return;
    }
    
    // Obtener carrito
    const carrito = obtenerDatosCarrito();
    
    // Crear mensaje para Gmail
    let cuerpoMensaje = `NUEVO PEDIDO PS2 - BETALAB GAMES PY\n\n`;
    cuerpoMensaje += `INFORMACIÓN DEL CLIENTE:\n`;
    cuerpoMensaje += `Nombre: ${nombre} ${apellido}\n`;
    cuerpoMensaje += `Email: ${email}\n`;
    cuerpoMensaje += `Teléfono: ${telefono}\n`;
    cuerpoMensaje += `Mensaje: ${mensaje || 'No especificado'}\n\n`;
    
    if (carrito.length > 0) {
        // PEDIDO DESDE CARRITO
        cuerpoMensaje += `🛒 PEDIDO DESDE CARRITO:\n`;
        const total = calcularTotalCarrito(carrito);
        const totalMostrar = formatearNumero(total);
        
        carrito.forEach((item, index) => {
            let precioLimpio = item.precio ? item.precio.replace(/\s?Gs\s?/g, '') : '0';
            precioLimpio = precioLimpio.replace('$', '').replace(/\./g, '');
            const precioNumerico = parseFloat(precioLimpio.replace(/[^\d]/g, '')) || 0;
            
            cuerpoMensaje += `${index + 1}. ${item.nombre}\n`;
            cuerpoMensaje += `   Cantidad: ${item.cantidad} x ${formatearNumero(precioNumerico)} Gs\n\n`;
        });
        
        cuerpoMensaje += `💰 TOTAL: ${totalMostrar} Gs\n\n`;
    } else {
        // PEDIDO INDIVIDUAL PS2
        cuerpoMensaje += `🎮 PEDIDO PS2 INDIVIDUAL:\n`;
        const { nombreJuego } = obtenerDatosJuego();
        cuerpoMensaje += `Pendrive: ${nombreJuego}\n`;
        cuerpoMensaje += `Juegos solicitados:\n${juegosPS2}\n\n`;
    }
    
    cuerpoMensaje += `📅 Fecha: ${new Date().toLocaleString('es-PY')}\n`;
    cuerpoMensaje += `🌐 Página: ${window.location.href}`;
    
    // Mostrar mensaje de confirmación
    const confirmarEnvio = confirm(
        '📧 ¿ABRIR GMAIL PARA ENVIAR EL PEDIDO?\n\n' +
        'Se abrirá tu Gmail con todos los datos del pedido.\n\n' +
        '• Solo haz clic en "ENVIAR"\n' +
        '• Tu pedido llegará directamente\n' +
        '• Te contactaremos en el día\n\n' +
        '¿Continuar?'
    );
    
    if (!confirmarEnvio) {
        return; // El usuario canceló
    }
    
    // Enviar por Gmail
    const emailDestino = 'betalabgamespedidos@gmail.com'; // CAMBIA POR TU GMAIL
    const asunto = carrito.length > 0 ? 
        `🎮 PEDIDO CARRITO - ${nombre} ${apellido}` : 
        `🎮 PEDIDO PS2 - ${nombre} ${apellido}`;
    
    const mailtoLink = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoMensaje)}`;
    
    // Mostrar mensaje de éxito
    document.getElementById('mensajeExito').style.display = 'block';
    
    // Abrir cliente de correo después de un breve delay
    setTimeout(() => {
        window.location.href = mailtoLink;
    }, 500);
    
    // Vaciar carrito si era un pedido desde carrito
    if (carrito.length > 0) {
        setTimeout(() => {
            sessionStorage.removeItem('carrito');
        }, 1000);
    }
}

// Conectar el formulario al enviar
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formPedidos');
    if (formulario) {
        formulario.addEventListener('submit', enviarAGmail);
        console.log('✅ Formulario conectado para envío a Gmail');
    }
});

// Hacer las funciones globales
window.vaciarCarrito = vaciarCarrito;
window.obtenerDatosCarrito = obtenerDatosCarrito;
window.mostrarResumenCarrito = mostrarResumenCarrito;

console.log('✅ formulariops2.js cargado - ENVÍO A GMAIL CONFIGURADO');


