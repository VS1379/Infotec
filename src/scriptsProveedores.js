// Función para manejar la respuesta de la API
function handleResponse(response) {
    const responseDiv = document.getElementById("response");
    responseDiv.innerHTML = ""; // Limpiar el contenido anterior
    if (!response.ok) {
        response.text().then((text) => {
            responseDiv.innerHTML = `<div style="color: red;">Error: ${response.status} - ${text}</div>`;
        });
        return false; // Hubo un error
    }
    return true; // Respuesta correcta
}

// Función para obtener todos los proveedores
document.getElementById("getAllProveedoresForm").addEventListener("submit", function (event) {
    event.preventDefault();
    fetch("http://localhost:3001/proveedores")
        .then((response) => {
            if (response) {
                return response.json(); // Convierte la respuesta a JSON
            }
        })
        .then((data) => {
            if (Array.isArray(data)) {
                const responseDiv = document.getElementById("response");
                const html = data
                    .map(
                        (proveedor) => `
                        <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                            <p>ID: ${proveedor.ID_Proveedor || "N/A"}</p>
                            <p>CUIT: ${proveedor.CUIT || "N/A"}</p>
                            <p>Nombre o Razón Social: ${proveedor.NOMBRE_RAZON_SOCIAL || "N/A"}</p>
                            <p>Dirección: ${proveedor.DIRECCION || "N/A"}</p>
                            <p>Teléfono: ${proveedor.TELEFONO || "N/A"}</p>
                            <p>Correo: ${proveedor.CORREO || "N/A"}</p>
                        </div>
                    `
                    )
                    .join("");
                responseDiv.innerHTML = html; // Muestra los proveedores en el div
            } else {
                document.getElementById("response").innerHTML = "<div>No se encontraron proveedores.</div>";
            }
        })
        .catch((err) => console.error("Error:", err));
});

// Función para agregar un proveedor
document.getElementById("createProveedorForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const proveedor = {
        id_proveedor: document.getElementById("id_proveedor").value,
        cuit: document.getElementById("cuit").value,
        nombre: document.getElementById("nombre").value,
        direccion: document.getElementById("direccion").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
    };
    fetch("http://localhost:3001/proveedoresCrear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(proveedor),
    })
        .then((response) => {
            if (handleResponse(response)) {
                alert(`Agregado correctamente, ID: ${proveedor.id_proveedor}`);
            }
        })
        .catch((err) => console.error("Error:", err));
});

// Función para actualizar un proveedor
document.getElementById("updateProveedorFormById").addEventListener("submit", function (event) {
    event.preventDefault();
    fetch(`http://localhost:3001/proveedores/${document.getElementById("updateId").value}`)
        .then((data) => {
            if (handleResponse(data)) {
                data.json().then((data) => {
                    document.getElementById("dontExist").innerHTML = "";
                    document.getElementById("updateProveedorForm").hidden = false;
                    document.getElementById("updateId").readOnly = true;
                    document.getElementById("updateCuit").value = data.CUIT || "N/A";
                    document.getElementById("updateNombre").value = data.NOMBRE || "N/A";
                    document.getElementById("updateDireccion").value = data.DIRECCION || "N/A";
                    document.getElementById("updateTelefono").value = data.TELEFONO || "N/A";
                    document.getElementById("updateCorreo").value = data.CORREO || "N/A";
                });
            } else {
                document.getElementById("dontExist").innerHTML = "<br>EL PROVEEDOR NO EXISTE</br>";
            }
        })
        .catch((err) => console.log("Error", err));
});

// Función para modificar un proveedor
document.getElementById("updateProveedorForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const proveedor = {};
    const id_proveedor = document.getElementById("updateId").value;
    const cuit = document.getElementById("updateCuit").value;
    const nombre = document.getElementById("updateNombre").value;
    const direccion = document.getElementById("updateDireccion").value;
    const telefono = document.getElementById("updateTelefono").value;
    const correo = document.getElementById("updateCorreo").value;
    if (id_proveedor) proveedor.id_proveedor = id_proveedor;
    if (cuit) proveedor.cuit = cuit;
    if (nombre) proveedor.nombre = nombre;
    if (direccion) proveedor.direccion = direccion;
    if (telefono) proveedor.telefono = telefono;
    if (correo) proveedor.correo = correo;
    fetch(`http://localhost:3001/proveedores/${id_proveedor}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(proveedor),
    })
        .then((response) => {
            if (handleResponse(response)) {
                alert(`Modificado correctamente, ID: ${id_proveedor}`);
            }
        })
        .catch((err) => console.error("Error:", err));
});

// Función para eliminar un proveedor
document.getElementById("deleteProveedorForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const id_proveedor = document.getElementById("deleteId").value;
    if (!id_proveedor) {
        console.error("El ID es requerido para eliminar un proveedor.");
        return;
    }
    fetch(`http://localhost:3001/proveedores/${id_proveedor}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (handleResponse(response)) {
                alert(`Eliminado correctamente, ID: ${id_proveedor}`);
            }
        })
        .catch((err) => console.error("Error:", err));
});
