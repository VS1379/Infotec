// Función para manejar la respuesta de la API
function handleResponse(response) {
    response.json().then(data => {
        document.getElementById('response').innerText = JSON.stringify(data, null, 2);
    }).catch(err => console.error('Error en la respuesta:', err));
}

// Función para obtener todos los socios
document.getElementById('getAllSociosForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('http://localhost:3001/socios/socio')
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para agregar un socio
document.getElementById('createSocioForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const socio = {
        dni: document.getElementById('dni').value,
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        gerente: document.getElementById('gerente').checked
    };
    fetch('http://localhost:3001/socios', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(socio)
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para actualizar un socio
document.getElementById('updateSocioForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const socio = {
        dni: document.getElementById('updateDni').value,
        nombre: document.getElementById('updateNombre').value,
        direccion: document.getElementById('updateDireccion').value,
        telefono: document.getElementById('updateTelefono').value,
        correo: document.getElementById('updateCorreo').value,
        gerente: document.getElementById('updateGerente').checked
    };
    const id = document.getElementById('updateId').value;
    fetch(`http://localhost:3001/socios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(socio)
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para eliminar un socio
document.getElementById('deleteSocioForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const id = document.getElementById('deleteId').value;
    fetch(`http://localhost:3001/socios/${id}`, {
        method: 'DELETE'
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});
