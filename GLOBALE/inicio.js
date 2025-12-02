// inicio.js - VERSIÓN CORREGIDA
class CargadorInicio {
    constructor() {
        this.juegosPorConsola = 6;
        this.init();
    }

    async init() {
        await this.cargarPS2();
        await this.cargarPS3();
        await this.cargarPS4();
        await this.cargarOfertas();
    }

    async cargarPS2() {
        try {
            const response = await fetch('/JUEGOS/juegosps2.json');
            const data = await response.json();
            
            // PS2 usa "jeugosps2" (con typo)
            if (data.jeugosps2) {
                this.mostrarJuegos('juegos-ps2-container', data.jeugosps2.slice(0, 6), 'ps2');
            } else if (data.juegosps2) { // Por si acaso
                this.mostrarJuegos('juegos-ps2-container', data.juegosps2.slice(0, 6), 'ps2');
            }
        } catch (error) {
            console.error('Error cargando PS2:', error);
            this.mostrarError('juegos-ps2-container', 'PS2');
        }
    }

    async cargarPS3() {
        try {
            const response = await fetch('/JUEGOS/juegosps3.json');
            const data = await response.json();
            
            // PS3 usa "jeugosps3" (con typo)
            if (data.jeugosps3) {
                this.mostrarJuegos('juegos-ps3-container', data.jeugosps3.slice(0, 6), 'ps3');
            } else if (data.juegosps3) { // Por si acaso
                this.mostrarJuegos('juegos-ps3-container', data.juegosps3.slice(0, 6), 'ps3');
            }
        } catch (error) {
            console.error('Error cargando PS3:', error);
            this.mostrarError('juegos-ps3-container', 'PS3');
        }
    }

    async cargarPS4() {
        try {
            console.log('🔄 Cargando PS4 para inicio...');
            const response = await fetch('/JUEGOS/juegosps4.json');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ JSON PS4 cargado:', data);
            
            // ¡IMPORTANTE! Tu JSON usa "juegosps4" (SIN typo)
            // Pero tu código busca "jeugosps4" (CON typo)
            
            if (data.juegosps4) {
                console.log('✅ Encontrado "juegosps4":', data.juegosps4.length, 'juegos');
                this.mostrarJuegos('juegos-ps4-container', data.juegosps4.slice(0, 6), 'ps4');
            } else if (data.jeugosps4) {
                console.log('✅ Encontrado "jeugosps4" (con typo):', data.jeugosps4.length, 'juegos');
                this.mostrarJuegos('juegos-ps4-container', data.jeugosps4.slice(0, 6), 'ps4');
            } else {
                console.error('❌ No se encontró "juegosps4" ni "jeugosps4" en JSON');
                console.log('Propiedades disponibles:', Object.keys(data));
                this.mostrarError('juegos-ps4-container', 'PS4/PS5');
            }
            
        } catch (error) {
            console.error('❌ Error cargando PS4:', error);
            this.mostrarError('juegos-ps4-container', 'PS4/PS5');
        }
    }

    async cargarOfertas() {
        try {
            console.log('🔄 Cargando ofertas...');
            
            const [ps2Response, ps3Response, ps4Response] = await Promise.all([
                fetch('/JUEGOS/juegosps2.json'),
                fetch('/JUEGOS/juegosps3.json'),
                fetch('/JUEGOS/juegosps4.json')
            ]);
            
            const ps2 = await ps2Response.json();
            const ps3 = await ps3Response.json();
            const ps4 = await ps4Response.json();
            
            // Usar las propiedades correctas para cada JSON
            const juegosPS2 = ps2.jeugosps2 || ps2.juegosps2 || [];
            const juegosPS3 = ps3.jeugosps3 || ps3.juegosps3 || [];
            const juegosPS4 = ps4.juegosps4 || ps4.jeugosps4 || [];
            
            console.log(`📊 Juegos cargados: PS2=${juegosPS2.length}, PS3=${juegosPS3.length}, PS4=${juegosPS4.length}`);
            
            const todosJuegos = [...juegosPS2, ...juegosPS3, ...juegosPS4];
            
            if (todosJuegos.length === 0) {
                console.log('❌ No hay juegos para mostrar ofertas');
                this.mostrarError('juegos-ofertas-container', 'ofertas');
                return;
            }
            
            const juegosAleatorios = this.obtenerAleatorios(todosJuegos, Math.min(6, todosJuegos.length));
            
            console.log('✅ Ofertas seleccionadas:', juegosAleatorios.length);
            
            const ofertas = juegosAleatorios.map(juego => ({
                ...juego,
                precioOriginal: juego.precio,
                precio: this.aplicarDescuento(juego.precio)
            }));
            
            this.mostrarOfertas('juegos-ofertas-container', ofertas);
            
        } catch (error) {
            console.error('❌ Error cargando ofertas:', error);
            this.mostrarError('juegos-ofertas-container', 'ofertas');
        }
    }

