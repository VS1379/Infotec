// Función para manejar la respuesta de la API
function handleResponse(response) {
    response.json().then(data => {
        document.getElementById('response').innerText = JSON.stringify(data, null, 2);
    }).catch(err => console.error('Error en la respuesta:', err));
}

// Función para obtener todos los clientes
document.getElementById('getAllClientesForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('http://localhost:3001/clientes/clientes')
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para agregar un cliente
document.getElementById('createClienteForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const cliente = {
        dni: document.getElementById('dni').value,
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value
    };
    fetch('http://localhost:3001/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para actualizar un cliente
document.getElementById('updateClienteForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const cliente = {
        dni: document.getElementById('updateDni').value,
        nombre: document.getElementById('updateNombre').value,
        direccion: document.getElementById('updateDireccion').value,
        telefono: document.getElementById('updateTelefono').value,
        correo: document.getElementById('updateCorreo').value
    };
    const id = document.getElementById('updateId').value;
    fetch(`http://localhost:3001/clientes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente)
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para eliminar un cliente
document.getElementById('deleteClienteForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const id = document.getElementById('deleteId').value;
    fetch(`http://localhost:3001/clientes/${id}`, {
        method: 'DELETE'
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});
