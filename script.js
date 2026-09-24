document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       USUARIO
    ===================================================== */
    const usuarioMenu = document.getElementById("usuarioMenu");
    const nombreMenu = document.getElementById("nombreMenu");
    const fotoMenu = document.getElementById("fotoMenu");

    const nombrePerfil = document.getElementById("nombrePerfil");
    const correoPerfil = document.getElementById("correoPerfil");
    const fotoPerfil = document.getElementById("fotoPerfil");

    const inputFoto = document.getElementById("inputFoto");
    const cambiarFoto = document.getElementById("cambiarFoto");

    /* =====================================================
       OBTENER USUARIO
    ===================================================== */
    function obtenerUsuario() {
        const claves = [
            "usuarioActual",
            "usuarioActivo",
            "usuario",
            "usuarioRegistrado"
        ];

        for (const clave of claves) {
            const dato = localStorage.getItem(clave);
            if (!dato) continue;

            try {
                const usuario = JSON.parse(dato);
                if (usuario && typeof usuario === "object") {
                    return usuario;
                }
            } catch (error) {
                return { nombre: dato };
            }
        }
        return null;
    }

    const usuario = obtenerUsuario();

    /* =====================================================
       DATOS DEL USUARIO
    ===================================================== */
    if (usuario) {
        const nombre =
            usuario.nombre ||
            usuario.nombreUsuario ||
            usuario.usuario ||
            usuario.name ||
            "Usuario";

        const correo =
            usuario.correo ||
            usuario.email ||
            usuario.correoElectronico ||
            "";

        const foto =
            usuario.foto ||
            usuario.imagen ||
            usuario.photo ||
            localStorage.getItem("fotoPerfil") ||
            "img/perfil.png";

        if (nombrePerfil) nombrePerfil.textContent = nombre;
        if (correoPerfil) correoPerfil.textContent = correo;
        if (fotoPerfil) fotoPerfil.src = foto;

        if (usuarioMenu) usuarioMenu.style.display = "flex";
        if (nombreMenu) nombreMenu.textContent = nombre;

        if (fotoMenu) {
            fotoMenu.src = foto;
            fotoMenu.style.display = "block";
            fotoMenu.onerror = function () {
                fotoMenu.src = "img/perfil.png";
            };
        }
    }

    /* =====================================================
       CAMBIAR FOTO DE PERFIL
    ===================================================== */
    if (cambiarFoto && inputFoto) {
        cambiarFoto.addEventListener("click", function () {
            inputFoto.click();
        });

        inputFoto.addEventListener("change", function () {
            const archivo = inputFoto.files[0];
            if (!archivo) return;

            if (!archivo.type.startsWith("image/")) {
                alert("Por favor selecciona una imagen.");
                return;
            }

            const lector = new FileReader();
            lector.onload = function (evento) {
                const nuevaFoto = evento.target.result;

                if (fotoPerfil) fotoPerfil.src = nuevaFoto;
                if (fotoMenu) {
                    fotoMenu.src = nuevaFoto;
                    fotoMenu.style.display = "block";
                }

                localStorage.setItem("fotoPerfil", nuevaFoto);

                const usuarioActual = obtenerUsuario();
                if (usuarioActual) {
                    usuarioActual.foto = nuevaFoto;
                    localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
                }
            };
            lector.readAsDataURL(archivo);
        });
    }

    /* =====================================================
       AJUSTES
    ===================================================== */
    const botonAjustes = document.getElementById("botonAjustes");
    const menuAjustes = document.getElementById("menuAjustes");

    if (botonAjustes && menuAjustes) {
        botonAjustes.addEventListener("click", function (event) {
            event.stopPropagation();
            menuAjustes.classList.toggle("mostrar");
        });

        document.addEventListener("click", function (event) {
            if (!menuAjustes.contains(event.target) && event.target !== botonAjustes) {
                menuAjustes.classList.remove("mostrar");
            }
        });
    }

    /* =====================================================
       RECOMENDACIONES
    ===================================================== */
    const botonRecomendaciones = document.getElementById("botonRecomendaciones");
    const ventanaRecomendaciones = document.getElementById("ventanaRecomendaciones");
    const cerrarRecomendaciones = document.getElementById("cerrarRecomendaciones");

    if (botonRecomendaciones && ventanaRecomendaciones) {
        botonRecomendaciones.addEventListener("click", function (event) {
            event.preventDefault();
            ventanaRecomendaciones.classList.add("mostrar");
            document.body.style.overflow = "hidden";
        });
    }

    if (cerrarRecomendaciones && ventanaRecomendaciones) {
        cerrarRecomendaciones.addEventListener("click", function () {
            ventanaRecomendaciones.classList.remove("mostrar");
            document.body.style.overflow = "";
        });
    }

    if (ventanaRecomendaciones) {
        ventanaRecomendaciones.addEventListener("click", function (event) {
            if (event.target === ventanaRecomendaciones) {
                ventanaRecomendaciones.classList.remove("mostrar");
                document.body.style.overflow = "";
            }
        });
    }

    /* =====================================================
       TECLA ESC
    ===================================================== */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            if (ventanaRecomendaciones) {
                ventanaRecomendaciones.classList.remove("mostrar");
                document.body.style.overflow = "";
            }
            if (menuAjustes) {
                menuAjustes.classList.remove("mostrar");
            }
        }
    });

    /* =====================================================
       BUSCADOR
    ===================================================== */
    const buscador = document.getElementById("buscador");

    if (buscador) {
        buscador.addEventListener("input", function () {
            const texto = buscador.value.toLowerCase().trim();
            const videojuegos = document.querySelectorAll(".videojuego");

            videojuegos.forEach(function (videojuego) {
                const titulo = videojuego.querySelector("h3") ? videojuego.querySelector("h3").textContent : "";
                const dataNombre = videojuego.dataset.nombre || "";
                const contenidoCompleto = videojuego.textContent || "";

                const coincide = 
                    titulo.toLowerCase().includes(texto) || 
                    dataNombre.toLowerCase().includes(texto) ||
                    contenidoCompleto.toLowerCase().includes(texto);

                if (coincide) {
                    videojuego.style.display = "";
                } else {
                    videojuego.style.display = "none";
                }
            });
        });
    }

    /* =====================================================
       FAVORITOS
    ===================================================== */
    const botonesFavoritos = document.querySelectorAll(".favorito");

    function obtenerFavoritos() {
        try {
            return JSON.parse(localStorage.getItem("favoritos") || "[]");
        } catch (error) {
            return [];
        }
    }

    botonesFavoritos.forEach(function (boton) {
        const tarjeta = boton.closest(".videojuego");
        const id = boton.dataset.id || (tarjeta ? tarjeta.dataset.nombre : null) || boton.dataset.nombre;

        let favoritos = obtenerFavoritos();

        if (favoritos.some(item => item.id === id)) {
            boton.classList.add("activo");
            boton.textContent = "♥";
        }

        boton.addEventListener("click", function () {
            let favoritos = obtenerFavoritos();
            const indice = favoritos.findIndex(item => item.id === id);

            if (indice === -1) {
                favoritos.push({
                    id: id,
                    nombre: boton.dataset.nombre || (tarjeta ? tarjeta.dataset.nombre : "Videojuego"),
                    imagen: boton.dataset.imagen || ""
                });
                boton.classList.add("activo");
                boton.textContent = "♥";
            } else {
                favoritos.splice(indice, 1);
                boton.classList.remove("activo");
                boton.textContent = "♡";
            }

            localStorage.setItem("favoritos", JSON.stringify(favoritos));

            const cantidadFavoritos = document.getElementById("cantidadFavoritos");
            if (cantidadFavoritos) {
                cantidadFavoritos.textContent = favoritos.length;
            }
        });
    });

    /* =====================================================
       SISTEMA DE VALORACIÓN (INTERACTIVO Y PERSISTENTE)
    ===================================================== */
    const botonesValorar = document.querySelectorAll(".boton-valorar");

    function obtenerValoraciones() {
        try {
            return JSON.parse(localStorage.getItem("valoraciones") || "[]");
        } catch (error) {
            return [];
        }
    }

    const valoracionesGuardadas = obtenerValoraciones();

    botonesValorar.forEach(function (boton) {
        const tarjeta = boton.closest(".videojuego");
        if (!tarjeta) return;

        const titulo = tarjeta.querySelector("h3") ? tarjeta.querySelector("h3").textContent : "este videojuego";
        const id = boton.dataset.id || tarjeta.dataset.id || tarjeta.dataset.nombre || titulo;
        const estrellasContenedor = tarjeta.querySelector(".estrellas");

        // Cargar estrellas guardadas si existen
        const valoracionExistente = valoracionesGuardadas.find(item => item.id === id);
        if (valoracionExistente && estrellasContenedor) {
            const nota = valoracionExistente.estrellas;
            estrellasContenedor.textContent = "★".repeat(nota) + "☆".repeat(5 - nota);
        }

        boton.addEventListener("click", function () {
            const entrada = prompt(`¿Qué puntuación le das a ${titulo}? (Ingresa un número del 1 al 5):`);

            if (entrada === null) return;

            const puntuacion = parseInt(entrada, 10);

            if (puntuacion >= 1 && puntuacion <= 5) {
                let valoraciones = obtenerValoraciones();
                const indice = valoraciones.findIndex(item => item.id === id);

                if (indice === -1) {
                    valoraciones.push({ id: id, estrellas: puntuacion });
                } else {
                    valoraciones[indice].estrellas = puntuacion;
                }

                localStorage.setItem("valoraciones", JSON.stringify(valoraciones));

                if (estrellasContenedor) {
                    estrellasContenedor.textContent = "★".repeat(puntuacion) + "☆".repeat(5 - puntuacion);
                }

                const cantidadValoraciones = document.getElementById("cantidadValoraciones");
                if (cantidadValoraciones) {
                    cantidadValoraciones.textContent = valoraciones.length;
                }

                alert(`¡Gracias! Has valorado ${titulo} con ${puntuacion} estrella(s).`);
            } else {
                alert("Por favor ingresa un número válido del 1 al 5.");
            }
        });
    });

    /* =====================================================
       CANTIDAD DE FAVORITOS Y VALORACIONES EN PERFIL
    ===================================================== */
    const cantidadFavoritos = document.getElementById("cantidadFavoritos");
    if (cantidadFavoritos) {
        cantidadFavoritos.textContent = obtenerFavoritos().length;
    }

    const cantidadValoraciones = document.getElementById("cantidadValoraciones");
    if (cantidadValoraciones) {
        cantidadValoraciones.textContent = obtenerValoraciones().length;
    }

    /* =====================================================
       CERRAR SESIÓN
    ===================================================== */
    const cerrarSesion = document.getElementById("cerrarSesion");

    if (cerrarSesion) {
        cerrarSesion.addEventListener("click", function () {
            localStorage.removeItem("usuarioActual");
            localStorage.removeItem("usuarioActivo");
            localStorage.removeItem("usuario");
            localStorage.removeItem("usuarioRegistrado");
            localStorage.removeItem("fotoPerfil");

            window.location.href = "index.html";
        });
    }

});

document.addEventListener("DOMContentLoaded", () => {
    const botonRecomendaciones = document.getElementById("botonRecomendaciones");
    const modalRecomendaciones = document.getElementById("modalRecomendaciones");
    const cerrarModal = document.getElementById("cerrarModal");

    if (botonRecomendaciones && modalRecomendaciones && cerrarModal) {
        // Abrir modal al hacer clic en el menú
        botonRecomendaciones.addEventListener("click", (e) => {
            e.preventDefault();
            modalRecomendaciones.classList.add("activo");
        });

        // Cerrar modal al pulsar la 'X'
        cerrarModal.addEventListener("click", () => {
            modalRecomendaciones.classList.remove("activo");
        });

        // Cerrar modal si se hace clic fuera del contenido
        window.addEventListener("click", (e) => {
            if (e.target === modalRecomendaciones) {
                modalRecomendaciones.classList.remove("activo");
            }
        });
    }
});