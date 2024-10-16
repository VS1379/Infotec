document.addEventListener("DOMContentLoaded", function () {
  cargarPedidos();
});

function cargarPedidos() {
  fetch("http://localhost:3001/pedidos")
    .then((response) => response.json())
    .then((data) => {
      const pedidoSelect = document.getElementById("pedido");
      const clientePromises = [];

      data.forEach((pedido) => {
        const clientePromise = fetch(
          `http://localhost:3001/clientes/${pedido.IDCliente}`
        )
          .then((clienteResponse) => clienteResponse.json())
          .then((clienteData) => {
            const nombreCliente =
              clienteData?.NOMBRE || "Cliente no encontrado";
            const dniCliente = clienteData?.DNI || "DNI no encontrado";
            const option = document.createElement("option");
            option.value = pedido.IDPedido;
            option.textContent = `DNI: ${dniCliente} - Nombre: ${nombreCliente}`;
            pedidoSelect.appendChild(option);
          })
          .catch((error) => console.error("Error al cargar cliente:", error));

        clientePromises.push(clientePromise);
      });
      Promise.all(clientePromises).then(() => {
        // Escuchar cambios en el select para cargar detalles del pedido
        pedidoSelect.addEventListener("change", (event) => {
          const selectedId = event.target.value;
          if (selectedId) {
            cargarDetallesPedido(selectedId);
            // Almacenar ID del pedido y del cliente en los hidden inputs
            const selectedOption =
              pedidoSelect.options[pedidoSelect.selectedIndex];
            document.getElementById("pedidoId").value = selectedId;
            // Asumiendo que tienes una manera de obtener el clienteId desde el pedido
            document.getElementById("clienteId").value =
              selectedOption.dataset.clienteId; // Asegúrate de agregar esta data en la opción si es necesario
          }
        });
      });
    })
    .catch((error) => console.error("Error al cargar los pedidos:", error));
}

