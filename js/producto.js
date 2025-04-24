const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
if (!usuarioActual) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
}
const userId = usuarioActual.id;

document.addEventListener("DOMContentLoaded", () => {
    const formProducto = document.getElementById("formProducto");
    const inputs = {
        codigo: document.getElementById("codigo"),
        nombre: document.getElementById("nombre"),
        categoria: document.getElementById("categoria"),
        precio: document.getElementById("precio"),
        stock: document.getElementById("stock")
    };

    const outputs = {
        listaProductos: document.getElementById("listaProductos")
    };

    const cargarProductos = () => {
        const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
        outputs.listaProductos.innerHTML = "";
        productosGuardados.forEach(producto => {
            const li = document.createElement("li");
            li.textContent = `Código: ${producto.codigo} | Producto: ${producto.nombre} | Categoría: ${producto.categoria} | Precio: C$${producto.precio} | Stock: ${producto.stock}`;
            outputs.listaProductos.appendChild(li);
        });
    };

    cargarProductos();

    formProducto.addEventListener("submit", (e) => {
        e.preventDefault();

        const producto = {
            codigo: inputs.codigo.value,
            nombre: inputs.nombre.value,
            categoria: inputs.categoria.value,
            precio: parseFloat(inputs.precio.value).toFixed(2),
            stock: parseInt(inputs.stock.value)
        };

        const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];
        productosGuardados.push(producto);
        localStorage.setItem("productos", JSON.stringify(productosGuardados));

        const li = document.createElement("li");
        li.textContent = `Código: ${producto.codigo} | Producto: ${producto.nombre} | Categoría: ${producto.categoria} | Precio: C$${producto.precio} | Stock: ${producto.stock}`;
        outputs.listaProductos.appendChild(li);

        formProducto.reset();
    });
});
