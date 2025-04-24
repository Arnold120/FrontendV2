document.addEventListener("DOMContentLoaded", () => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuarioActual) {
        alert("Debes iniciar sesión.");
        window.location.href = "/Index.html";
        return;
    }

    document.getElementById("usuarioNombre").value = usuarioActual.nombreUsuario;
    document.getElementById("usuarioID").value = usuarioActual.id;

    cargarProveedores();
    cargarProductos();
    mostrarCompras();

    const formCompra = document.getElementById('formCompra');

    formCompra.addEventListener('submit', (e) => {
        e.preventDefault();

        const proveedor = document.getElementById("proveedor").value;
        const producto = document.getElementById("producto").value;
        const cantidad = parseInt(document.getElementById("cantidad").value);
        const precio = parseFloat(document.getElementById("precio").value);
        const descuento = parseFloat(document.getElementById("descuento").value) || 0;
        const iva = parseFloat(document.getElementById("iva").value) || 0;
        const observaciones = document.getElementById("observaciones").value;
        const calificacion = parseInt(document.getElementById("calificacion").value) || 0;

        if (!proveedor || !producto || isNaN(cantidad) || isNaN(precio)) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        const productos = JSON.parse(localStorage.getItem("productos")) || [];
        const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];

        const productoObj = productos[producto];
        const proveedorObj = proveedores[proveedor];

        if (!productoObj || !proveedorObj) {
            alert("Producto o proveedor inválido.");
            return;
        }

        const subtotal = cantidad * precio;
        const montoDescuento = subtotal * (descuento / 100);
        const montoConDescuento = subtotal - montoDescuento;
        const montoIVA = montoConDescuento * (iva / 100);
        const total = montoConDescuento + montoIVA;

        const compra = {
            IDCompra: Date.now(),
            IDUsuario: usuarioActual.id,
            IDProveedor: parseInt(proveedor),
            IDProducto: parseInt(producto),
            Cantidad: cantidad,
            PrecioProducto: precio,
            IVA: montoIVA,
            Descuento: montoDescuento,
            SubTotal: montoConDescuento,
            Total: total,
            FechaRegistro: new Date().toISOString(),
            Observaciones: observaciones,
            CalificacionProducto: calificacion
        };

        const compras = JSON.parse(localStorage.getItem("compras")) || [];
        compras.push(compra);
        localStorage.setItem("compras", JSON.stringify(compras));

        const movimientos = JSON.parse(localStorage.getItem("movimientos")) || [];
        movimientos.push({
            producto: productoObj.nombre,
            cantidad,
            tipo: "Entrada",
            fecha: new Date().toISOString()
        });
        localStorage.setItem("movimientos", JSON.stringify(movimientos));
        mostrarCompras();
        formCompra.reset();
        document.getElementById("subTotal").textContent = "0.00";
        document.getElementById("total").textContent = "0.00";
    });

    const calcularTotales = () => {
        const cantidad = parseFloat(document.getElementById("cantidad").value) || 0;
        const precio = parseFloat(document.getElementById("precio").value) || 0;
        const descuento = parseFloat(document.getElementById("descuento").value) || 0;
        const iva = parseFloat(document.getElementById("iva").value) || 0;

        const bruto = cantidad * precio;
        const conDescuento = bruto - (bruto * descuento / 100);
        const conIVA = conDescuento + (conDescuento * iva / 100);

        document.getElementById("subTotal").textContent = conDescuento.toFixed(2);
        document.getElementById("total").textContent = conIVA.toFixed(2);
    };

    document.getElementById("cantidad").addEventListener("input", calcularTotales);
    document.getElementById("precio").addEventListener("input", calcularTotales);
    document.getElementById("descuento").addEventListener("input", calcularTotales);
    document.getElementById("iva").addEventListener("input", calcularTotales);
});

function cargarProveedores() {
    const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];
    const select = document.getElementById("proveedor");
    select.innerHTML = '<option value="">Selecciona un proveedor</option>';
    proveedores.forEach((prov, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = prov.nombreEmpresa;
        select.appendChild(opt);
    });
}

function cargarProductos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const select = document.getElementById("producto");
    select.innerHTML = '<option value="">Selecciona un producto</option>';
    productos.forEach((prod, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${prod.nombre} - C$${prod.precio}`;
        select.appendChild(opt);
    });
}

function mostrarCompras() {
    const lista = document.getElementById("listaCompras");
    lista.innerHTML = '';
    const compras = JSON.parse(localStorage.getItem("compras")) || [];
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const proveedores = JSON.parse(localStorage.getItem("proveedores")) || [];

    compras.forEach(c => {
        const proveedor = proveedores[c.IDProveedor]?.nombreEmpresa || "Desconocido";
        const producto = productos[c.IDProducto]?.nombre || "Desconocido";

        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${producto}</strong> | 
            Proveedor: ${proveedor} | 
            Cantidad: ${c.Cantidad} | 
            Total: C$${c.Total.toFixed(2)} | 
            Fecha: ${new Date(c.FechaRegistro).toLocaleString()}
        `;
        lista.appendChild(li);
    });
}

