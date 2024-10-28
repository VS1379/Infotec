document.addEventListener("DOMContentLoaded", function () {
  cargarPedidos();
});

/*
document.addEventListener("DOMContentLoaded", () => {
  const facturaInput = document.getElementById("numeroFactura");
  const messageContainer = document.getElementById("facturaMessage");
  const submitButton = document.getElementById("submitButton");
  facturaInput.addEventListener("blur", async () => {
    const facturaNumber = facturaInput.value;
    
    messageContainer.textContent = "";

    if (facturaNumber) {
      try {
        const response = await fetch(
          `http://localhost:3001/facturaventa/${facturaNumber}`
        );

        if (!response.ok) {
          throw new Error("Error en la petición");
        }

        const data = await response.json();

        if (data) {
          messageContainer.textContent = "Nro no disponible";
          messageContainer.style.color = "red";
          submitButton.disabled = true;
        } else {
          submitButton.disabled = false;
        }
      } catch (error) {
        console.error("Error al verificar el número de factura:", error);
      }
    }
  });
});
*/
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
            if (Array.isArray(hardware) && hardware.length > 0) {
              hardware.forEach((item) => {
                const row = grillaHardware.insertRow();
                row.setAttribute("data-id", item.ID_Hard);
                i++;
                let row0 = row.insertCell(0);
                row0.textContent = i;
                const tipoCell = row.insertCell(1);
                const marcaCell = row.insertCell(2);
                const caracteristicasCell = row.insertCell(3);
                const cantidadCell = row.insertCell(4);
                const precioCell = row.insertCell(5);

                const precioTotal = row.insertCell(6);
                precioTotal.textContent =
                  parseFloat(item.PRECIO_UNITARIO).toFixed(2) *
                  detalle.Cantidad;

                console.log(detalle.Cantidad);

                const modificarCell = row.insertCell(7);
                const eliminarCell = row.insertCell(8);

                tipoCell.textContent = item.ID_Tipohard;
                marcaCell.textContent = item.ID_Marca;
                caracteristicasCell.textContent = item.CARACTERISTICAS;

                precioCell.textContent =
                  item.PRECIO_UNITARIO && !isNaN(item.PRECIO_UNITARIO)
                    ? parseFloat(item.PRECIO_UNITARIO).toFixed(2)
                    : "N/A";

                cantidadCell.textContent = detalle.Cantidad;

                // boton eliminar
                const eliminarBtn = document.createElement("button");
                eliminarBtn.textContent = "Eliminar";
                eliminarBtn.onclick = function () {
                  eliminarItem(detalle.IDHard, row);
                  cargarMontoIvaMontoTotal();
                };
                eliminarCell.appendChild(eliminarBtn);

                // boton modificar
                const modificarBtn = document.createElement("button");
                modificarBtn.type = "button";
                modificarBtn.textContent = "Modificar";
                modificarBtn.onclick = function () {
                  if (modificarBtn.dataset.editing === "true") return;
                  modificarBtn.dataset.editing = "true";

                  const inputCantidad = document.createElement("input");
                  inputCantidad.type = "number";
                  inputCantidad.value = detalle.Cantidad;
                  inputCantidad.min = 1;
                  inputCantidad.dataset.hardwareId = detalle.IDHard;
                  cantidadCell.innerHTML = ""; // Limpia la celda
                  cantidadCell.appendChild(inputCantidad);
                  inputCantidad.focus();

                  inputCantidad.onblur = function () {
                    const nuevaCantidad = parseInt(inputCantidad.value);
                    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
                      cantidadCell.textContent = nuevaCantidad;

                      // Recalcular el precio total de la fila
                      const precioUnitario = parseFloat(precioCell.textContent);
                      const nuevoPrecioTotal = (
                        precioUnitario * nuevaCantidad
                      ).toFixed(2);
                      precioTotal.textContent = nuevoPrecioTotal;

                      // Actualizar el total general
                      cargarMontoIvaMontoTotal();

                      try {
                        const response = fetch(
                          `http://localhost:3001/detallePedidos/modificarCantidad/${pedidoId}/`,
                          {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              IDHard: detalle.IDHard,
                              CANTIDAD: nuevaCantidad,
                            }),
                          }
                        );
                      } catch (error) {
                        console.error(error);
                      }
                    } else {
                      cantidadCell.textContent = detalle.Cantidad;
                    }
                    modificarBtn.dataset.editing = "false";
                  };

                  // Si presionan "Enter", guardar la cantidad y salir del campo
                  inputCantidad.onkeydown = function (e) {
                    if (e.key === "Enter") {
                      inputCantidad.blur(); // Desenfocar el campo para guardar
                    }
                  };
                };
                modificarCell.appendChild(modificarBtn);
                cargarMontoIvaMontoTotal();
              });
              cargarMontoIvaMontoTotal();
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

function eliminarItem(idHard, row) {
  const confirmacion = confirm(
    "¿Estás seguro de que deseas eliminar este item?"
  );
  if (confirmacion) {
    row.remove();
  }
}

function cargarMontoIvaMontoTotal() {
  let total = 0;

  const tabla = document.getElementById("detallesVenta");

  for (let i = 1; i < tabla.rows.length; i++) {
    const celda = tabla.rows[i].cells[6];

    if (celda) {
      const valor = parseFloat(celda.textContent) || 0;
      total += valor;
    }
  }

  document.getElementById("montoColumna").textContent =
    "MONTO: $" + total.toFixed(0);

  document.getElementById("ivaColumna").textContent =
    "IVA: %" + (document.getElementById("IVA").value || 0);

  total = parseFloat(total);

  document.getElementById("montoTotalColumna").textContent =
    "MONTO TOTAL: $" +
    (
      ((document.getElementById("IVA").value * total) / 100 || 0) + total
    ).toFixed(0);
}

