document.addEventListener("DOMContentLoaded", () => {
  const mainMenu = document.getElementById("main-menu");
  const marcaMenu = document.getElementById("marcaMenu");
  const tipoHardwareMenu = document.getElementById("tipoHardwareMenu");
  const hardwareMenu = document.getElementById("hardwareMenu");

  document.getElementById("marcaButton").addEventListener("click", () => {
    mainMenu.style.display = "none";
    marcaMenu.style.display = "block";
  });

  document
    .getElementById("tipoHardwareButton")
    .addEventListener("click", () => {
      mainMenu.style.display = "none";
      tipoHardwareMenu.style.display = "block";
    });

  document.getElementById("hardwareButton").addEventListener("click", () => {
    mainMenu.style.display = "none";
    hardwareMenu.style.display = "block";
  });

  // Función para manejar la respuesta de la API
  function handleResponse(response, responseDivId) {
    const responseDiv = document.getElementById(responseDivId);
    responseDiv.innerHTML = ""; // Limpiar el contenido anterior
    if (!response.ok) {
      response.text().then((text) => {
        responseDiv.innerHTML = `<div style="color: red;">Error: ${response.status} - ${text}</div>`;
      });
      return false; // Hubo un error
    }
    return true; // Respuesta correcta
  }

  // Función para obtener todos los registros
  function fetchAll(url, formId, responseDivId) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const responseDiv = document.getElementById(responseDivId);
            const html = data
              .map(
                (item) => `
                <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                  ${Object.entries(item)
                    .map(([key, value]) => `<p>${key}: ${value}</p>`)
                    .join("")}
                </div>
              `
              )
              .join("");
            responseDiv.innerHTML = html;
          })
          .catch((err) => console.error("Error:", err));
      });
  }

  // Obtener todos los registros
  fetchAll(
    "http://localhost:3001/hardware",
    "getAllHardwareForm",
    "hardwareResponse"
  );
  fetchAll(
    "http://localhost:3001/tipohardware",
    "getAllTipoHardwareForm",
    "tipoHardwareResponse"
  );
  fetchAll("http://localhost:3001/marca", "getAllMarcaForm", "marcaResponse");

  // Función para agregar un registro
  function createRecord(url, formId, fields) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const record = {};
        fields.forEach((field) => {
          record[field] = document.getElementById(field).value;
        });
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        })
          .then((response) => {
            alert("Agregado correctamente");
            document.getElementById(formId).reset();
          })
          .catch((err) => console.error("Error:", err));
      });
  }

  // Agregar registros
  createRecord(
    "http://localhost:3001/tipohardware/tipoHardwareCrear",
    "createTipoHardwareForm",
    ["descripcionTipoHardware"]
  );
  createRecord("http://localhost:3001/marca/marcaCrear", "createMarcaForm", [
    "nombreMarca",
  ]);
  createRecord("http://localhost:3001/hardware", "createHardwareForm", [
    "id_tipohard",
    "id_marca",
    "caracteristicas",
    "precio_unitario",
    "unidades_disponibles",
  ]);

  // Función para buscar un registro por campo
  function fetchByField(url, formId, responseDivId, fieldParam, dataParam) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const field = document.getElementById(fieldParam).value;
        const data = document.getElementById(dataParam).value;
        fetch(`${url}/buscar/${field}/${data}`)
          .then((response) => response.json())
          .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
              const responseDiv = document.getElementById(responseDivId);
              const html = data
                .map(
                  (item) => `
                <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                ${Object.entries(item)
                  .map(([key, value]) => `<p>${key}: ${value}</p>`)
                  .join("")}
                  </div>
                  `
                )
                .join("");
              responseDiv.innerHTML = html;
            } else {
              document.getElementById(
                responseDivId
              ).innerHTML = `<div>No se encontraron resultados.</div>`;
            }
          })
          .catch((err) => console.error("Error:", err));
      });
  }

  // Buscar registros por campo
  fetchByField(
    "http://localhost:3001/hardware",
    "getHardwareByField",
    "hardwareResponse",
    "fieldHardware",
    "dataHardware"
  );
  fetchByField(
    "http://localhost:3001/tipohardware",
    "getTipoHardwareByField",
    "tipoHardwareResponse",
    "fieldTipoHardware",
    "dataTipoHardware"
  );
  fetchByField(
    "http://localhost:3001/marca",
    "getMarcaByField",
    "marcaResponse",
    "fieldMarca",
    "dataMarca"
  );

  // Buscar registros por ID
  fetchById(
    "http://localhost:3001/hardware",
    "updateHardwareFormById",
    "updateHardwareForm",
    [
      "updateTipohard",
      "updateMarca",
      "updateCaracteristicas",
      "updatePrecioUnitario",
      "updateUnidadesDisponibles",
    ]
  );
  fetchById(
    "http://localhost:3001/tipohardware",
    "updateTipoHardFormById",
    "updateTipoHardForm",
    ["updateDescripcionTipoHardware"]
  );
  fetchById(
    "http://localhost:3001/marca",
    "updateMarcaFormById",
    "updateMarcaForm",
    ["updateNombreMarca"]
  );

  // Función para buscar un registro por ID y mostrar el formulario de actualización
  function fetchById(url, formId, updateFormId, updateId, fields) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById(updateId).value;
        fetch(`${url}/${id}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Registro no encontrado");
            }
            return response.json();
          })
          .then((data) => {
            document.getElementById("dontExist").innerHTML = "";
            const updateForm = document.getElementById(updateFormId);
            if (updateForm) {
              updateForm.hidden = false; // Mostrar el formulario de actualización
            }
            const updateIdField = document.getElementById(updateId);
            if (updateIdField) {
              updateIdField.readOnly = true; // Bloquear el campo de ID
            }
            fields.forEach((field) => {
              const element = document.getElementById(field);
              if (element) {
                element.value = data[field] || "";
              }
            });
          })
          .catch((err) => {
            document.getElementById("dontExist").innerHTML =
              "<br>El registro no existe</br>";
            const updateForm = document.getElementById(updateFormId);
            if (updateForm) {
              updateForm.hidden = true; // Ocultar el formulario si no se encuentra el registro
            }
            const updateIdField = document.getElementById(updateId);
            if (updateIdField) {
              updateIdField.readOnly = false; // Desbloquear el campo de ID
            }
          });
      });
  }

  // Función para actualizar un registro
  function updateRecord(url, formId, fields, updateId, updateFormId) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const record = {};
        const idElement = document.getElementById(updateId);
        if (!idElement) {
          console.error("El campo ID no existe.");
          return;
        }
        const id = idElement.value;
        fields.forEach((field) => {
          const element = document.getElementById(field);
          if (element) {
            const value = element.value;
            if (value) {
              record[field] = value;
            }
          }
        });
        fetch(`${url}/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        })
          .then((response) => {
            if (handleResponse(response, formId)) {
              alert("Actualizado correctamente");
              location.reload()
              idElement.readOnly = false;
              const updateForm = document.getElementById(updateFormId);
              if (updateForm) {
                updateForm.reset(); // Restablecer los campos del formulario
              }
            }
          })
          .catch((err) => console.error("Error:", err));
      });
  }

  // Buscar y actualizar registros
  fetchById(
    "http://localhost:3001/hardware",
    "updateHardwareFormById",
    "updateHardwareForm",
    "updateIdHardware",
    [
      "updateTipohard",
      "updateMarca",
      "updateCaracteristicas",
      "updatePrecioUnitario",
      "updateUnidadesDisponibles",
    ]
  );
  fetchById(
    "http://localhost:3001/tipohardware",
    "updateTipoHardFormById",
    "updateTipoHardForm",
    "updateIdTipoHardware",
    ["updateDescripcionTipoHardware"]
  );
  fetchById(
    "http://localhost:3001/marca",
    "updateMarcaFormById",
    "updateMarcaForm",
    "updateIdMarca",
    ["updateNombreMarca"]
  );

  updateRecord(
    "http://localhost:3001/hardware",
    "updateHardwareForm",
    [
      "updateTipohard",
      "updateMarca",
      "updateCaracteristicas",
      "updatePrecioUnitario",
      "updateUnidadesDisponibles",
    ],
    "updateIdHardware",
    "updateHardwareFormById"
  );
  updateRecord(
    "http://localhost:3001/tipohardware",
    "updateTipoHardForm",
    ["updateDescripcionTipoHardware"],
    "updateIdTipoHardware",
    "updateTipoHardFormById"
  );
  updateRecord(
    "http://localhost:3001/marca",
    "updateMarcaForm",
    ["updateNombreMarca"],
    "updateIdMarca",
    "updateMarcaFormById"
  );

  // Función para eliminar un registro con verificación de dependencias
  function deleteRecord(url, formId) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("deleteId").value;
        fetch(`${url}/${id}`, { method: "DELETE" })
          .then((response) => {
            if (!response.ok) {
              throw new Error(
                `Error: ${response.status} - ${response.statusText}`
              );
            }
            return response.text(); // Cambiar a text() en lugar de json()
          })
          .then(() => {
            alert("Eliminado correctamente");
            document.getElementById(formId).reset(); // Limpiar el formulario después de eliminar
          })
          .catch((err) => {
            console.error("Error:", err);
            alert(err.message); // Mostrar el mensaje de error en una alerta
          });
      });
  }

  // Eliminar registros
  deleteRecord("http://localhost:3001/hardware", "deleteHardwareForm");
  deleteRecord("http://localhost:3001/tipohardware", "deleteTipoHardwareForm");
  deleteRecord("http://localhost:3001/marca", "deleteMarcaForm");
});
