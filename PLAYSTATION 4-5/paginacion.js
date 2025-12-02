document.addEventListener('DOMContentLoaded', function() {
    const botonesPagina = document.querySelectorAll('.boton-pagina');
    const botonSiguiente = document.querySelector('.boton-siguiente');
    
    // Guardar la página actual al hacer clic en botones numéricos
    botonesPagina.forEach(boton => {
        boton.addEventListener('click', function() {
            sessionStorage.setItem('paginaActiva', this.textContent);
            window.location.href = `playstation4_${this.textContent}.html`;
        });
    });
    
    // Lógica del botón Siguiente
    if (botonSiguiente) {
        botonSiguiente.addEventListener('click', function() {
            const paginaActiva = sessionStorage.getItem('paginaActiva') || '1';
            const paginaActual = parseInt(paginaActiva);
            const siguientePagina = paginaActual + 1;
            const totalPaginas = 5; // Cambia este número según tus páginas totales
            
            console.log('Página actual:', paginaActual);
            console.log('Siguiente página:', siguientePagina);
            
            if (siguientePagina <= totalPaginas) {
                sessionStorage.setItem('paginaActiva', siguientePagina.toString());
                window.location.href = `playstation4_${siguientePagina}.html`;
            } else {
                console.log('No hay más páginas disponibles');
                // Opcional: puedes agregar un efecto visual
                this.style.opacity = '0.6';
                this.style.cursor = 'not-allowed';
            }
        });
    }
    
    // Recuperar y activar la página guardada
    const paginaActiva = sessionStorage.getItem('paginaActiva') || '1';
    
    botonesPagina.forEach(boton => {
        if (boton.textContent === paginaActiva) {
            boton.classList.add('activo');
        }
    });
});