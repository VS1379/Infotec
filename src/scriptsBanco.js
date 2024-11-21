// Selección de elementos
const getAllBancoForm = document.getElementById('getAllBancoForm');
const createBancoForm = document.getElementById('createBancoForm');
const updateBancoFormById = document.getElementById('updateBancoFormById');
const deleteBancoForm = document.getElementById('deleteBancoForm');

// Mostrar respuesta
const bancoResponse = document.getElementById('bancoResponse');
const dontExist = document.getElementById('dontExist');

// URL base del servidor
const API_URL = 'http://localhost:3001/bancos';

// Formatear respuesta
function formatResponse(data) {
    return data.map(item => `<p>ID: ${item.IdBanco} - Nombre: ${item.Nombre}</p>`).join('');
}

// Obtener todos los bancos
getAllBancoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        bancoResponse.innerHTML = formatResponse(data);
    } catch (error) {
        bancoResponse.textContent = `Error: ${error.message}`;
    }
});

// Crear banco
createBancoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombreBanco = document.getElementById('nombreBanco').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Nombre: nombreBanco }),
        });
        const data = await response.json();
        alert(`Banco creado`)
        createBancoForm.reset();
    } catch (error) {
        bancoResponse.textContent = `Error: ${error.message}`;
    }
});

// Actualizar banco por ID
updateBancoFormById.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('updateIdBanco').value;
    const nombreBanco = document.getElementById('nombreBancoUpdate').value;
    try {
        const response = await fetch(API_URL + `/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: nombreBanco }),
        });
        const data = await response.json();
        alert(`Banco actualizado`)
    } catch (error) {
        bancoResponse.textContent = `Error: ${error.message}`;
    }
});

// Eliminar banco por ID
deleteBancoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('deleteIdBanco').value;

    try {
        const response = await fetch(API_URL + `/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ IdBanco: id }),
        });
        alert(`Banco eliminado: ID ${id}`);
    } catch (error) {
        bancoResponse.textContent = `Error: ${error.message}`;
    }
});
