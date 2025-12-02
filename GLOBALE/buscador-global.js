// buscador-global.js
class BuscadorGlobal {
    constructor() {
        this.buscador = null;
        this.resultadosDiv = null;
        this.terminoBusqueda = '';
        this.inicializado = false;
        
        // Base de datos global de productos (puedes expandirla)
        this.productosGlobales = [
            // PlayStation 2
            { texto: "Pendrive con 4 juegos para PS2", url: "/PLAYSTATION%202/playstation%202.html", consola: "PS2" },
            { texto: "Pendrive con 8 juegos para PS2", url: "/PLAYSTATION%202/playstation%202.html", consola: "PS2" },
            { texto: "Pendrive con 14 juegos para PS2", url: "/PLAYSTATION%202/playstation%202.html", consola: "PS2" },
            { texto: "Pendrive con 20 juegos para PS2", url: "/PLAYSTATION%202/playstation%202.html", consola: "PS2" },
            
            // PlayStation 3
            { texto: "Juego PS3 - The Last of Us", url: "/PLAYSTATION%203/playstation%203_1.html", consola: "PS3" },
            { texto: "Juego PS3 - God of War III", url: "/PLAYSTATION%203/playstation%203_1.html", consola: "PS3" },
            { texto: "Juego PS3 - Uncharted 3", url: "/PLAYSTATION%203/playstation%203_1.html", consola: "PS3" },
            
            // PlayStation 4/5
            { texto: "Juego PS4 - Spider-Man", url: "/PLAYSTATION%204-5/playstation4_1.html", consola: "PS4/5" },
            { texto: "Juego PS4 - God of War", url: "/PLAYSTATION%204-5/playstation4_1.html", consola: "PS4/5" },
            { texto: "Juego PS5 - Demon's Souls", url: "/PLAYSTATION%204-5/playstation4_1.html", consola: "PS4/5" }
            // Agrega aquí todos tus productos manualmente
        ];
    }

    inicializar() {
        if (this.inicializado) return;
        
        this.buscador = document.getElementById('buscador-real-time');
        this.resultadosDiv = document.getElementById('resultados-real-time');
        
        if (!this.buscador || !this.resultadosDiv) {
            console.log('Buscador no encontrado en esta página');
            return;
        }

        this.cargarBusquedaAnterior();
        this.configurarEventos();
        this.inicializado = true;
    }

    cargarBusquedaAnterior() {
        const busquedaGuardada = localStorage.getItem('ultimaBusqueda');
        if (busquedaGuardada) {
            this.buscador.value = busquedaGuardada;
            if (busquedaGuardada.length >= 2) {
                this.ejecutarBusqueda(busquedaGuardada);
            }
        }
    }