function finalizarVenta() {
  const pedidoSelect = document.getElementById("pedido");
  const idCliente = pedidoSelect.value; // Obtener el ID del cliente desde el select

  if (!idCliente) {
    alert("Por favor, seleccione un pedido.");
    return; // Salir de la función si no se seleccionó un pedido
  }

  const iva = parseFloat(document.getElementById("IVA").value) / 100;
  const detallesTable = document
    .getElementById("detallesVenta")
    .querySelector("tbody");
  const promesas = []; // Array para almacenar todas las promesas

  // Variable para almacenar el monto total de la factura
  let montoTotalFactura = 0;

  // Iterar sobre cada fila de la tabla de detalles
  for (let row of detallesTable.rows) {
    const idHard = row.getAttribute("data-id");
    const cantidad = parseInt(row.cells[4].textContent);
    const precioUnitario = parseFloat(row.cells[5].textContent);
    const precioTotal = (precioUnitario * cantidad * (1 + iva)).toFixed(2); // Calcular el precio total

    // Acumular el monto total de la factura
    montoTotalFactura += parseFloat(precioTotal);

    // Verificar stock y actualizar hardware
    const stockPromise = fetch(`http://localhost:3001/hardware/${idHard}`)
      .then((response) => response.json())
      .then((hardware) => {
        const stockActual = hardware[0].UNIDADES_DISPONIBLES;

        if (stockActual >= cantidad) {
          // Preparar los datos para actualizar el hardware
          const updatedHardware = {
            ID_Hard: hardware[0].ID_Hard,
            ID_Tipohard: hardware[0].ID_Tipohard,
            ID_Marca: hardware[0].ID_Marca,
            CARACTERISTICAS: hardware[0].CARACTERISTICAS,
            PRECIO_UNITARIO: hardware[0].PRECIO_UNITARIO,
            UNIDADES_DISPONIBLES: stockActual - cantidad, // Restar cantidad al stock
          };

          // Actualizar unidades disponibles en el hardware
          return fetch(`http://localhost:3001/hardware/${idHard}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedHardware),
          });
        } else {
          alert(
            `No hay suficiente stock para el hardware ID: ${idHard}. Stock actual: ${stockActual}.`
          );
          throw new Error(`Stock insuficiente para ID: ${idHard}`); // Lanza un error si no hay suficiente stock
        }
      })
      .catch((error) => console.error("Error al verificar stock:", error));

    // Agregar la promesa de stock al array
    promesas.push(stockPromise);

    // Guardar detalles de la factura
    const detallesFacturaPromise = stockPromise.then(() => {
      // Preparar los datos para los detalles de la factura
      const detallesFactura = {
        NroFacv: document.getElementById("numeroFactura").value, // Obtenido del input
        IDHard: idHard,
        PrecioUnitario: precioUnitario,
        Cantidad: cantidad,
        PrecioTotal: precioTotal,
        IVA: (precioTotal * iva).toFixed(2),
        PrecioIVA: (parseFloat(precioTotal) + precioTotal * iva).toFixed(2),
      };

      // Hacer la solicitud para guardar los detalles de la factura
      return fetch(`http://localhost:3001/detalleFactura`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(detallesFactura),
      });
    });

    // Agregar la promesa de detalles de factura al array
    promesas.push(detallesFacturaPromise);
  }

  console.log(pedidoId.value);
  

  // Promesa para cancelar el pedido
  const cancelarPedidoPromise = fetch(
    `http://localhost:3001/pedidos/cancelar/${pedidoId.value}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ condicion: 2 }),
    }
  );

  // Agregar la promesa de cancelar pedido al array
  promesas.push(cancelarPedidoPromise);

  // Crear y guardar la factura
  const factura = {
    NroFacv: document.getElementById("numeroFactura").value, // Número de factura ingresado manualmente
    IDCliente: idCliente, // ID del cliente extraído del select
    IDPedido: pedidoId, // Debes tener la variable `pedidoId` definida con el ID del pedido
    Fecha: new Date().toISOString(), // Fecha actual
    MontoTotal: montoTotalFactura.toFixed(2), // Monto total de la factura
    FormaDePago: document.getElementById("formaPago").value, // Obtener el método de pago
    CantidadDeCuotas: document.getElementById("cantCuotas").value, // Obtener el número de cuotas
    PeriodoDeCuotas: document.getElementById("tipoPeriodo").value, // Obtener el período de cuotas
  };

  // Hacer la solicitud para guardar la factura
  const guardarFacturaPromise = fetch(
    `http://localhost:3001/facturaventas/ventasCrear`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(factura),
    }
  );

  // Agregar la promesa de guardar factura al array
  promesas.push(guardarFacturaPromise);

  // Esperar a que todas las promesas se completen
  Promise.all(promesas)
    .then(() => {
      alert("Venta finalizada exitosamente!");
      limpiarFormulario();
    })
    .catch((error) => {
      console.error("Error al finalizar la venta:", error);
      alert("Hubo un error al finalizar la venta. Verifica los detalles.");
    });
}

// Función para limpiar el formulario
function limpiarFormulario() {
  document.getElementById("pedidoId").value = "";
  document.getElementById("IVA").value = "";
  document.getElementById("numeroFactura").value = "";
  document.getElementById("cantCuotas").value = "";

  const detallesTable = document
    .getElementById("detallesVenta")
    .querySelector("tbody");
  detallesTable.innerHTML = "";
}
