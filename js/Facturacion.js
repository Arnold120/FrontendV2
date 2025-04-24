document.addEventListener("DOMContentLoaded", () => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    if (!usuarioActual) {
        alert("Debes iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    mostrarFacturas();
});

function mostrarFacturas() {
    const listaFacturas = document.getElementById("listaFacturas");
    listaFacturas.innerHTML = "";

    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];

    ventas.forEach((venta, index) => {
        const factura = document.createElement("div");
        factura.classList.add("factura-emitida");

        factura.innerHTML = `
            <div class="encabezado">
                <h3>Factura #${index + 1}</h3>
                <p><strong>Fecha:</strong> ${new Date(venta.fecha).toLocaleString()}</p>
            </div>
            <div class="cliente">
                <p><strong>Cliente:</strong> ${venta.cliente}</p>
            </div>
            <div class="detalle">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${venta.producto}</td>
                            <td>${venta.cantidad}</td>
                            <td>C$${parseFloat(venta.precio).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="total">
                <p><strong>Total:</strong> C$${parseFloat(venta.total).toFixed(2)}</p>
                <p><strong>Vuelto:</strong> C$${parseFloat(venta.vuelto).toFixed(2)}</p>
            </div>
            <div class="acciones">
                <button onclick="generarPDF(${index})">Descargar PDF</button>
            </div>
            <hr>
        `;

        listaFacturas.appendChild(factura);
    });
}

function generarPDF(index) {
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    const venta = ventas[index];

    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.classList.add("factura");

    tempDiv.innerHTML = `
        <div class="factura-header">
         <img src="./images/Logo de la libreria el estudiante.png" alt="logo">
            <div class="factura-info">
                <h2>Librería "El Estudiante"</h2>
                <p>Venta de útiles escolares, libros, artículos de oficina y más</p>
                <p>Ubicada en Jinotepe, Carazo</p>
            </div>
            <div class="factura-ruc">
                <p><strong>R.U.C.:</strong> 0011234567890</p>
                <p><strong>FACTURA:</strong> ${index + 1}</p>
            </div>
        </div>
        <div class="factura-datos">
            <p><strong>Cliente:</strong> ${venta.cliente}</p>
            <p><strong>Fecha:</strong> ${new Date(venta.fecha).toLocaleString()}</p>
        </div>
        <table class="factura-tabla">
            <thead>
                <tr>
                    <th>CANT.</th>
                    <th>DESCRIPCIÓN</th>
                    <th>PRECIO UNITARIO</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${venta.cantidad}</td>
                    <td>${venta.producto}</td>
                    <td>C$${parseFloat(venta.precio).toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
        <div class="factura-totales">
            <p><strong>SUBTOTAL:</strong> C$${parseFloat(venta.subtotal).toFixed(2)}</p>
            <p><strong>I.V.A.:</strong> 15%</p>
            <p><strong>TOTAL:</strong> C$${parseFloat(venta.total).toFixed(2)}</p>
            <p><strong>MONTO RECIBIDO:</strong> C$${(parseFloat(venta.total) + parseFloat(venta.vuelto)).toFixed(2)}</p>
            <p><strong>VUELTO:</strong> C$${parseFloat(venta.vuelto).toFixed(2)}</p>
        </div>
        <div class="factura-firma">
            <p>_______________________________</p>
            <p>Firma del Cliente</p>
        </div>
    `;

    document.body.appendChild(tempDiv);

    html2canvas(tempDiv).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("landscape", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Factura_${index + 1}.pdf`);

        document.body.removeChild(tempDiv);
    });
}