    configurarEventos() {
        this.buscador.addEventListener('input', (e) => {
            this.terminoBusqueda = e.target.value.toLowerCase().trim();
            this.resultadosDiv.innerHTML = '';
            
            localStorage.setItem('ultimaBusqueda', this.terminoBusqueda);
            
            if (this.terminoBusqueda.length < 2) return;
            this.ejecutarBusqueda(this.terminoBusqueda);
        });
        
        document.addEventListener('click', (e) => {
            if (!this.buscador.contains(e.target) && !this.resultadosDiv.contains(e.target)) {
                this.resultadosDiv.innerHTML = '';
            }
        });

        this.buscador.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.resultadosDiv.innerHTML = '';
                this.buscador.blur();
            }
        });
    }

    // BÚSQUEDA GLOBAL - Busca en productos globales + página actual
    ejecutarBusqueda(termino) {
        // Buscar en productos globales
        const resultadosGlobales = this.buscarEnProductosGlobales(termino);
        
        // Buscar en página actual
        const resultadosLocales = this.buscarEnPaginaActual(termino);
        
        // Combinar resultados
        const todosLosResultados = [...resultadosLocales, ...resultadosGlobales];
        
        this.mostrarResultados(todosLosResultados);
    }

    buscarEnProductosGlobales(termino) {
        return this.productosGlobales.filter(producto => 
            producto.texto.toLowerCase().includes(termino)
        ).map(producto => ({
            texto: producto.texto,
            elemento: null,
            esLocal: false,
            url: producto.url,
            consola: producto.consola
        }));
    }

    buscarEnPaginaActual(termino) {
        const todosLosH4 = document.querySelectorAll('h4');
        const resultados = [];
        
        todosLosH4.forEach(h4 => {
            const textoH4 = h4.textContent.toLowerCase();
            if (textoH4.includes(termino)) {
                resultados.push({
                    texto: h4.textContent,
                    elemento: h4,
                    esLocal: true
                });
            }
        });
        
        return resultados;
    }

    mostrarResultados(resultados) {
        if (resultados.length === 0) {
            this.resultadosDiv.innerHTML = '<div class="no-resultados">No se encontraron productos</div>';
            return;
        }
        
        const resultadosLimitados = resultados.slice(0, 8);
        
        const html = resultadosLimitados.map((resultado) => {
            const imagen = resultado.esLocal ? 
                this.encontrarImagenDelJuego(resultado.elemento) : 
                'https://via.placeholder.com/50x65/333/fff?text=🎮';

            const accion = resultado.esLocal ?
                `buscadorGlobal.seleccionarJuego('${resultado.texto.replace(/'/g, "\\'")}')` :
                `buscadorGlobal.irAPagina('${resultado.url}', '${resultado.texto.replace(/'/g, "\\'")}')`;

            const infoConsola = resultado.consola ? 
                `<div style="font-size: 10px; color: #666;">${resultado.consola} - Click para ir</div>` : 
                '';

            return `
                <div class="sugerencia" onclick="${accion}">
                    <div class="resultado-con-imagen">
                        <img src="${imagen}" alt="${resultado.texto}" class="imagen-resultado" onerror="this.src='https://via.placeholder.com/50x65/333/fff?text=🎮'">
                        <div class="info-resultado">
                            <div class="titulo-resultado">${this.resaltarCoincidencia(resultado.texto, this.terminoBusqueda)}</div>
                            ${infoConsola}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.resultadosDiv.innerHTML = html;
    }

    encontrarImagenDelJuego(elementoH4) {
        const contenedorJuego = elementoH4.closest('.juego, .game, .card, .item, article, section, div');
        if (contenedorJuego) {
            const imagen = contenedorJuego.querySelector('img');
            if (imagen && imagen.src) return imagen.src;
        }
        
        let siguienteElemento = elementoH4.nextElementSibling;
        while (siguienteElemento) {
            if (siguienteElemento.tagName === 'IMG') {
                return siguienteElemento.src;
            }
            siguienteElemento = siguienteElemento.nextElementSibling;
        }
        
        const imagenEnPadre = elementoH4.parentElement.querySelector('img');
        if (imagenEnPadre) return imagenEnPadre.src;
        
        return 'https://via.placeholder.com/50x65/333/fff?text=🎮';
    }

    seleccionarJuego(titulo) {
        this.buscador.value = titulo;
        this.resultadosDiv.innerHTML = '';
        localStorage.setItem('ultimaBusqueda', titulo);
        this.irAlJuegoEspecifico(titulo);
    }

    irAPagina(url, titulo) {
        localStorage.setItem('juegoBuscado', titulo);
        localStorage.setItem('ultimaBusqueda', titulo);
        window.location.href = url;
    }

    irAlJuegoEspecifico(titulo) {
        const todosLosH4 = document.querySelectorAll('h4');
        let elementoH4 = null;
        
        todosLosH4.forEach(h4 => {
            if (h4.textContent === titulo) {
                elementoH4 = h4;
            }
        });
        
        if (elementoH4) {
            document.querySelectorAll('.h4-resaltado').forEach(el => {
                el.classList.remove('h4-resaltado');
            });
            
            elementoH4.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            elementoH4.classList.add('h4-resaltado');
            
            setTimeout(() => {
                elementoH4.classList.remove('h4-resaltado');
            }, 3000);
        }
    }

    resaltarCoincidencia(texto, termino) {
        if (!termino) return texto;
        
        const regex = new RegExp(`(${termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return texto.replace(regex, '<span style="background-color: #ffeb3b; font-weight: bold;">$1</span>');
    }

    limpiarBusqueda() {
        this.buscador.value = '';
        this.resultadosDiv.innerHTML = '';
        localStorage.removeItem('ultimaBusqueda');
    }
}

// Crear instancia global
const buscadorGlobal = new BuscadorGlobal();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    buscadorGlobal.inicializar();
    
    // Buscar juego si venimos de otra página
    const juegoBuscado = localStorage.getItem('juegoBuscado');
    if (juegoBuscado) {
        setTimeout(() => {
            buscadorGlobal.irAlJuegoEspecifico(juegoBuscado);
            localStorage.removeItem('juegoBuscado');
        }, 1000);
    }
});