function cargarDetallesPedido(pedidoId) {
  fetch(`http://localhost:3001/detallepedidos/${pedidoId}`)
    .then((response) => response.json())
    .then((detalles) => {
      let i = 0;
      const grillaHardware = document
        .getElementById("detallesVenta")
        .querySelector("tbody");
      grillaHardware.innerHTML = "";

      detalles.forEach((detalle) => {
        fetch(`http://localhost:3001/hardware/${detalle.IDHard}`)
          .then((hardwareResponse) => hardwareResponse.json())
          .then((hardware) => {
            // Asegúrate de que hardware sea un array y tiene elementos
            if (Array.isArray(hardware) && hardware.length > 0) {
              
              hardware.forEach((item) => {
                // Recorrer cada hardware
                const row = grillaHardware.insertRow();
                row.setAttribute("data-id", item.ID_Hard); // Guardamos el ID del hardware en la fila
                i++;
                let row0 = row.insertCell(0);
                row0.textContent = i;
                const tipoCell = row.insertCell(1);
                const marcaCell = row.insertCell(2);
                const caracteristicasCell = row.insertCell(3);
                const cantidadCell = row.insertCell(4);
                const precioCell = row.insertCell(5);
                row.insertCell(6);
                const modificarCell = row.insertCell(7); // Nueva celda para modificar
                const eliminarCell = row.insertCell(8);

                tipoCell.textContent = item.ID_Tipohard; // Cambiar según cómo quieras mostrar
                marcaCell.textContent = item.ID_Marca; // Cambiar según cómo quieras mostrar
                caracteristicasCell.textContent = item.CARACTERISTICAS;

                // Verificación antes de mostrar el precio
                precioCell.textContent =
                  item.PRECIO_UNITARIO && !isNaN(item.PRECIO_UNITARIO)
                    ? parseFloat(item.PRECIO_UNITARIO).toFixed(2)
                    : "N/A"; // O cualquier valor por defecto que desees mostrar

                cantidadCell.textContent = detalle.Cantidad;

                // Crear botón de eliminar
                const eliminarBtn = document.createElement("button");
                eliminarBtn.textContent = "Eliminar";
                eliminarBtn.onclick = function () {
                  eliminarItem(detalle.IDHard, row);
                };
                eliminarCell.appendChild(eliminarBtn);

                // Crear botón de modificar
                const modificarBtn = document.createElement("button");
                modificarBtn.type = "button"; // Asegúrate de que no sea un botón de tipo "submit"
                modificarBtn.textContent = "Modificar";
                modificarBtn.onclick = function () {
                  // Evitar que se cierren los campos al hacer clic
                  if (modificarBtn.dataset.editing === "true") return;

                  // Indica que se está en modo de edición
                  modificarBtn.dataset.editing = "true";

                  const inputCantidad = document.createElement("input");
                  inputCantidad.type = "number";
                  inputCantidad.value = detalle.Cantidad;
                  inputCantidad.min = 1; // Asegura que la cantidad sea positiva
                  inputCantidad.dataset.hardwareId = detalle.IDHard;

                  // Reemplaza la celda de cantidad con el campo de entrada
                  cantidadCell.innerHTML = ""; // Limpia la celda
                  cantidadCell.appendChild(inputCantidad);
                  inputCantidad.focus(); // Focaliza el campo de entrada

                  // Guardar la nueva cantidad al perder foco
                  inputCantidad.onblur = function () {
                    const nuevaCantidad = parseInt(inputCantidad.value);
                    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
                      // Actualiza la celda de cantidad en la grilla
                      cantidadCell.textContent = nuevaCantidad; // Actualiza la celda de cantidad
                      console.log(
                        `Cantidad actualizada para ID_Hard ${inputCantidad.dataset.hardwareId}: ${nuevaCantidad}`
                      );

                      // Aquí puedes agregar lógica para actualizar la base de datos si es necesario
                    } else {
                      cantidadCell.textContent = detalle.Cantidad; // Revertir al valor original si no es válido
                    }

                    // Salir del modo de edición
                    modificarBtn.dataset.editing = "false";
                  };

                  // Si presionan "Enter", guardar la cantidad y salir del campo
                  inputCantidad.onkeypress = function (e) {
                    if (e.key === "Enter") {
                      inputCantidad.blur(); // Desenfocar el campo para guardar
                    }
                  };
                };
                modificarCell.appendChild(modificarBtn);

                // Permitir la modificación de la cantidad al hacer doble clic en la fila
                row.ondblclick = function () {
                  modificarCantidad(detalle.IDHard, cantidadCell);
                };
              });
            } else {
              console.error(
                "Error: el hardware no es un array o está vacío",
                hardware
              );
            }
          })
          .catch((error) => console.error("Error al cargar hardware:", error));
      });
    })
    .catch((error) =>
      console.error("Error al cargar detalles del pedido:", error)
    );
}

function modificarCantidad(idHard, cantidadCell) {
  const nuevaCantidad = prompt(
    "Ingrese la nueva cantidad:",
    cantidadCell.textContent
  );
  if (nuevaCantidad !== null && !isNaN(nuevaCantidad)) {
    cantidadCell.textContent = nuevaCantidad;
  }
}

function eliminarItem(idHard, row) {
  const confirmacion = confirm(
    "¿Estás seguro de que deseas eliminar este item?"
  );
  if (confirmacion) {
    row.remove();
  }
}

function finalizarVenta() {
  // ... (Código existente)

  // Lógica para actualizar unidades disponibles de hardware y condición del pedido
  const detallesTable = document
    .getElementById("grillaHardware")
    .getElementsByTagName("tbody")[0];
  for (let row of detallesTable.rows) {
    const idHard = row.getAttribute("data-id");
    const cantidad = parseInt(row.cells[4].textContent); // Modifica el índice si es necesario

    // Actualiza unidades disponibles en el hardware
    fetch(`http://localhost:3001/hardware/actualizar/${idHard}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cantidadVendida: cantidad }),
    });
  }

  // Actualiza el estado del pedido
  fetch(`http://localhost:3001/pedidos/actualizar/${pedidoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ condicion: "Finalizado" }),
  });

  // ... (Código existente para registrar la venta y generar factura)
}
