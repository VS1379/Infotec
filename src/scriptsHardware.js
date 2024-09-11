// Función para manejar la respuesta de la API
function handleResponse(response) {
    response.json().then(data => {
        document.getElementById('response').innerText = JSON.stringify(data, null, 2);
    }).catch(err => console.error('Error en la respuesta:', err));
}

// Función para obtener todo el hardware
document.getElementById('getAllHardwareForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('http://localhost:3001/hardware')
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para agregar hardware
document.getElementById('createHardwareForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const hardware = {
        tipo: document.getElementById('tipo').value,
        marca: document.getElementById('marca').value,
        caracteristicas: document.getElementById('caracteristicas').value,
        precio: document.getElementById('precio').value,
        unidades: document.getElementById('unidades').value
    };
    fetch('http://localhost:3001/hardware', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hardware)
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para actualizar hardware
document.getElementById('updateHardwareForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const hardware = {
        tipo: document.getElementById('updateTipo').value,
        marca: document.getElementById('updateMarca').value,
        caracteristicas: document.getElementById('updateCaracteristicas').value,
        precio: document.getElementById('updatePrecio').value,
        unidades: document.getElementById('updateUnidades').value
    };
    const id = document.getElementById('updateId').value;
    fetch(`http://localhost:3001/hardware/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(hardware)
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para eliminar hardware
document.getElementById('deleteHardwareForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const id = document.getElementById('deleteId').value;
    fetch(`http://localhost:3001/hardware/${id}`, {
        method: 'DELETE'
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});
