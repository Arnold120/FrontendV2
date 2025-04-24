document.addEventListener("DOMContentLoaded", () => {
    mostrarMovimientos();
});

function mostrarMovimientos() {
    const tbody = document.querySelector("#tablaMovimientos tbody");
    tbody.innerHTML = "";

    const compras = JSON.parse(localStorage.getItem("compras")) || [];
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    const movimientos = [];

    compras.forEach(compra => {
        const producto = productos[compra.IDProducto];
        movimientos.push({
            producto: producto ? producto.nombre : "Desconocido",
            cantidad: compra.Cantidad,
            tipo: "Entrada",
            fecha: compra.FechaRegistro
        });
    });

    ventas.forEach(venta => {
        movimientos.push({
            producto: venta.producto || "Desconocido",
            cantidad: parseInt(venta.cantidad) || 0,
            tipo: "Salida",
            fecha: venta.fecha
        });
    });

    movimientos.forEach(mov => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${mov.producto}</td>
            <td>${mov.cantidad}</td>
            <td>${mov.tipo}</td>
            <td>${new Date(mov.fecha).toLocaleString()}</td>
        `;
        tbody.appendChild(fila);
    });
}