    mostrarJuegos(containerId, juegos, tipoConsola) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`❌ No se encontró el contenedor: ${containerId}`);
            return;
        }

        if (!juegos || juegos.length === 0) {
            container.innerHTML = '<p class="sin-juegos">Próximamente...</p>';
            console.log(`⚠️ No hay juegos para ${containerId}`);
            return;
        }

        console.log(`✅ Mostrando ${juegos.length} juegos en ${containerId}`);
        container.innerHTML = this.crearHTMLJuegos(juegos, tipoConsola);
    }

    mostrarOfertas(containerId, ofertas) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (ofertas.length === 0) {
            container.innerHTML = '<p class="sin-juegos">No hay ofertas disponibles</p>';
            return;
        }

        container.innerHTML = this.crearHTMLOfertas(ofertas);
    }

    // VERSIÓN SIN BOTÓN
    crearHTMLJuegos(juegos, tipoConsola) {
        let html = '';
        
        juegos.forEach(juego => {
            // IMPORTANTE: Tu JSON PS4 usa "nombre" (minúscula), no "Nombre"
            const nombreJuego = juego.nombre || juego.Nombre || 'Juego sin nombre';
            const precioJuego = juego.precio || 'Consultar precio';
            
            // EN EL INICIO: NO MOSTRAR BOTÓN
            html += `
                <article class="juegos inicio-card" onclick="redirigirDesdeInicio('${tipoConsola}', '${nombreJuego}', '${precioJuego}')">
                    <h4 class="titulo-juego">${nombreJuego}</h4>
                    <img class="juego" src="${juego.imagen}" alt="${nombreJuego}" 
                         onerror="this.src='https://via.placeholder.com/150x190/333/fff?text=${tipoConsola.toUpperCase()}'">
                    <h5 class="precio-act">${precioJuego}</h5>
                </article>
            `;
        });
        
        return html;
    }

    crearHTMLOfertas(ofertas) {
        let html = '';
        
        ofertas.forEach(juego => {
            const nombreJuego = juego.nombre || juego.Nombre || 'Juego sin nombre';
            const precioOriginal = juego.precioOriginal || juego.precio;
            const precioConDescuento = juego.precio || precioOriginal;
            
            const descuento = Math.round(((parseFloat(precioOriginal.replace(/[^\d]/g, '')) - 
                                          parseFloat(precioConDescuento.replace(/[^\d]/g, ''))) / 
                                          parseFloat(precioOriginal.replace(/[^\d]/g, ''))) * 100);
            
            html += `
                <article class="juegos oferta-especial inicio-card" onclick="redirigirDesdeInicio('oferta', '${nombreJuego}', '${precioConDescuento}')">
                    <div class="badge-oferta">-${descuento}%</div>
                    <h4 class="titulo-juego">${nombreJuego}</h4>
                    <img class="juego" src="${juego.imagen}" alt="${nombreJuego}" 
                        onerror="this.src='https://via.placeholder.com/150x190/e74c3c/fff?text=OFERTA'">
                    <h5 class="precio-act">${precioConDescuento} Gs</h5>
                    <div class="precio-anterior">${precioOriginal} Gs</div>
                </article>
            `;
        });
        
        return html;
    }

    aplicarDescuento(precioStr) {
        const numero = parseFloat(precioStr.replace(/[^\d]/g, ''));
        if (isNaN(numero)) return precioStr;
        
        const conDescuento = numero * 0.8;
        return `${conDescuento.toLocaleString('es-PY')} Gs`;
    }

    obtenerAleatorios(array, cantidad) {
        const mezclado = [...array].sort(() => 0.5 - Math.random());
        return mezclado.slice(0, Math.min(cantidad, array.length));
    }

    mostrarError(containerId, consola) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-carga">
                    <p>Error cargando juegos de ${consola}</p>
                    <p>Intenta recargar la página</p>
                </div>
            `;
        }
    }
}

// FUNCIÓN PARA REDIRIGIR DESDE EL INICIO
function redirigirDesdeInicio(tipoConsola, nombreJuego, precio) {
    console.log('📍 Redirigiendo desde inicio:', { tipoConsola, nombreJuego, precio });
    
    let formularioDestino = '/PEDIDOS/pedidos.html';
    
    switch(tipoConsola) {
        case 'ps2':
            formularioDestino = '/PEDIDOS/pedidosps2.html';
            break;
        case 'ps3':
            formularioDestino = '/PEDIDOS/pedidosps3.html';
            break;
        case 'ps4':
        case 'ps5':
        case 'oferta':
            formularioDestino = '/PEDIDOS/pedidosps4.html';
            break;
    }
    
    // Pasar parámetros por URL
    const params = new URLSearchParams({
        juego: nombreJuego,
        precio: precio,
        consola: tipoConsola,
        desde: 'inicio'
    });
    
    console.log('🎯 Redirigiendo a:', formularioDestino);
    window.location.href = `${formularioDestino}?${params.toString()}`;
}

// Función global para iniciar la carga
function cargarJuegosInicio() {
    console.log('🚀 Iniciando carga de juegos para inicio...');
    window.cargadorInicio = new CargadorInicio();
}