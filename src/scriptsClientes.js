// Función para manejar la respuesta de la API
function handleResponse(response) {
  if (!response.ok) {
    response.text().then((text) => {
      document.getElementById(
        "response"
      ).innerText = `Error: ${response.status} - ${text}`;
    });
  } else {
    response
      .json()
      .then((data) => {
        document.getElementById("response").innerText = JSON.stringify(
          data,
          null,
          2
        );
      })
      .catch((err) => console.error("Error en la respuesta:", err));
  }
}

// Función para obtener todos los clientes
document
  .getElementById("getAllClientesForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    fetch("http://localhost:3001/clientes/clientes")
      .then(handleResponse)
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
    console.log(cliente);

    fetch("http://localhost:3001/clientes/clientesCrear", { // Cambiar a la ruta correcta
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    })
      .then(handleResponse)
      .catch((err) => console.error("Error:", err));
  });

// Función para actualizar un cliente
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

    // Agregar solo si no estan vacios
    if (dni) cliente.dni = dni;
    if (cuit) cliente.cuit = cuit;
    if (nombre) cliente.nombre = nombre;
    if (direccion) cliente.direccion = direccion;
    if (telefono) cliente.telefono = telefono;
    if (correo) cliente.correo = correo;

    const id = document.getElementById("updateId").value;

    fetch(`http://localhost:3001/clientes/clientes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    })
      .then(handleResponse)
      .catch((err) => console.error("Error:", err));
  });

// Función para eliminar un cliente
document
  .getElementById("deleteClienteForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const id = document.getElementById("deleteId").value;

    if (!id) {
      console.error("El ID es requerido para eliminar un cliente.");
      return;
    }

    fetch(`http://localhost:3001/clientes/clientes/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          document.getElementById(
            "response"
          ).innerText = `Cliente con ID ${id} eliminado correctamente.`;
        } else {
          response.text().then((text) => {
            document.getElementById(
              "response"
            ).innerText = `Error: ${response.status} - ${text}`;
          });
        }
      })
      .catch((err) => console.error("Error:", err));
  });
