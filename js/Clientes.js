const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
if (!usuarioActual) {
    alert("Debes iniciar sesión.");
    window.location.href = "login.html";
}
const userId = usuarioActual.id;

document.addEventListener("DOMContentLoaded", () => {
    const formCliente = document.getElementById("formCliente");
    const inputs = {
        nombre: document.getElementById("nombre"),
        apellido: document.getElementById("apellido"),
        fechaRegistro: document.getElementById("fechaRegistro")
    };

    const outputs = {
        listaClientes: document.getElementById("listaClientes")
    };

    const cargarClientes = () => {
        const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
        outputs.listaClientes.innerHTML = "";
        clientesGuardados.forEach(cliente => {
            const li = document.createElement("li");
            li.textContent = `Nombre: ${cliente.nombre} ${cliente.apellido} | Fecha de Registro: ${cliente.fechaRegistro}`;
            outputs.listaClientes.appendChild(li);
        });
    };

    cargarClientes();

    formCliente.addEventListener("submit", (e) => {
        e.preventDefault();

        const cliente = {
            nombre: inputs.nombre.value,
            apellido: inputs.apellido.value,
            fechaRegistro: inputs.fechaRegistro.value,
        };
        const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
        clientesGuardados.push(cliente);
        localStorage.setItem("clientes", JSON.stringify(clientesGuardados));
        const li = document.createElement("li");
        li.textContent = `Nombre: ${cliente.nombre} ${cliente.apellido} | Fecha de Registro: ${cliente.fechaRegistro}`;
        outputs.listaClientes.appendChild(li);

        formCliente.reset();
    });
});
