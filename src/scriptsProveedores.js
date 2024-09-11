// Función para manejar la respuesta de la API
function handleResponse(response) {
    response.json().then(data => {
        document.getElementById('response').innerText = JSON.stringify(data, null, 2);
    }).catch(err => console.error('Error en la respuesta:', err));
}

// Función para obtener todos los proveedores
document.getElementById('getAllProveedoresForm').addEventListener('submit', function (event) {
    event.preventDefault();
    fetch('http://localhost:3001/proveedores/proveedorw')
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para agregar un proveedor
document.getElementById('createProveedorForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const proveedor = {
        id: document.getElementById('id').value,
        cuit: document.getElementById('cuit').value,
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value
    };
    fetch('http://localhost:3001/proveedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para actualizar un proveedor
document.getElementById('updateProveedorForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const proveedor = {
        cuit: document.getElementById('updateCuit').value,
        nombre: document.getElementById('updateNombre').value,
        direccion: document.getElementById('updateDireccion').value,
        telefono: document.getElementById('updateTelefono').value,
        correo: document.getElementById('updateCorreo').value
    };
    const id = document.getElementById('updateId').value;
    fetch(`http://localhost:3001/proveedores/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(proveedor)
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});

// Función para eliminar un proveedor
document.getElementById('deleteProveedorForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const id = document.getElementById('deleteId').value;
    fetch(`http://localhost:3001/proveedores/${id}`, {
        method: 'DELETE'
    })
        .then(handleResponse)
        .catch(err => console.error('Error:', err));
});
