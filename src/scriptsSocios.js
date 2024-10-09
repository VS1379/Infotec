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

// Función para obtener clientes por un campo específico
document
  .getElementById("getSociosByField")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const field = document.getElementById("field").value;
    const data = document.getElementById("data").value;

    if (!data) {
      document.getElementById(
        "response"
      ).innerHTML = `<div>Por favor, ingresa un valor para buscar.</div>`;
      return;
    }

    fetch(
      `http://localhost:3001/socios/buscar/campo?field=${field}&data=${data}`
    )
      .then((response) => {
        if (response) {
          return response.json();
        }
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const responseDiv = document.getElementById("response");
          const html = data
            .map(
              (socio) => `
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                <p>ID: ${socio.ID_Socio || "N/A"}</p>
                <p>DNI: ${socio.DNI || "N/A"}</p>
                <p>Apellido y Nombre: ${socio.APELLIDO_NOMBRE || "N/A"}</p>
                <p>Dirección: ${socio.DIRECCION || "N/A"}</p>
                <p>Teléfono: ${socio.TELEFONO || "N/A"}</p>
                <p>Correo: ${socio.CORREO || "N/A"}</p>
                <p>Socio Gerente: ${socio.SOCIO_GERENTE ? "Sí" : "No"}</p>
            </div>
        `
            )
            .join("");
          responseDiv.innerHTML = html;
        } else {
          document.getElementById(
            "response"
          ).innerHTML = `<div>No se encontraron socios.</div>`;
        }
      })
      .catch((err) => console.error("Error:", err));
  });

// Función para obtener todos los socios
document
  .getElementById("getAllSociosForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    fetch("http://localhost:3001/socios")
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
              (socio) => `
                        <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                            <p>ID: ${socio.ID_Socio || "N/A"}</p>
                            <p>DNI: ${socio.DNI || "N/A"}</p>
                            <p>Apellido y Nombre: ${
                              socio.APELLIDO_NOMBRE || "N/A"
                            }</p>
                            <p>Dirección: ${socio.DIRECCION || "N/A"}</p>
                            <p>Teléfono: ${socio.TELEFONO || "N/A"}</p>
                            <p>Correo: ${socio.CORREO || "N/A"}</p>
                            <p>Socio Gerente: ${
                              socio.SOCIO_GERENTE ? "Sí" : "No"
                            }</p>
                        </div>
                    `
            )
            .join("");
          responseDiv.innerHTML = html; // Muestra los socios en el div
        } else {
          document.getElementById("response").innerHTML =
            "<div>No se encontraron socios.</div>";
        }
      })
      .catch((err) => console.error("Error:", err));
  });

// Función para agregar un socio
document
  .getElementById("createSocioForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const socio = {
      dni: document.getElementById("dni").value,
      apellido_nombre: document.getElementById("apellido_nombre").value,
      direccion: document.getElementById("direccion").value,
      telefono: document.getElementById("telefono").value,
      correo: document.getElementById("correo").value,
      socio_gerente: document.getElementById("socio_gerente").checked,
    };
    fetch("http://localhost:3001/socios/sociosCrear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(socio),
    })
      .then((response) => {
        if (handleResponse(response)) {
          alert(`Agregado correctamente, DNI: ${socio.dni}`);
        }
      })
      .catch((err) => console.error("Error:", err));
  });

// Función para buscar el socio a actulizar
document
  .getElementById("updateSocioFormById")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    fetch(
      `http://localhost:3001/socios/${
        document.getElementById("updateDni").value
      }`
    )
      .then((data) => {
        if (handleResponse(data)) {
          data.json().then((data) => {            
            document.getElementById("dontExist").innerHTML = "";
            document.getElementById("updateSocioForm").hidden = false;
            document.getElementById("updateDni").readOnly = true;
            document.getElementById("updateNombre").value =
              data.APELLIDO_NOMBRE || "N/A";
            document.getElementById("updateDireccion").value =
              data.DIRECCION || "N/A";
            document.getElementById("updateTelefono").value =
              data.TELEFONO || "N/A";
            document.getElementById("updateCorreo").value =
              data.CORREO || "N/A";
            document.getElementById("updateSocioGerente").checked =
              data.SOCIO_GERENTE;
          });
        } else {
          document.getElementById("dontExist").innerHTML =
            "<br>EL SOCIO NO EXISTE</br>";
        }
      })
      .catch((err) => console.error("Error", err));
  });

// Función para modificar un socio
document
  .getElementById("updateSocioForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const socio = {};
    const dni = document.getElementById("updateDni").value;
    const apellido_nombre = document.getElementById(
      "updateNombre"
    ).value;
    const direccion = document.getElementById("updateDireccion").value;
    const telefono = document.getElementById("updateTelefono").value;
    const correo = document.getElementById("updateCorreo").value;
    const socio_gerente = document.getElementById("updateSocioGerente").checked;
    if (dni) socio.dni = dni;
    if (apellido_nombre) socio.apellido_nombre = apellido_nombre;
    if (direccion) socio.direccion = direccion;
    if (telefono) socio.telefono = telefono;
    if (correo) socio.correo = correo;
    socio.socio_gerente = socio_gerente;
    fetch(`http://localhost:3001/socios/${dni}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(socio),
    })
      .then((response) => {
        if (handleResponse(response)) {
          alert(`Modificado correctamente, DNI: ${dni}`);
        }
      })
      .catch((err) => console.error("Error:", err));
  });

// Función para eliminar un socio
document
  .getElementById("deleteSocioForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const dni = document.getElementById("deleteId").value;
    if (!dni) {
      console.error("El DNI es requerido para eliminar un socio.");
      return;
    }
    fetch(`http://localhost:3001/socios/${dni}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (handleResponse(response)) {
          alert(`Eliminado correctamente, ID: ${dni}`);
        }
      })
      .catch((err) => console.error("Error:", err));
  });
