// juegosps4.js - VERSIÓN CON PAGINACIÓN DINÁMICA
class TiendaPS4 {
    constructor() {
        this.juegos = [];
        this.juegosPorPagina = 8;
        this.paginaActual = 1;
        this.init();
    }

    async init() {
        await this.cargarJuegos();
        this.mostrarJuegos();
        this.configurarPaginacion();
    }

    async cargarJuegos() {
        try {
            console.log('🔄 Cargando juegos PS4/PS5...');
            const response = await fetch('../JUEGOS/juegosps4.json');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ JSON cargado correctamente');
            
            // CAMBIO IMPORTANTE: de 'jeugosps4' a 'juegosps4'
            if (!data.juegosps4) {
                throw new Error('No se encontró el array "juegosps4" en el JSON');
            }
            
            this.juegos = data.juegosps4;
            console.log(`🎮 Se cargaron ${this.juegos.length} juegos PS4/PS5`);
            
        } catch (error) {
            console.error('❌ Error cargando juegos:', error);
            this.mostrarError('Error cargando los juegos: ' + error.message);
        }
    }

    mostrarJuegos() {
        const container = document.getElementById('juegos-ps4-container');
        
        if (!container) {
            console.error('❌ No se encontró el contenedor "juegos-ps4-container"');
            return;
        }

        if (this.juegos.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: white; padding: 20px;">No hay juegos disponibles</p>';
            return;
        }

        const inicio = (this.paginaActual - 1) * this.juegosPorPagina;
        const fin = inicio + this.juegosPorPagina;
        const juegosPagina = this.juegos.slice(inicio, fin);

        container.innerHTML = this.crearGridJuegos(juegosPagina);
    }

    crearGridJuegos(juegos) {
        let html = '';
        
        for (let i = 0; i < juegos.length; i += 2) {
            html += `<section class="seccion-juegos">`;
            
            if (juegos[i]) {
                html += this.crearArticuloJuego(juegos[i]);
            }
            
            if (juegos[i + 1]) {
                html += this.crearArticuloJuego(juegos[i + 1]);
            }
            
            html += `</section>`;
        }
        
        return html;
    }

    crearArticuloJuego(juego) {
        // CAMBIO: usar 'juego.nombre' (minúscula) en lugar de 'juego.Nombre'
        return `
            <article class="juegos">
                <h4 class="titulo-juego">${juego.nombre}</h4>
                <img class="juego" src="${juego.imagen}" alt="${juego.nombre}" 
                     onerror="this.src='https://via.placeholder.com/150x190/9b59b6/white?text=Imagen+No+Disponible'">
                <h5 class="precio-act">${juego.precio} Gs</h5>
                <button type="button" class="btn-compra" onclick="tiendaPS4.añadirAlCarrito(${juego.id})">
                    Añadir al carrito
                </button>
            </article>
        `;
    }

    añadirAlCarrito(id) {
        const juego = this.juegos.find(j => j.id === id);
        if (juego) {
            if (typeof añadirAlCarrito === 'function') {
                // CAMBIO: usar 'juego.nombre' (minúscula)
                añadirAlCarrito(juego.nombre);
            } else {
                // CAMBIO: usar 'juego.nombre' (minúscula)
                const mensaje = `¡Hola! Quiero comprar PS4/PS5: ${juego.nombre}%0APrecio: ${juego.precio} Gs`;
                window.open(`https://wa.me/TUNUMERO?text=${mensaje}`, '_blank');
            }
        }
    }

    configurarPaginacion() {
        const totalPaginas = Math.ceil(this.juegos.length / this.juegosPorPagina);
        
        // Usar paginación dinámica si está disponible
        if (typeof window.configurarPaginacionDinamica === 'function') {
            window.configurarPaginacionDinamica(totalPaginas, this.paginaActual);
        } else {
            console.warn('La función de paginación dinámica no está disponible');
            this.configurarPaginacionBasica(totalPaginas);
        }
    }

    cambiarPagina(nuevaPagina) {
        this.paginaActual = nuevaPagina;
        this.mostrarJuegos();
        this.configurarPaginacion();
        
        // Scroll suave hacia arriba
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    configurarPaginacionBasica(totalPaginas) {
        // Método de respaldo básico
        const contenedorPaginacion = document.querySelector('.paginacion');
        if (!contenedorPaginacion) return;

        contenedorPaginacion.innerHTML = '';

        // Botón Anterior
        if (this.paginaActual > 1) {
            const botonAnterior = document.createElement('button');
            botonAnterior.type = 'button';
            botonAnterior.className = 'boton-anterior';
            botonAnterior.textContent = '← Anterior';
            botonAnterior.addEventListener('click', () => {
                this.cambiarPagina(this.paginaActual - 1);
            });
            contenedorPaginacion.appendChild(botonAnterior);
        }

        // Botones de páginas
        for (let i = 1; i <= totalPaginas; i++) {
            const botonPagina = document.createElement('button');
            botonPagina.type = 'button';
            botonPagina.className = 'boton-pagina';
            if (i === this.paginaActual) {
                botonPagina.classList.add('activo');
            }
            botonPagina.textContent = i;
            botonPagina.addEventListener('click', () => {
                this.cambiarPagina(i);
            });
            contenedorPaginacion.appendChild(botonPagina);
        }

        // Botón Siguiente
        if (this.paginaActual < totalPaginas) {
            const botonSiguiente = document.createElement('button');
            botonSiguiente.type = 'button';
            botonSiguiente.className = 'boton-siguiente';
            botonSiguiente.textContent = 'Siguiente →';
            botonSiguiente.addEventListener('click', () => {
                this.cambiarPagina(this.paginaActual + 1);
            });
            contenedorPaginacion.appendChild(botonSiguiente);
        }
    }

    mostrarError(mensaje) {
        const container = document.getElementById('juegos-ps4-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #e74c3c;">
                    <p>${mensaje}</p>
                    <p>Por favor, recarga la página.</p>
                </div>
            `;
        }
    }
}

// Inicializar la tienda cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando TiendaPS4...');
    window.tiendaPS4 = new TiendaPS4();

});


