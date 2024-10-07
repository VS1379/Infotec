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

// Función para obtener todo el hardware
document.getElementById("getAllHardwareForm").addEventListener("submit", function (event) {
    event.preventDefault();
    fetch("http://localhost:3001/hardware")
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
                        (hardware) => `
                        <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                            <p>ID: ${hardware.ID_Hard || "N/A"}</p>
                            <p>Tipo: ${hardware.ID_Tipohard || "N/A"}</p>
                            <p>Marca: ${hardware.ID_Marca || "N/A"}</p>
                            <p>Características: ${hardware.CARACTERISTICAS || "N/A"}</p>
                            <p>Precio Unitario: ${hardware.PRECIO_UNITARIO || "N/A"}</p>
                            <p>Unidades Disponibles: ${hardware.UNIDADES_DISPONIBLES || "N/A"}</p>
                        </div>
                    `
                    )
                    .join("");
                responseDiv.innerHTML = html; // Muestra el hardware en el div
            } else {
                document.getElementById("response").innerHTML = "<div>No se encontró hardware.</div>";
            }
        })
        .catch((err) => console.error("Error:", err));
});

// Función para agregar hardware
document.getElementById("createHardwareForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const hardware = {
        id_hard: document.getElementById("id_hard").value,
        id_tipohard: document.getElementById("id_tipohard").value,
        id_marca: document.getElementById("id_marca").value,
        caracteristicas: document.getElementById("caracteristicas").value,
        precio_unitario: document.getElementById("precio_unitario").value,
        unidades_disponibles: document.getElementById("unidades_disponibles").value,
    };
    fetch("http://localhost:3001/hardwareCrear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(hardware),
    })
        .then((response) => {
            if (handleResponse(response)) {
                alert(`Agregado correctamente, ID: ${hardware.id_hard}`);
            }
        })
        .catch((err) => console.error("Error:", err));
});

// Función para actualizar hardware
document.getElementById("updateHardwareFormById").addEventListener("submit", function (event) {
    event.preventDefault();
    fetch(`http://localhost:3001/hardware/${document.getElementById("updateId").value}`)
        .then((data) => {
            if (handleResponse(data)) {
                data.json().then((data) => {
                    document.getElementById("dontExist").innerHTML = "";
                    document.getElementById("updateHardwareForm").hidden = false;
                    document.getElementById("updateId").readOnly = true;
                    document.getElementById("updateTipohard").value = data.ID_Tipohard || "N/A";
                    document.getElementById("updateMarca").value = data.ID_Marca || "N/A";
                    document.getElementById("updateCaracteristicas").value = data.CARACTERISTICAS || "N/A";
                    document.getElementById("updatePrecioUnitario").value = data.PRECIO_UNITARIO || "N/A";
                    document.getElementById("updateUnidadesDisponibles").value = data.UNIDADES_DISPONIBLES || "N/A";
                });
            } else {
                document.getElementById("dontExist").innerHTML = "<br>EL HARDWARE NO EXISTE</br>";
            }
        })
        .catch((err) => console.log("Error", err));
});
// Función para modificar hardware
document.getElementById("updateHardwareForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const hardware = {};
    const id_hard = document.getElementById("updateId").value;
    const id_tipohard = document.getElementById("updateTipohard").value;
    const id_marca = document.getElementById("updateMarca").value;
    const caracteristicas = document.getElementById("updateCaracteristicas").value;
    const precio_unitario = document.getElementById("updatePrecioUnitario").value;
    const unidades_disponibles = document.getElementById("updateUnidadesDisponibles").value;
    if (id_hard) hardware.id_hard = id_hard;
    if (id_tipohard) hardware.id_tipohard = id_tipohard;
    if (id_marca) hardware.id_marca = id_marca;
    if (caracteristicas) hardware.caracteristicas = caracteristicas;
    if (precio_unitario) hardware.precio_unitario = precio_unitario;
    if (unidades_disponibles) hardware.unidades_disponibles = unidades_disponibles;
    fetch(`http://localhost:3001/hardware/${id_hard}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(hardware),
    })
        .then((response) => {
            if (handleResponse(response)) {
                alert(`Modificado correctamente, ID: ${id_hard}`);
            }
        })
        .catch((err) => console.error("Error:", err));
});

// Función para eliminar hardware
document.getElementById("deleteHardwareForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const id_hard = document.getElementById("deleteId").value;
    if (!id_hard) {
        console.error("El ID es requerido para eliminar hardware.");
        return;
    }
    fetch(`http://localhost:3001/hardware/${id_hard}`, {
        method: "DELETE",
    })
        .then((response) => {
            if (handleResponse(response)) {
                alert(`Eliminado correctamente, ID: ${id_hard}`);
            }
        })
        .catch((err) => console.error("Error:", err));
});
