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
    cargarMarcasYTipos(
      "marcaSelect",
      "tipoSelect",
      "idMarcaOculto",
      "idTipoHardOculto"
    );
    mainMenu.style.display = "none";
    hardwareMenu.style.display = "block";
  });

  document
    .getElementById("hardwareBuscarButton")
    .addEventListener("click", () => {
      cargarMarcasYTipos(
        "marcaSelect",
        "tipoSelect",
        "idMarcaOculto",
        "idTipoHardOculto"
      );
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

  // Función para obtener todos los registros para hardware
  function fetchAllHardware(url, formId, responseDivId, fieldParam, dataParam) {
    document
      .getElementById(formId)
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        try {
          const response = await fetch(url);
          const result = await response.json();
          if (Array.isArray(result) && result.length > 0) {
            const responseDiv = document.getElementById(responseDivId);
            const html = await Promise.all(
              result.map(async (item) => {
                if (formId === "getAllHardwareForm") {
                  const marcaDescripcion = await getMarcaDescripcion(
                    item.ID_Marca
                  );
                  const tipoHardwareDescripcion =
                    await getTipoHardwareDescripcion(item.ID_Tipohard);
                  return `
              <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                <p>ID Hardware: ${item.ID_Hard}</p>
                <p>Marca: ${marcaDescripcion}</p>
                <p>Tipo de Hardware: ${tipoHardwareDescripcion}</p>
                <p>Características: ${item.CARACTERISTICAS}</p>
                <p>Precio Unitario: ${item.PRECIO_UNITARIO}</p>
                <p>Unidades Disponibles: ${item.UNIDADES_DISPONIBLES}</p>
              </div>
            `;
                } else {
                  return `
              <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                ${Object.entries(item)
                  .map(([key, value]) => `<p>${key}: ${value}</p>`)
                  .join("")}
              </div>
            `;
                }
              })
            );
            responseDiv.innerHTML = html.join("");
          } else {
            document.getElementById(
              responseDivId
            ).innerHTML = `<div>No se encontraron resultados.</div>`;
          }
        } catch (err) {
          console.error("Error:", err);
        }
      });
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
  fetchAllHardware(
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

  // Función para la carga de marcas y tipos de hardware
  async function cargarMarcasYTipos(
    selectMarca,
    selectTipoHard,
    idOcultoMarca,
    idOcultoTipoHard
  ) {
    try {
      // Fetch para obtener marcas
      const marcasResponse = await fetch("http://localhost:3001/marca");
      const marcas = await marcasResponse.json();

      // Fetch para obtener tipos de hardware
      const tiposResponse = await fetch("http://localhost:3001/tipohardware");
      const tipos = await tiposResponse.json();

      // Rellenar el campo de selección de marcas
      const marcaSelect = document.getElementById(selectMarca);
      marcaSelect.innerHTML = ""; // Limpiar opciones anteriores
      marcas.forEach((marca) => {
        const option = document.createElement("option");
        option.value = marca.ID_Marca; // El ID de la marca
        option.textContent = marca.DESCRIPCION; // El nombre de la marca
        marcaSelect.appendChild(option);
      });

      // Rellenar el campo de selección de tipos de hardware
      const tipoSelect = document.getElementById(selectTipoHard);
      tipoSelect.innerHTML = ""; // Limpiar opciones anteriores
      tipos.forEach((tipo) => {
        const option = document.createElement("option");
        option.value = tipo.ID_Tipohard; // El ID del tipo de hardware
        option.textContent = tipo.DESCRIPCION; // La descripción del tipo de hardware
        tipoSelect.appendChild(option);
      });

      // Configurar los valores de los elementos ocultos con la primera opción por defecto
      if (marcaSelect.options.length > 0) {
        document.getElementById(idOcultoMarca).value =
          marcaSelect.options[0].value;
      }
      if (tipoSelect.options.length > 0) {
        document.getElementById(idOcultoTipoHard).value =
          tipoSelect.options[0].value;
      }
    } catch (error) {
      console.error("Error al cargar marcas o tipos de hardware:", error);
    }
  }

  // Función para crear registros
  function createRecord(url, formId, fields) {
    document
      .getElementById(formId)
      .addEventListener("submit", function (event) {
        event.preventDefault();
        const record = {};
        fields.forEach((field) => {
          record[field] = document.getElementById(field).value;
        });

        // Obtener los IDs ocultos de marca y tipo de hardware seleccionados
        record.id_marca = document.getElementById("idMarcaOculto").value;
        record.id_tipohard = document.getElementById("idTipoHardOculto").value;

        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        })
          .then((response) => {
            if (response.ok) {
              alert("Agregado correctamente");
              document.getElementById(formId).reset();
            } else {
              alert("Error al agregar el registro");
            }
          })
          .catch((err) => console.error("Error:", err));
      });
  }

  // Manejo de selección para actualizar los elementos ocultos con los IDs correspondientes
  document
    .getElementById("marcaSelect")
    .addEventListener("change", function () {
      const selectedOption = this.options[this.selectedIndex];
      document.getElementById("idMarcaOculto").value = selectedOption.value;
    });

  document.getElementById("tipoSelect").addEventListener("change", function () {
    const selectedOption = this.options[this.selectedIndex];
    document.getElementById("idTipoHardOculto").value = selectedOption.value;
  });

  // Llamada a la función createRecord para agregar hardware
  createRecord(
    "http://localhost:3001/hardware/hardwareCrear",
    "createHardwareForm",
    ["caracteristicas", "precio_unitario", "unidades_disponibles"]
  );

  //Funcion para agregar marca y tipoHard

  function crearRecord(url, formId, fields) {
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
  crearRecord(
    "http://localhost:3001/tipohardware/tipoHardwareCrear",
    "createTipoHardwareForm",
    ["descripcionTipoHardware"]
  );
  crearRecord("http://localhost:3001/marca/marcaCrear", "createMarcaForm", [
    "nombreMarca",
  ]);

  // Función para obtener la descripción de la marca
  async function getMarcaDescripcion(idMarca) {
    const response = await fetch(`http://localhost:3001/marca/${idMarca}`);
    const data = await response.json();
    return data[0]?.DESCRIPCION || "Descripción no encontrada";
  }

  // Función para obtener la descripción del tipo de hardware
  async function getTipoHardwareDescripcion(idTipoHardware) {
    const response = await fetch(
      `http://localhost:3001/tipohardware/${idTipoHardware}`
    );
    const data = await response.json();
    return data[0]?.DESCRIPCION || "Descripción no encontrada";
  }

  // Función para buscar un registro por campo
  function fetchByField(url, formId, responseDivId, fieldParam, dataParam) {
    document
      .getElementById(formId)
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        const field = document.getElementById(fieldParam).value;
        const dataValue = document.getElementById(dataParam).value;
        try {
          const response = await fetch(`${url}/buscar/${field}/${dataValue}`);
          const result = await response.json();
          if (Array.isArray(result) && result.length > 0) {
            const responseDiv = document.getElementById(responseDivId);
            const html = await Promise.all(
              result.map(async (item) => {
                if (formId === "getHardwareByField") {
                  const marcaDescripcion = await getMarcaDescripcion(
                    item.ID_Marca
                  );
                  const tipoHardwareDescripcion =
                    await getTipoHardwareDescripcion(item.ID_Tipohard);
                  return `
              <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                <p>ID Hardware: ${item.ID_Hard}</p>
                <p>Marca: ${marcaDescripcion}</p>
                <p>Tipo de Hardware: ${tipoHardwareDescripcion}</p>
                <p>Características: ${item.CARACTERISTICAS}</p>
                <p>Precio Unitario: ${item.PRECIO_UNITARIO}</p>
                <p>Unidades Disponibles: ${item.UNIDADES_DISPONIBLES}</p>
              </div>
            `;
                } else {
                  return `
              <div style="border: 1px solid #ccc; padding: 10px; margin: 5px;">
                ${Object.entries(item)
                  .map(([key, value]) => `<p>${key}: ${value}</p>`)
                  .join("")}
              </div>
            `;
                }
              })
            );
            responseDiv.innerHTML = html.join("");
          } else {
            document.getElementById(
              responseDivId
            ).innerHTML = `<div>No se encontraron resultados.</div>`;
          }
        } catch (err) {
          console.error("Error:", err);
        }
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

  // Función para buscar un registro por ID y mostrar el formulario de actualización
  function fetchByIdHardware(url, formId, updateFormId, updateId, fields) {
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

          .then(async (data) => {
            document.getElementById("dontExist").innerHTML = "";
            const updateForm = document.getElementById(updateFormId);
            console.log(updateForm);

            if (updateForm) {
              updateForm.hidden = false; // Mostrar el formulario de actualización
            }
            const updateIdField = document.getElementById(updateId);
            if (updateIdField) {
              updateIdField.readOnly = true; // Bloquear el campo de ID
            }
            console.log(updateForm);
            // Cargar marcas y tipos de hardware
            await cargarMarcasYTipos(
              "marcaSelectUpdate",
              "tipoSelectUpdate",
              "idMarcaOcultoUpdate",
              "idMarcaOcultoUpdate"
            );

            // Establecer los valores en el formulario
            fields.forEach((field) => {
              const element = document.getElementById(field);
              if (element) {
                element.value = data[field] || "";
              }
            });

            // Seleccionar la marca y el tipo de hardware del registro
            const marcaSelect = document.getElementById("marcaSelectUpdate");
            if (marcaSelect) {
              marcaSelect.value = data.ID_Marca || "";
              document.getElementById("idMarcaOcultoUpdate").value =
                data.ID_Marca || "";
            }
            const tipoSelect = document.getElementById("tipoSelectUpdate");
            if (tipoSelect) {
              tipoSelect.value = data.ID_Tipohard || "";
              document.getElementById("idTipoHardOcultoUpdate").value =
                data.ID_Tipohard || "";
            }
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
  function updateRecordHardware(url, formId, fields, updateId, updateFormId) {
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
        const id_hard = idElement.value; // Utilizar 'id_hard' para que coincida con el controlador

        // Obtener los valores de los campos de tipo y marca
        const tipoSelect = document.getElementById("tipoSelectUpdate");
        const marcaSelect = document.getElementById("marcaSelectUpdate");
        if (tipoSelect && tipoSelect.value) {
          record.ID_Tipohard = tipoSelect.value; // Asignar el ID del tipo de hardware
        }
        if (marcaSelect && marcaSelect.value) {
          record.ID_Marca = marcaSelect.value; // Asignar el ID de la marca
        }

        // Recorrer los campos adicionales y asignar al objeto 'record'
        fields.forEach((field) => {
          const element = document.getElementById(field);
          if (element) {
            const value = element.value;
            if (value) {
              switch (field) {
                case "updateCaracteristicas":
                  record.CARACTERISTICAS = value;
                  break;
                case "updatePrecioUnitario":
                  record.PRECIO_UNITARIO = value;
                  break;
                case "updateUnidadesDisponibles":
                  record.UNIDADES_DISPONIBLES = value;
                  break;
                default:
                  record[field] = value;
              }
            }
          }
        });

        // Enviar la solicitud PATCH al servidor con el objeto 'record'
        fetch(`${url}/${id_hard}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        })
          .then((response) => {
            if (handleResponse(response, formId)) {
              alert("Actualizado correctamente");
              location.reload();
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
              return alert("El id solicitado no existe");
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
              location.reload();
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
  fetchByIdHardware(
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

  updateRecordHardware(
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
});

// Eliminar
async function eliminarMarca() {
  document
    .getElementById("deleteMarcaForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
    });

  const id_marca = document.getElementById("deleteIdMarca").value;
  if (!id_marca) {
    alert("Por favor, ingrese un ID de marca válido.");
    return;
  }

  try {
    // Verificar si el registro existe
    const registroResponse = await fetch(
      `http://localhost:3001/marca/${id_marca}`
    );

    if (!registroResponse.ok) {
      alert("No se encuentra la id solicitada");
      return;
    }

    // Verificar dependencias
    const response = await fetch(
      `http://localhost:3001/marca/verificarDependencias/${id_marca}`
    );
    const dependencies = await response.json();

    if (dependencies.length > 0) {
      // Mostrar diálogo de confirmación
      const confirmDelete = confirm(
        "La marca tiene dependencias. ¿Desea eliminar la marca y todas sus dependencias?"
      );

      if (confirmDelete) {
        // Si el usuario acepta, eliminar con confirmación
        await fetch(
          `http://localhost:3001/marca/eliminarConConfirmacion/${id_marca}`,
          {
            method: "DELETE",
          }
        );
        alert("Marca y dependencias eliminadas correctamente.");
      } else {
        alert("Eliminación cancelada.");
      }
    } else {
      await fetch(`http://localhost:3001/marca/${id_marca}`, {
        method: "DELETE",
      });
      alert("Marca eliminada correctamente.");
    }
  } catch (error) {
    alert("Error al eliminar la marca.");
    console.error(error);
  }
}

async function eliminarTipoHardware() {
  document
    .getElementById("deleteTipoHardwareForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
    });

  const id_tipoHardware = document.getElementById("deleteIdTipoHardware").value;
  if (!id_tipoHardware) {
    alert("Por favor, ingrese un ID de Tipo Hardware valido.");
    return;
  }

  try {
    const registroResponse = await fetch(
      `http://localhost:3001/tipohardware/${id_tipoHardware}`
    );

    if (!registroResponse.ok) {
      alert("No se encuentra la id solicitada");
      return;
    }

    // Verificar dependencias
    const response = await fetch(
      `http://localhost:3001/tipoHardware/verificarDependencias/${id_tipoHardware}`
    );
    const dependencies = await response.json();

    if (dependencies.length > 0) {
      const confirmDelete = confirm(
        "La marca tiene dependencias. ¿Desea eliminar el tipoHardware y todas sus dependencias?"
      );

      if (confirmDelete) {
        await fetch(
          `http://localhost:3001/tipohardware/eliminarConConfirmacion/${id_tipoHardware}`,
          {
            method: "DELETE",
          }
        );
        alert("Tipo Hardware y sus dependencias eliminadas correctamente.");
      } else {
        alert("Eliminación cancelada.");
      }
    } else {
      await fetch(`http://localhost:3001/tipohardware/${id_tipoHardware}`, {
        method: "DELETE",
      });
      alert("Tipo Hardware eliminado correctamente.");
    }
  } catch (error) {
    alert("Error al eliminar el Tipo Hardware.");
    console.error(error);
  }
}

function eliminarHardware() {
  document
    .getElementById("deleteHardwareForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();
    });
  let url = "http://localhost:3001/hardware";
  let formId = "deleteHardwareForm";
  document.getElementById(formId).addEventListener("submit", function (event) {
    event.preventDefault();
    const id = document.getElementById("deleteIdHardware").value;
    fetch(`${url}/${id}`, { method: "DELETE" })
      .then((response) => {
        if (!response.ok) {
          alert("No se encuentra el ID solicitado");
          throw new Error("El ID no existe");
        } else {
          alert("Eliminado correctamente");
          document.getElementById(formId).reset();
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  });
}
