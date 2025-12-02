// ===== CARRITO PS3 - DEBE SER EL ÚLTIMO SCRIPT =====

// Nuclear: Remover TODOS los event listeners existentes y reemplazar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 PS3 - Tomando control total del botón');
    
    const btn = document.querySelector('.btn-ver-carrito-completo');
    if (btn) {
        // 1. Reemplazar completamente el botón para eliminar todos los listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // 2. Cambiar el onclick DIRECTAMENTE
        newBtn.setAttribute('onclick', "window.location.href='/PEDIDOS/pedidosps3.html'; return false;");
        
        // 3. Agregar event listener con CAPTURE phase
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('🔴 PS3 - Redirección forzada');
            window.location.href = '/PEDIDOS/pedidosps3.html';
        }, true);
        
        console.log('✅ Botón PS3 configurado');
    }
});

// Sobreescribir la función global POR SI ACASO
window.irAlCarrito = function() {
    console.log('🔴 PS3 - Función global redirigiendo');
    window.location.href = '/PEDIDOS/pedidosps3.html';
    return false;
};

console.log('✅ carrito-ps3.js - ÚLTIMO SCRIPT CARGADO');