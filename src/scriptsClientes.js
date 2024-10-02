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

// Función para obtener todos los clientes
document
  .getElementById("getAllClientesForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    fetch("http://localhost:3001/clientes/clientes")
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
              (cliente) => `
          <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
            <p>DNI: ${cliente.DNI || "N/A"}</p>
            <p>Nombre: ${cliente.NOMBRE || "N/A"}</p>
            <p>CUIT: ${cliente.CUIT || "N/A"}</p>
            <p>Teléfono: ${cliente.TELEFONO || "N/A"}</p>
            <p>Correo: ${cliente.CORREO || "N/A"}</p>
          </div>
        `
            )
            .join("");
          responseDiv.innerHTML = html; // Muestra los clientes en el div
        } else {
          document.getElementById(
            "response"
          ).innerHTML = `<div>No se encontraron clientes.</div>`;
        }
      })
      .catch((err) => console.error("Error:", err));
  });

// Función para obtener clientes por un campo específico
document
  .getElementById("getClientesByField")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const field = document.getElementById("field").value;
    const data = document.getElementById("data").value;

    if (!data) {
      document.getElementById("response").innerHTML = `<div>Por favor, ingresa un valor para buscar.</div>`;
      return;
    }

    fetch(`http://localhost:3001/clientes/clientes/buscar/campo?field=${field}&data=${data}`)
      .then((response) => {
        if (response) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        if (Array.isArray(data) && data.length > 0) {

          const responseDiv = document.getElementById("response");
          const html = data
            .map(
              (cliente) => `
            <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
              <p>DNI: ${cliente.DNI || "N/A"}</p>
              <p>Nombre: ${cliente.NOMBRE || "N/A"}</p>
              <p>CUIT: ${cliente.CUIT || "N/A"}</p>
              <p>Teléfono: ${cliente.TELEFONO || "N/A"}</p>
              <p>Correo: ${cliente.CORREO || "N/A"}</p>
              <p>Dirección: ${cliente.DIRECCION || "N/A"}</p>
            </div>
          `
            )
            .join("");
          responseDiv.innerHTML = html;
        } else {
          document.getElementById("response").innerHTML = `<div>No se encontraron clientes.</div>`;
        }
      })
      .catch((err) => console.error("Error:", err));
  });

// Función para agregar un cliente
document
  .getElementById("createClienteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const cliente = {
      dni: document.getElementById("dni").value,
      cuit: document.getElementById("cuit").value,
      nombre: document.getElementById("nombre").value,
      direccion: document.getElementById("direccion").value,
      telefono: document.getElementById("telefono").value,
      correo: document.getElementById("correo").value,
    };

    fetch("http://localhost:3001/clientes/clientesCrear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    })
      .then((response) => {
        if (handleResponse(response)) {
          alert(`Agregado correctamente, DNI: ${cliente.dni}`);
        }
      })
      .catch((err) => console.error("Error:", err));
  });

// Función para actualizar un cliente
document
  .getElementById("updateClienteFormById")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    fetch(
      `http://localhost:3001/clientes/clientes/${document.getElementById("updateDni").value
      }`
    )
      .then((data) => {
        if (handleResponse(data)) {
          data.json().then((data) => {
            document.getElementById("dontExist").innerHTML = "";
            document.getElementById("updateClienteForm").hidden = false;
            document.getElementById("updateDni").readOnly = true;
            document.getElementById("updateCuit").value = data.CUIT || "N/A";
            document.getElementById("updateNombre").value =
              data.NOMBRE || "N/A";
            document.getElementById("updateDireccion").value =
              data.DIRECCION || "N/A";
            document.getElementById("updateTelefono").value =
              data.TELEFONO || "N/A";
            document.getElementById("updateCorreo").value =
              data.CORREO || "N/A";
          });
        } else {
          document.getElementById("dontExist").innerHTML =
            "<br>EL CLIENTE NO EXISTE</br>";
        }
      })
      .catch((err) => console.log("Error", err));
  });

// Función para modificar un cliente
document
  .getElementById("updateClienteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const cliente = {};
    const dni = document.getElementById("updateDni").value;
    const cuit = document.getElementById("updateCuit").value;
    const nombre = document.getElementById("updateNombre").value;
    const direccion = document.getElementById("updateDireccion").value;
    const telefono = document.getElementById("updateTelefono").value;
    const correo = document.getElementById("updateCorreo").value;

    if (dni) cliente.dni = dni;
    if (cuit) cliente.cuit = cuit;
    if (nombre) cliente.nombre = nombre;
    if (direccion) cliente.direccion = direccion;
    if (telefono) cliente.telefono = telefono;
    if (correo) cliente.correo = correo;

    fetch(`http://localhost:3001/clientes/clientes/${dni}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    })
      .then((response) => {
        if (handleResponse(response)) {
          alert(`Modificado correctamente, DNI: ${dni}`);
        }
      })
      .catch((err) => console.error("Error:", err));
  });

// Función para eliminar un cliente
document
  .getElementById("deleteClienteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const dni = document.getElementById("deleteId").value;

    if (!dni) {
      console.error("El DNI es requerido para eliminar un cliente.");
      return;
    }

    fetch(`http://localhost:3001/clientes/clientes/${dni}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (handleResponse(response)) {
          alert(`Eliminado correctamente, DNI: ${dni}`);
        }
      })
      .catch((err) => console.error("Error:", err));
  });
