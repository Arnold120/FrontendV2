document.addEventListener("DOMContentLoaded", () => {
    emailjs.init("jcCjqpHdOTpmPV3ik"); /*Servidores de emailjs cuenta personal a cambiar*/

    const registerForm = document.getElementById("register-form");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nuevoUsuario = document.getElementById("new-usuario").value.trim();
        const nuevaContrasena = document.getElementById("new-contrasena").value.trim();
        const confirmarContrasena = document.getElementById("confirm-contrasena").value.trim();
        const correo = document.getElementById("new-correo").value.trim();

        if (nuevaContrasena !== confirmarContrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/;
        if (!emailRegex.test(correo)) {
            alert("Por favor ingresa un correo válido.");
            return;
        }

        if (!correo) {
            alert("Por favor ingresa un correo electrónico.");
            return;
        }

        console.log("Correo electrónico:", correo); 
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        const usuarioExistente = usuarios.find(u => u.usuario === nuevoUsuario);
        if (usuarioExistente) {
            alert("El nombre de usuario ya está registrado.");
            return;
        }

        const correoExistente = usuarios.find(u => u.correo === correo);
        if (correoExistente) {
            alert("El correo electrónico ya está registrado.");
            return;
        }

        usuarios.push({
            id: usuarios.length + 1,
            usuario: nuevoUsuario,
            contrasena: nuevaContrasena,
            correo: correo
        });

        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        const templateParams = {
            email: correo,
            subject: "Confirmación de Registro - Librería El Estudiante",
            message: `Hola ${nuevoUsuario},\n\nTu registro en Librería El Estudiante ha sido exitoso. Si olvidaste tu contraseña, puedes restablecerla visitando nuestro sitio web.\n\nGracias por registrarte con nosotros.`
        };

        emailjs.send("service_8e1schm", "template_91ga8tn", templateParams) /*Cambio a futuro de srvidores, cuenta personal aun vigente paras prueba de desarrollo*/
            .then((response) => {
                console.log("Correo enviado con éxito:", response);
                alert("¡Registro exitoso! Te hemos enviado un correo de confirmación.");
                window.location.href = './Index.html';
            })
            .catch((error) => {
                console.error('Error al enviar el correo:', error);
                alert("Hubo un problema al enviar el correo de confirmación. Intenta de nuevo.");
            })
            .finally(() => {
               //Posibles mejoras de limpiado al agg datos 
            });
    });
});
