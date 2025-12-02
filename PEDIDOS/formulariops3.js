// Variable global para el carrito
let carrito = [];

// Función para obtener los datos del CARRITO
function obtenerDatosCarrito() {
    const carritoGuardado = sessionStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// FUNCIÓN VACIAR CARRITO
function vaciarCarrito() {
    sessionStorage.removeItem('carrito');
    carrito = [];
    mostrarResumenCarrito([]);
    actualizarMontoTransferencia('0 Gs');
    
    const tituloElement = document.getElementById('nombreJuego');
    if (tituloElement) {
        tituloElement.textContent = 'Carrito vacío';
    }
    
    alert('✅ Carrito vaciado correctamente');
}

// FUNCIÓN para formatear números
function formatearNumeroConCeros(numero) {
    if (numero === 0) return '0';
    if (Number.isInteger(numero) && numero < 1000) {
        return numero + '.000';
    }
    let numeroString = numero.toString();
    if (!numeroString.includes('.') && numero < 1000000) {
        const partes = numeroString.split('.');
        const parteEntera = partes[0];
        if (parseInt(parteEntera) < 1000) {
            return numero + '.000';
        }
    }
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// FUNCIÓN para calcular precios
function calcularPrecios(item) {
    let precioString = item.precio ? item.precio.toString() : '0';
    precioString = precioString
        .replace(/\s?Gs\s?/g, '')
        .replace(/\$/g, '')
        .replace(/\./g, '')
        .trim();
    
    const precioNumerico = parseFloat(precioString) || 0;
    const subtotalNumerico = precioNumerico * item.cantidad;
    
    const precioMostrar = formatearNumeroConCeros(precioNumerico) + ' Gs';
    const subtotalMostrar = formatearNumeroConCeros(subtotalNumerico) + ' Gs';
    
    return {
        precioMostrar: precioMostrar,
        subtotalMostrar: subtotalMostrar
    };
}

// Función para mostrar el resumen del carrito
function mostrarResumenCarrito(carrito) {
    const tituloElement = document.getElementById('nombreJuego');
    const contenedorResumen = document.getElementById('resumen-carrito');
    
    if (!carrito || carrito.length === 0) {
        if (tituloElement) {
            tituloElement.textContent = 'Carrito vacío';
        }
        if (contenedorResumen) {
            contenedorResumen.innerHTML = `
                <div class="resumen-pedido">
                    <p class="carrito-vacio">No hay juegos en el carrito</p>
                    <button type="button" class="btn-vaciar-carrito" onclick="vaciarCarrito()" style="opacity: 0.6; cursor: not-allowed;" disabled>
                        🗑️ Vaciar Carrito (carrito vacío)
                    </button>
                </div>
            `;
        }
        return;
    }
    
    const totalJuegos = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    if (tituloElement) {
        tituloElement.textContent = `Pedido de ${totalJuegos} juego(s)`;
    }
    
    let htmlResumen = '<div class="resumen-pedido">';
    htmlResumen += '<h4>📋 Detalles de tu pedido:</h4>';
    htmlResumen += '<div class="lista-juegos">';
    
    carrito.forEach((item, index) => {
        const precios = calcularPrecios(item);
        htmlResumen += `
            <div class="item-resumen">
                <div class="info-juego-item">
                    <span class="nombre-juego">${item.nombre || 'Juego sin nombre'}</span>
                    <span class="precio-juego">${precios.precioMostrar} x ${item.cantidad}</span>
                </div>
                <div class="subtotal-juego">Subtotal: ${precios.subtotalMostrar}</div>
            </div>
        `;
    });
    
    const total = calcularTotalCarrito(carrito);
    const totalMostrar = formatearNumeroConCeros(total) + ' Gs';
    
    htmlResumen += `
        </div>
        <hr>
        <div class="total-pedido">
            <strong>💰 Total a pagar: ${totalMostrar}</strong>
        </div>
        <button type="button" class="btn-vaciar-carrito" onclick="vaciarCarrito()" id="btnVaciarCarrito">
            🗑️ Vaciar Carrito
        </button>
    </div>`;
    
    if (contenedorResumen) {
        contenedorResumen.innerHTML = htmlResumen;
    }
}

// FUNCIÓN para calcular total del carrito
function calcularTotalCarrito(carrito) {
    let total = 0;
    carrito.forEach(item => {
        let precioString = item.precio ? item.precio.toString() : '0';
        precioString = precioString
            .replace(/\s?Gs\s?/g, '')
            .replace(/\$/g, '')
            .replace(/\./g, '')
            .trim();
        const precioNumerico = parseFloat(precioString) || 0;
        const subtotal = precioNumerico * item.cantidad;
        total += subtotal;
    });
    return total;
}

// FUNCIÓN SIMPLE PARA ENVIAR A GMAIL
// FUNCIÓN SIMPLE PARA ENVIAR A GMAIL
function enviarAGmail(event) {
    event.preventDefault();
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;
    
    // Validar campos obligatorios
    if (!nombre || !apellido || !telefono || !email) {
        alert('❌ Por favor, completa todos los campos obligatorios: Nombre, Apellido, Teléfono y Email');
        return;
    }
    
    // Obtener carrito
    const carrito = obtenerDatosCarrito();
    
    // Validar que el carrito no esté vacío
    if (carrito.length === 0) {
        alert('❌ El carrito está vacío. Agrega al menos un juego antes de enviar el pedido.');
        return;
    }
    
    const total = calcularTotalCarrito(carrito);
    const totalFormateado = formatearNumeroConCeros(total) + ' Gs';
    
    // Crear mensaje para Gmail
    let cuerpoMensaje = `NUEVO PEDIDO - BETALAB GAMES PY\n\n`;
    cuerpoMensaje += `INFORMACIÓN DEL CLIENTE:\n`;
    cuerpoMensaje += `Nombre: ${nombre} ${apellido}\n`;
    cuerpoMensaje += `Email: ${email}\n`;
    cuerpoMensaje += `Teléfono: ${telefono}\n`;
    cuerpoMensaje += `Mensaje: ${mensaje || 'No especificado'}\n\n`;
    
    cuerpoMensaje += `DETALLES DEL PEDIDO:\n`;
    carrito.forEach((item, index) => {
        const precios = calcularPrecios(item);
        cuerpoMensaje += `${index + 1}. ${item.nombre}\n`;
        cuerpoMensaje += `   Cantidad: ${item.cantidad} x ${precios.precioMostrar}\n`;
        cuerpoMensaje += `   Subtotal: ${precios.subtotalMostrar}\n\n`;
    });
    
    cuerpoMensaje += `TOTAL: ${totalFormateado}\n\n`;
    cuerpoMensaje += `Fecha: ${new Date().toLocaleString('es-PY')}\n\n`;
    cuerpoMensaje += `📎 IMPORTANTE: Recuerde que debe acercar la consola al local para la instalación de los juegos.`;

    // Enviar por Gmail
    const emailDestino = 'betalabgamespedidos@gmail.com';
    const asunto = `🎮 PEDIDO - ${nombre} ${apellido}`;
    const mailtoLink = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpoMensaje)}`;
    
    // MOSTRAR ALERT ORIGINAL - no modal personalizado
    alert(`📧 SE ABRIRÁ GMAIL\n\n📎 INSTRUCCIONES IMPORTANTES:\n\n1. Se abrirá Gmail automáticamente\n2. Revisa que todos los datos estén correctos\n3. Presiona ENVIAR para completar tu pedido\n\n✅ Te estaremos contactando en el transcurso del día`);
    
    // Abrir cliente de correo
    window.location.href = mailtoLink;
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Obtener carrito
    carrito = obtenerDatosCarrito();
    
    // Mostrar resumen
    mostrarResumenCarrito(carrito);
    
    // Actualizar monto
    const total = calcularTotalCarrito(carrito);
    actualizarMontoTransferencia(formatearNumeroConCeros(total) + ' Gs');
    
    // Agregar event listener al formulario
    const formulario = document.getElementById('formPedidos');
    if (formulario) {
        formulario.addEventListener('submit', enviarAGmail);
    }
});

function actualizarMontoTransferencia(precio) {
    const montoValor = document.getElementById('monto-valor');
    if (montoValor) {
        montoValor.textContent = precio;
    }
}

// Hacer funciones globales
window.vaciarCarrito = vaciarCarrito;
window.enviarAGmail = enviarAGmail;


