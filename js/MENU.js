document.addEventListener("DOMContentLoaded", () => {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!usuarioActual) {
        alert("Debes iniciar sesión.");
        window.location.href = "LOGIN.html"; 
        return;
    }

    const nombreElemento = document.getElementById("usuarioNombre");
    if (nombreElemento) {
        nombreElemento.textContent = `Usuario: ${usuarioActual.nombreUsuario}`;
    }

    const botonCerrarSesion = document.getElementById("cerrarSesion");
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", () => {
            localStorage.removeItem("usuarioActual");
            alert("Sesión cerrada.");
            window.location.href = "LOGIN.html";
        });
    }
    mostrarSeccion('bienvenida');
});

function mostrarSeccion(nombre) {
    const secciones = document.querySelectorAll('.panel');
    secciones.forEach(seccion => seccion.style.display = 'none');

    let seccion = document.getElementById(nombre);
    if (!seccion) {
        seccion = document.createElement('section');
        seccion.id = nombre;
        seccion.classList.add('panel');
        seccion.innerHTML = `<h2>${capitalizar(nombre)}</h2><p>Sección en desarrollo...</p>`;
        document.querySelector('.contenido-principal').appendChild(seccion);
    }

    seccion.style.display = 'block';
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function mostrarMensaje(mensaje) {
    alert(`Funcionalidad de "${mensaje}" en desarrollo.`);
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarSeccion('bienvenida');
});
