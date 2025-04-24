document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-proveedor");
    const tabla = document.getElementById("tabla-proveedores").querySelector("tbody");

    let proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];

    function mostrarProveedores() {
        tabla.innerHTML = "";
        proveedores.forEach(proveedor => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${proveedor.nombreEmpresa}</td>
                <td>${proveedor.direccion}</td>
                <td>${proveedor.telefono}</td>
                <td>${proveedor.email}</td>
            `;
            tabla.appendChild(fila);
        });
    }

    form.addEventListener("submit", e => {
        e.preventDefault();

        const nuevoProveedor = {
            nombreEmpresa: document.getElementById("nombreEmpresa").value,
            direccion: document.getElementById("direccion").value,
            telefono: document.getElementById("telefono").value,
            email: document.getElementById("email").value
        };

        proveedores.push(nuevoProveedor);
        localStorage.setItem("proveedores", JSON.stringify(proveedores));
        form.reset();
        mostrarProveedores();
    });

    mostrarProveedores();
});
