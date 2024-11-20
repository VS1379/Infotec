document.addEventListener("DOMContentLoaded", function () {
  cargarPedidos();
  cargarNumeroFactura()
});

// Funcion para obtener el Nro de Factura
async function cargarNumeroFactura() {
  const nuevoNumeroFactura = await obtenerNuevoNumeroFactura();
  if (nuevoNumeroFactura === null) {
    alert("Error al obtener el número de factura.");
    return;
  }
  document.getElementById("numeroFactura").value = nuevoNumeroFactura || 0
}

// Funcion para cargar el Pedido
function cargarPedidos() {

  fetch("http://localhost:3001/pedidos")
    .then((response) => response.json())
    .then((data) => {
      const pedidoSelect = document.getElementById("pedido");
      const clientePromises = [];

      data.forEach((pedido) => {
        const clientePromise = fetch(`
          http://localhost:3001/clientes/${pedido.IDCliente}`)
          .then((clienteResponse) => clienteResponse.json())
          .then((clienteData) => {
            const nombreCliente =
              clienteData?.NOMBRE || "Cliente no encontrado";
            const dniCliente = clienteData?.DNI || "DNI no encontrado";
            const option = document.createElement("option");
            option.value = pedido.IDPedido;
            option.dataset.clienteId = dniCliente;
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
          const selectedOption =
            pedidoSelect.options[pedidoSelect.selectedIndex];
          const clienteId = selectedOption.dataset.clienteId;
          if (selectedId) {
            cargarDetallesPedido(selectedId);
            const selectedOption =
              pedidoSelect.options[pedidoSelect.selectedIndex];
            document.getElementById("pedidoId").value = selectedId;
            document.getElementById("clienteId").value =
              selectedOption.dataset.clienteId;
          }
        });
      });
    })
    .catch((error) => console.error("Error al cargar los pedidos:", error));
}

