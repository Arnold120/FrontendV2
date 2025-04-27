document.addEventListener("DOMContentLoaded", () => {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    if (usuarioActual && usuarioActual.id && usuarioActual.nombreUsuario) {
        window.location.href = "./MENU.html";
        return;
    }

    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const loginFormContainer = document.getElementById("login-form-container");
    const registerFormContainer = document.getElementById("register-form-container");

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value.trim();
        const contrasena = document.getElementById("contrasena").value.trim();

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const valido = usuarios.find(
            u => u.usuario === usuario && u.contrasena === contrasena
        );

        if (valido) {
            localStorage.setItem("usuarioActual", JSON.stringify({
                id: valido.id,
                nombreUsuario: valido.usuario
            }));

            alert("¡Bienvenido, " + usuario + "!");
            window.location.href = "./MENU.html";
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    });

    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nuevoUsuario = document.getElementById("new-usuario").value.trim();
        const nuevaContrasena = document.getElementById("new-contrasena").value.trim();
        const confirmarContrasena = document.getElementById("confirm-contrasena").value.trim();

        if (nuevaContrasena !== confirmarContrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioExistente = usuarios.find(u => u.usuario === nuevoUsuario);
        if (usuarioExistente) {
            alert("El nombre de usuario ya está registrado.");
            return;
        }

        usuarios.push({
            id: usuarios.length + 1,
            usuario: nuevoUsuario,
            contrasena: nuevaContrasena
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
        window.location.href = './login.html';
    });

    const registerLink = document.getElementById("registro-link");
    registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    const loginLink = document.getElementById("login-link");
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    const forgotPasswordLink = document.getElementById("password-link");
    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = '/InicioSeccion.html';
    });
});
