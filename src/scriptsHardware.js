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
            if (handleResponse(response, formId + "Response")) {
              alert("Agregado correctamente");
            }
          })
          .catch((err) => console.error("Error:", err));
      });
  }

  // Agregar registros
  createRecord("http://localhost:3001/tipohardware", "createTipoHardwareForm", [
    "id_tipohard",
    "descripcionTipoHardware",
  ]);
  createRecord("http://localhost:3001/marca", "createMarcaForm", [
    "id_marca",
    "nombreMarca",
  ]);
  createRecord("http://localhost:3001/hardware", "createHardwareForm", [
    "id_hard",
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
    "hardwareResponse", "fieldHardware", "dataHardware"
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
    "marcaResponse", "fieldMarca", "dataMarca"
  );

  // Función para buscar un registro por ID y mostrar el formulario de actualización
  function fetchById(url, formId, updateFormId, fields) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("updateId").value;
        fetch(`${url}/${id}`)
          .then((response) => response.json())
          .then((data) => {
            if (data) {
              document.getElementById("dontExist").innerHTML = "";
              document.getElementById(updateFormId).hidden = false;
              fields.forEach((field) => {
                document.getElementById(field).value = data[field] || "";
              });
            } else {
              document.getElementById("dontExist").innerHTML =
                "<br>El registro no existe</br>";
            }
          })
          .catch((err) => console.error("Error:", err));
      });
  }

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

  // Función para actualizar un registro
  function updateRecord(url, formId, fields) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const record = {};
        const id = document.getElementById("updateId").value;
        fields.forEach((field) => {
          record[field] = document.getElementById(field).value;
        });
        fetch(`${url}/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        })
          .then((response) => {
            if (handleResponse(response, formId + "Response")) {
              alert("Actualizado correctamente");
            }
          })
          .catch((err) => console.error("Error:", err));
      });
  }

  // Actualizar registros
  updateRecord("http://localhost:3001/hardware", "updateHardwareForm", [
    "updateTipohard",
    "updateMarca",
    "updateCaracteristicas",
    "updatePrecioUnitario",
    "updateUnidadesDisponibles",
  ]);
  updateRecord("http://localhost:3001/tipohardware", "updateTipoHardForm", [
    "updateDescripcionTipoHardware",
  ]);
  updateRecord("http://localhost:3001/marca", "updateMarcaForm", [
    "updateNombreMarca",
  ]);

  // Función para eliminar un registro con verificación de dependencias
  function deleteRecord(url, formId) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const id = document.getElementById("deleteId").value;
        fetch(`${url}/${id}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.dependencias && data.dependencias.length > 0) {
              const confirmDelete = confirm(
                "Este registro tiene dependencias. ¿Desea eliminar todo?"
              );
              if (confirmDelete) {
                fetch(`${url}/${id}`, {
                  method: "DELETE",
                })
                  .then((response) => {
                    if (handleResponse(response, formId + "Response")) {
                      alert("Eliminado correctamente");
                    }
                  })
                  .catch((err) => console.error("Error:", err));
              }
            } else {
              fetch(`${url}/${id}`, {
                method: "DELETE",
              })
                .then((response) => {
                  if (handleResponse(response, formId + "Response")) {
                    alert("Eliminado correctamente");
                  }
                })
                .catch((err) => console.error("Error:", err));
            }
          })
          .catch((err) => console.error("Error:", err));
      });
  }

  // Eliminar registros
  deleteRecord("http://localhost:3001/hardware", "deleteHardwareForm");
  deleteRecord("http://localhost:3001/tipohardware", "deleteTipoHardwareForm");
  deleteRecord("http://localhost:3001/marca", "deleteMarcaForm");
});