// Funcion para cargar los Detalles del Pedido
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
                  (parseFloat(item.PRECIO_UNITARIO) *
                    detalle.Cantidad).toFixed(2);

                const modificarCell = row.insertCell(7);
                const eliminarCell = row.insertCell(8);

                cargarMarcasYTipos(item.ID_Marca, item.ID_Tipohard)
                  .then((datos) => {
                    if (datos) {
                      tipoCell.textContent = datos.tipo
                      marcaCell.textContent = datos.marca
                    } else {
                      console.error("No se pudieron obtener los datos.");
                    }
                  })
                  .catch((error) => {
                    console.error("Error al cargar marcas o tipos de hardware:", error);
                  });

                caracteristicasCell.textContent = item.CARACTERISTICAS;

                precioCell.textContent =
                  item.PRECIO_UNITARIO && !isNaN(item.PRECIO_UNITARIO)
                    ? parseFloat(item.PRECIO_UNITARIO).toFixed(2)
                    : "N/A";

                cantidadCell.textContent = detalle.Cantidad;

                // Botón eliminar (solo modifica la tabla)
                const eliminarBtn = document.createElement("button");
                eliminarBtn.textContent = "Eliminar";
                eliminarBtn.onclick = function () {
                  grillaHardware.removeChild(row); // Eliminar fila de la tabla
                  cargarMontoIvaMontoTotal(); // Recalcular montos
                };
                eliminarCell.appendChild(eliminarBtn);

                // Botón modificar (verifica stock y modifica en el HTML)
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

                  inputCantidad.onblur = async function () {
                    const nuevaCantidad = parseInt(inputCantidad.value);

                    if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
                      // Verificar stock antes de aplicar el cambio
                      const suficienteStock = await verificarStock(
                        detalle.IDHard,
                        nuevaCantidad
                      );
                      if (suficienteStock) {
                        cantidadCell.textContent = nuevaCantidad;

                        // Recalcular el precio total de la fila
                        const precioUnitario = parseFloat(
                          precioCell.textContent
                        );
                        const nuevoPrecioTotal = (
                          precioUnitario * nuevaCantidad
                        ).toFixed(2);
                        precioTotal.textContent = nuevoPrecioTotal;

                        // Actualizar el total general
                        cargarMontoIvaMontoTotal();
                      } else {

                        alert(
                          `No hay suficiente stock para el hardware: ${item.CARACTERISTICAS}.`
                        );
                        cantidadCell.textContent = detalle.Cantidad; // Restaurar cantidad original
                      }
                    } else {
                      cantidadCell.textContent = detalle.Cantidad; // Restaurar cantidad original
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

                cargarMontoIvaMontoTotal(); // Recalcular montos iniciales
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

async function verificarStock(idHardware, nuevaCantidad) {
  try {
    const response = await fetch(`http://localhost:3001/hardware/${idHardware}`);
    const hardware = await response.json();
    if (Array.isArray(hardware) && hardware.length > 0) {
      const stockActual = hardware[0].UNIDADES_DISPONIBLES;
      return stockActual >= nuevaCantidad;
    } else {
      console.error("Error: hardware no encontrado o vacío.");
      return false;
    }
  } catch (error) {
    console.error("Error al verificar stock:", error);
    return false;
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

async function finalizarVenta() {
  if (!comprobarCampos()) return;

  const idCliente = document.getElementById("clienteId").value;

  if (!idCliente) {
    alert("Por favor, seleccione un pedido.");
    return;
  }

  const detallesTabla = document.getElementById("detallesVenta").querySelector("tbody");
  if (detallesTabla.rows.length === 0) {
    alert("Debe haber al menos un producto en la Factura para finalizar la venta.");
    return;
  }

  const ivaPorcentaje = parseFloat(document.getElementById("IVA").value);
  const iva = ivaPorcentaje / 100;

  const detallesTable = document
    .getElementById("detallesVenta")
    .querySelector("tbody");
  const promesas = [];
  const detallesFacturaArray = [];
  let montoTotalFactura = 0;
  let stockSuficiente = true;

  const stockDisponible = await comprobarStock(detallesTable);
  if (!stockDisponible) {
    alert("La venta ha sido cancelada debido a falta de stock.");
    return;
  }

  const nuevoNumeroFactura = await obtenerNuevoNumeroFactura();
  if (nuevoNumeroFactura === null) {
    alert("Error al obtener el número de factura.");
    return;
  }


  for (let row of detallesTable.rows) {
    const idHard = row.getAttribute("data-id");
    const cantidad = parseInt(row.cells[4].textContent);
    const precioUnitario = parseFloat(row.cells[5].textContent);

    if (!idHard || !cantidad || isNaN(precioUnitario)) {
      console.warn(`Fila ignorada por datos incompletos: ID ${idHard}`);
      continue;
    }

    const precioTotal = precioUnitario * cantidad;

    montoTotalFactura += parseFloat(precioTotal.toFixed(2));

    // Verificar y actualizar stock
    const stockPromise = fetch(`http://localhost:3001/hardware/${idHard}`)
      .then((response) => response.json())
      .then((hardware) => {
        const stockActual = hardware[0].UNIDADES_DISPONIBLES;

        if (stockActual >= cantidad) {
          const updatedHardware = {
            ...hardware[0],
            UNIDADES_DISPONIBLES: stockActual - cantidad, // Restar cantidad
          };

          return fetch(`http://localhost:3001/hardware/${idHard}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedHardware),
          });
        } else {
          stockSuficiente = false;
          alert(
            `No hay suficiente stock para el hardware ID: ${idHard}. Stock actual: ${stockActual}.`
          );
          throw new Error(`Stock insuficiente para ID: ${idHard}`);
        }
      })
      .catch((error) => {
        console.error("Error al verificar stock:", error);
        alert("Error al verificar stock. Por favor, intente nuevamente.");
      });

    promesas.push(stockPromise);

    // Crear detalles de la factura
    const detallesFacturaPromise = stockPromise.then(() => {
      const detallesFactura = {
        NroFacv: nuevoNumeroFactura,
        IDHard: parseInt(idHard),
        PrecioUnitario: precioUnitario,
        Cantidad: cantidad,
        PrecioTotal: parseFloat(precioTotal.toFixed(2)),
        IVA: ivaPorcentaje.toFixed(2),
        PrecioIVA: parseFloat((precioTotal * (1 + iva)).toFixed(2)),
      };

      detallesFacturaArray.push(detallesFactura);

      return fetch(`http://localhost:3001/detallefacturaventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(detallesFactura),
      });
    });

    promesas.push(detallesFacturaPromise);
  }

  if (!stockSuficiente) {
    alert("La venta ha sido cancelada debido a falta de stock.");
    return;
  }

  montoTotalFactura *= 1 + iva;

  const factura = {
    NroFacv: nuevoNumeroFactura,
    IDCliente: idCliente,
    IDPedido: pedidoId.value,
    Fecha: new Date().toISOString(),
    MontoTotal: montoTotalFactura.toFixed(2),
    FormaDePago: document.getElementById("formaPago").value,
    CantidadDeCuotas: document.getElementById("cantCuotas").value,
    PeriodoDeCuotas: document.getElementById("tipoPeriodo").value,
  };

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

  promesas.push(guardarFacturaPromise);

  const cancelarPedidoPromise = fetch(
    `http://localhost:3001/pedidos/cancelar/${pedidoId.value}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ condicion: 2 }),
    }
  );

  promesas.push(cancelarPedidoPromise);

  // Esperar a que todas las operaciones se completen
  Promise.all(promesas)
    .then(() => {
      alert("Venta finalizada exitosamente!");
      obtenerYImprimirComprobante(factura, detallesFacturaArray);
      limpiarFormulario();
    })
    .catch((error) => {
      console.error("Error al finalizar la venta:", error);
      alert("Hubo un error al finalizar la venta. Verifica los detalles.");
    });
}

async function obtenerYImprimirComprobante(factura, detallesFactura) {
  const clienteId = document.getElementById("clienteId").value;

  try {
    const response = await fetch(`http://localhost:3001/clientes/${clienteId}`);
    if (!response.ok) {
      throw new Error("Cliente no encontrado");
    }

    const detallesCliente = await response.json();

    // Llamar a imprimirComprobante con la información completa
    imprimirComprobante(factura, detallesCliente, detallesFactura);
  } catch (error) {
    console.error("Error al obtener los detalles del cliente:", error);
    alert("No se pudo obtener la información del cliente.");
  }
}

async function imprimirComprobante(factura, detallesCliente, detallesFactura) {
  // Convertir la forma de pago en texto
  factura.FormaDePago =
    ["", "Contado", "Cuotas", "Cheque", "Depósito"][factura.FormaDePago] ||
    "Desconocido";

  // Esperar el resultado de obtenerDetallesProductos para generar los detalles del producto
  const detallesProductosHtml = await obtenerDetallesProductos(detallesFactura);
  let iva = detallesFactura[0].IVA;
  detallesFactura[0].IVA = detallesFactura[0].IVA / 100;
  detallesFactura[0].IVA = detallesFactura[0].IVA + 1;
  const comprobanteHtml = `
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
            .comprobante { max-width: 800px; margin: 20px auto; padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 5px; }
            h1, h2 { color: #0073e6; }
            .detalles-cliente, .detalles-pedido { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .total { font-size: 1.2em; font-weight: bold; text-align: right; margin-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #777; }
        </style>
    </head>
    <body>
        <div class="comprobante">
            <h1>FACTURA</h1>
            <div class="detalles-cliente">
                <h2>Detalles del Cliente</h2>
                <p><strong>DNI:</strong> ${detallesCliente.DNI}</p>
                <p><strong>Nombre:</strong> ${detallesCliente.NOMBRE}</p>
                <p><strong>Dirección:</strong> ${detallesCliente.DIRECCION}</p>
                <p><strong>Teléfono:</strong> ${detallesCliente.TELEFONO}</p>
                <p><strong>Correo:</strong> ${detallesCliente.CORREO}</p>
            </div>
            <div class="detalles-pedido">
                <h2>Detalles del Pedido</h2>
                <p><strong>Fecha del Pedido:</strong> ${new Date(
    factura.Fecha
  ).toLocaleDateString()}</p>
                <p><strong>Forma de Pago:</strong> ${factura.FormaDePago}</p>
                <p><strong>Cantidad de Cuotas / Cheques:</strong> ${factura.CantidadDeCuotas
    }</p>
            </div>
            <h2>Detalles del Producto</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item N°</th>
                        <th>Detalle</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Precio Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${detallesProductosHtml}
                </tbody>
            </table>
            <p class="total">IVA: % ${parseFloat(iva).toFixed(2)}</p>   
            <p class="total">Monto: $${parseFloat(
      factura.MontoTotal / detallesFactura[0].IVA
    ).toFixed(2)}</p>
            <p class="total">Monto Total + IVA: $${parseFloat(
      factura.MontoTotal
    ).toFixed(2)}</p>
            <div class="footer">
                <p>¡Gracias por su compra!</p>
            </div>
        </div>
    </body>
    </html>
  `;

  const ventana = window.open("", "_blank");
  ventana.document.write(comprobanteHtml);
  ventana.document.close();
  ventana.print();
}

async function obtenerDetallesProductos(detalles) {
  const detallesCompletos = await Promise.all(
    detalles.map(async (detalle) => {
      const respuestaHardware = await fetch(
        `http://localhost:3001/hardware/${detalle.IDHard}`
      );
      const [hardware] = await respuestaHardware.json();

      const respuestaTipo = await fetch(
        `http://localhost:3001/tipohardware/${hardware.ID_Tipohard}`
      );
      const [tipoHard] = await respuestaTipo.json();

      const respuestaMarca = await fetch(
        `http://localhost:3001/marca/${hardware.ID_Marca}`
      );
      const [marca] = await respuestaMarca.json();

      return {
        tipo: tipoHard.DESCRIPCION,
        marca: marca.DESCRIPCION,
        caracteristicas: hardware.CARACTERISTICAS,
        precioUnitario: detalle.PrecioUnitario,
        cantidad: detalle.Cantidad,
        PrecioTotal: detalle.PrecioTotal,
      };
    })
  );

  return generarDetallesProductosHtml(detallesCompletos);
}

function generarDetallesProductosHtml(detalles) {
  let nro = 0;
  return detalles
    .map(
      (detalle) => `
      <tr>
        <td>${++nro}</td>
        <td>${detalle.tipo}, ${detalle.marca}, ${detalle.caracteristicas}</td>
        <td>${detalle.cantidad}</td>
        <td>$${parseFloat(detalle.precioUnitario).toFixed(2)}</td>
        <td>$${parseFloat(detalle.PrecioTotal).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");
}

async function obtenerNuevoNumeroFactura() {
  try {
    const response = await fetch("http://localhost:3001/facturaventas");
    const facturas = await response.json();
    const ultimoIdFactura = facturas[facturas.length - 1]?.NroFacv || 0;
    return ultimoIdFactura + 1;
  } catch (error) {
    console.error("Error al obtener el número de factura:", error);
    return null;
  }
}

function comprobarCampos() {

  // Captura de datos del formulario
  let iva = document.getElementById("IVA").value;
  const fechaVenta = document.getElementById("fechaVenta").value;
  let cantCuotas = document.getElementById("cantCuotas").value;

  iva = parseInt(iva)
  cantCuotas = parseInt(cantCuotas)

  // Validación de campos obligatorios
  if (!fechaVenta) {
    alert("Por favor, complete La Fecha.");
    return false;
  }

  if (iva < 0 || isNaN(iva)) {
    alert("Por favor, El IVA debe ser cero o mas");
    return false;
  }
  if (cantCuotas < 0 || isNaN(cantCuotas)) {
    alert("Por favor, La Cantidad de Cuotas debe ser mayor a cero");
    return false;
  }
  return true
}

// Funcion para comprobar el stock antes de finalizar la venta
async function comprobarStock(detallesTable) {
  const stockPromises = [];

  // Recorrer todas las filas para verificar el stock
  for (let row of detallesTable.rows) {
    const idHard = row.getAttribute("data-id");
    const cantidad = parseInt(row.cells[4].textContent);

    // Agregar promesas de verificación a la lista
    stockPromises.push(
      fetch(`http://localhost:3001/hardware/${idHard}`)
        .then((response) => response.json())
        .then((hardware) => {
          const stockActual = hardware[0].UNIDADES_DISPONIBLES;

          if (stockActual < cantidad) {
            alert(
              `No hay suficiente stock para el hardware: ${hardware[0].CARACTERISTICAS}. \nStock actual: ${stockActual}.`
            );
            return false; // Indicar que no hay suficiente stock
          }
          return true; // Stock suficiente para este ítem
        })
        .catch((error) => {
          console.error("Error al verificar stock:", error);
          alert(
            `Error al verificar stock del hardware ID: ${idHard}. Intente nuevamente.`
          );
          return false; // Considerar como falta de stock en caso de error
        })
    );
  }

  // Esperar a que todas las promesas se resuelvan
  const stockResults = await Promise.all(stockPromises);

  // Si alguna verificación falló, devolver false
  return stockResults.every((result) => result === true);
}

async function cargarMarcasYTipos(
  idMarca,
  idTipoHard,
) {
  try {
    // Fetch para obtener marcas
    const marcasResponse = await fetch(`http://localhost:3001/marca/${idMarca}`);
    const marca = await marcasResponse.json();

    // Fetch para obtener tipos de hardware
    const tiposResponse = await fetch(`http://localhost:3001/tipohardware/${idTipoHard}`);
    const tipo = await tiposResponse.json();

    const datos = {
      marca: marca[0].DESCRIPCION,
      tipo: tipo[0].DESCRIPCION
    }

    return datos

  } catch (error) {
    console.error("Error al cargar marcas o tipos de hardware:", error);
  }
}

// Funcion para limpiar el formulario
function limpiarFormulario() {
  setTimeout(() => {
    location.reload();
  }, 3000);
}
