
// Iniciar sesión con Firebase cuando el formulario se envía
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Inicio de sesión exitoso
            console.log('Inicio de sesión exitoso');
            window.location.href = 'index.html'; // Redirigir al usuario a index.html
        })
        .catch((error) => {
            console.error('Error de autenticación:', error);
            alert('Error al iniciar sesión: ' + error.message);
        });
});
