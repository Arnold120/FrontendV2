const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
if (!usuarioActual) {
    alert("Debes iniciar sesión.");
    window.location.href = "/Index.html";
}
const userId = usuarioActual.id;

document.addEventListener("DOMContentLoaded", () => {
    const formVenta = document.getElementById("formVenta");
    const selectCliente = document.getElementById("cliente");
    const selectProducto = document.getElementById("producto");
    const tipoComprobante = document.getElementById("tipoComprobante");

    const campoCliente = document.getElementById("campoCliente");

    const inputs = {
        cantidad: document.getElementById("cantidad"),
        precio: document.getElementById("precioUnitario"),
        descuento: document.getElementById("descuento"),
        iva: document.getElementById("iva"),
        montoRecibido: document.getElementById("montoRecibido"),
        cliente: selectCliente,
        producto: selectProducto
    };

    const outputs = {
        subtotal: document.getElementById("subTotal"),
        total: document.getElementById("total"),
        vuelto: document.getElementById("montoDevuelto"),
        listaVentas: document.getElementById("listaVentas")
    };

    const contenedores = {
        descuento: document.getElementById("campoDescuento"),
        iva: document.getElementById("ivaContainer"),
        vuelto: document.getElementById("campoVuelto")
    };

    const cargarClientes = () => {
        const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
        selectCliente.innerHTML = '<option value="">Selecciona un cliente</option>';
        clientesGuardados.forEach((cliente) => {
            const option = document.createElement("option");
            option.value = `${cliente.nombre} ${cliente.apellido}`;
            option.textContent = `${cliente.nombre} ${cliente.apellido}`;
            selectCliente.appendChild(option);
        });
    };

    const cargarProductos = () => {
        const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
        selectProducto.innerHTML = '<option value="">Selecciona un producto</option>';
        productosGuardados.forEach((producto) => {
            const option = document.createElement("option");
            option.value = producto.codigo;
            option.textContent = `${producto.nombre} (${producto.categoria}) - C$${producto.precio}`;
            selectProducto.appendChild(option);
        });
    };

    const mostrarSiTieneValor = (campo, contenedor) => {
        if (campo.value.trim() === "" || parseFloat(campo.value) === 0) {
            contenedor.classList.add("oculto");
        } else {
            contenedor.classList.remove("oculto");
        }
    };

    const calcularTotales = () => {
        const cantidad = parseFloat(inputs.cantidad.value) || 0;
        const precio = parseFloat(inputs.precio.value) || 0;
        const descuento = parseFloat(inputs.descuento.value) || 0;
        const iva = parseFloat(inputs.iva.value) || 0;
        const montoRecibido = parseFloat(inputs.montoRecibido.value) || 0;

        const subtotal = cantidad * precio;
        const montoConDescuento = subtotal - (subtotal * (descuento / 100));
        const montoConIVA = montoConDescuento + (montoConDescuento * iva / 100);
        const vuelto = montoRecibido - montoConIVA;

        outputs.subtotal.textContent = subtotal.toFixed(2);
        outputs.total.textContent = montoConIVA.toFixed(2);
        outputs.vuelto.textContent = vuelto.toFixed(2);

        mostrarSiTieneValor(inputs.montoRecibido, contenedores.vuelto);
        contenedores.iva.classList.remove("oculto");
    };

    Object.values(inputs).forEach(input => {
        input.addEventListener("input", calcularTotales);
    });

    formVenta.addEventListener("submit", (e) => {
        e.preventDefault();

        const esTicket = tipoComprobante.value === "Ticket";
        if (!esTicket && !inputs.cliente.value) {
            alert("Por favor, selecciona un cliente.");
            return;
        }

        const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
        const productoSeleccionado = productosGuardados.find(p => p.codigo === inputs.producto.value);

        const venta = {
            cliente: esTicket ? "Consumidor Final" : inputs.cliente.value,
            cantidad: inputs.cantidad.value,
            precio: inputs.precio.value,
            subtotal: outputs.subtotal.textContent,
            total: outputs.total.textContent,
            vuelto: outputs.vuelto.textContent,
        };

        const ventasGuardadas = JSON.parse(localStorage.getItem("ventas")) || [];
        ventasGuardadas.push({
            ...venta,
            producto: productoSeleccionado ? productoSeleccionado.nombre : "Desconocido",
            usuarioId: userId,
            fecha: new Date().toISOString()
        });
        localStorage.setItem("ventas", JSON.stringify(ventasGuardadas));

        const li = document.createElement("li");
        li.textContent = `Cliente: ${venta.cliente} | Cantidad: ${venta.cantidad} | Precio: C$${venta.precio} | Total: C$${venta.total} | Vuelto: C$${venta.vuelto}`;
        outputs.listaVentas.appendChild(li);

        formVenta.reset();
        outputs.subtotal.textContent = "0.00";
        outputs.total.textContent = "0.00";
        outputs.vuelto.textContent = "0.00";

        cargarProductos();
        cargarClientes();

        contenedores.vuelto.classList.add("oculto");
        contenedores.iva.classList.remove("oculto");

        tipoComprobante.dispatchEvent(new Event("change"));
    });

    const actualizarVisibilidadDescuento = () => {
        const esTicket = tipoComprobante.value === "Ticket";
        const clienteSeleccionado = selectCliente.value.trim() !== "";
    
        if (!esTicket && clienteSeleccionado) {
            contenedores.descuento.classList.remove("oculto");
        } else {
            contenedores.descuento.classList.add("oculto");
            inputs.descuento.value = "0"; 
        }
    };
    
    tipoComprobante.addEventListener("change", () => {
        campoCliente.classList.toggle("oculto", tipoComprobante.value === "Ticket");
        selectCliente.required = tipoComprobante.value !== "Ticket";
        contenedores.vuelto.classList.toggle("oculto", tipoComprobante.value === "Ticket");
        contenedores.iva.classList.remove("oculto");
        
        actualizarVisibilidadDescuento();
        calcularTotales();
    });
    
    selectCliente.addEventListener("change", () => {
        actualizarVisibilidadDescuento();
        calcularTotales();
    });    

    cargarClientes();
    cargarProductos();
    tipoComprobante.dispatchEvent(new Event("change"));
});
