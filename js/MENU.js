document.addEventListener("DOMContentLoaded", () => {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));

    if (!usuarioActual) {
        alert("Debes iniciar sesión.");
        window.location.href = "/Index.html"; 
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
            window.location.href = "/Index.html";
        });
    }
});