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

function cargarDetallesPedido(pedidoId) {
  fetch(`http://localhost:3001/detallepedidos/${pedidoId}`)
    .then((response) => response.json())
    .then((detalles) => {
      let i = 0;
      const grillaHardware = document
        .getElementById("detallesPresupuesto")
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
                  detalle.Cantidad.toFixed(2);
                precioTotal.textContent = parseFloat(
                  precioTotal.textContent
                ).toFixed(2);

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

  const tabla = document.getElementById("detallesPresupuesto");

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

async function imprimirPresupuesto() {
  const pedidoSelect = document.getElementById("pedido");
  const idCliente = pedidoSelect.value; // Obtener el ID del cliente desde el select

  if (!idCliente) {
    alert("Por favor, seleccione un pedido.");
    return; // Salir de la función si no se seleccionó un pedido
  }

  // Obtener el nuevo número de factura
  const numeroPedido = document.getElementById("pedidoId").value;

  let iva = parseFloat(document.getElementById("IVA").value) / 100;

  const detallesTable = document
    .getElementById("detallesPresupuesto")
    .querySelector("tbody");
  const promesas = []; // Array para almacenar todas las promesas

  let montoTotalFactura = 0;
  let stockSuficiente = true; // Bandera para verificar stock

  const detallesFacturaArray = [];

  // Iterar sobre cada fila de la tabla de detalles
  for (let row of detallesTable.rows) {
    const idHard = row.getAttribute("data-id");
    const cantidad = parseInt(row.cells[4].textContent);
    const precioUnitario = parseFloat(row.cells[5].textContent);
    const precioTotal = precioUnitario * cantidad; // Calcular el precio total

    // Acumular el monto total de la factura
    montoTotalFactura += parseFloat(precioTotal.toFixed(2));

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
        } else {
          // Si no hay suficiente stock, marcar la bandera como falsa
          stockSuficiente = false;
          alert(
            `¡ Advertencia ! \n No hay suficiente stock para el hardware ID: ${idHard}. Stock actual: ${stockActual}.`
          );
          throw new Error(`Stock insuficiente para ID: ${idHard}`); // Lanza un error si no hay suficiente stock
        }
      })
      .catch((error) => console.error("Error al verificar stock:", error));

    // Guardar detalles del presupuesto solo si hay stock suficiente
    iva = iva * 100;
    const detallesFactura = {
      IDHard: idHard,
      PrecioUnitario: precioUnitario,
      Cantidad: cantidad,
      PrecioTotal: precioTotal,
      IVA: iva.toFixed(4),
      PrecioIVA: (parseFloat(precioTotal) + precioTotal * iva).toFixed(2),
    };
    iva = iva / 100;

    detallesFacturaArray.push(detallesFactura);
  }

  // Verificar si hubo problemas de stock
  if (!stockSuficiente) {
    // Cancelar todas las operaciones si no hay suficiente stock
    alert("La venta ha sido cancelada debido a falta de stock.");
    return; // Salir de la función
  }

  montoTotalFactura = montoTotalFactura * (1 + iva);
  const factura = {
    NroFacv: 0, // Número de factura que debe ser +1 del último
    IDCliente: idCliente, // ID del cliente extraído del select
    IDPedido: pedidoId.value, // Debes tener la variable pedidoId definida con el ID del pedido
    Fecha: document.getElementById("fechaVenta").value, // Fecha actual
    MontoTotal: montoTotalFactura.toFixed(2), // Monto total de la factura
    FormaDePago: document.getElementById("formaPago").value, // Obtener el método de pago
    CantidadDeCuotas: document.getElementById("cantCuotas").value, // Obtener el número de cuotas
  };

  // Esperar a que todas las promesas se completen

  alert("Presupuesto Finalizado Exitosamente!");
  obtenerYImprimirComprobante(factura, detallesFacturaArray);
  limpiarFormulario();
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
  console.log(factura);

  // Convertir la forma de pago en texto
  factura.FormaDePago =

    ["", "Efectivo", "Tarjeta", "Cheque", "Cuotas"][factura.FormaDePago] ||
    "Otra";

  factura.Fecha =
    factura.Fecha === ""
      ? "Sin Vencimiento"
      : new Date(factura.Fecha).toLocaleDateString();

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
            <h1>PRESUPUESTO</h1>
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
                <p><strong>Valido Hasta:</strong> ${factura.Fecha}</p>
                <p><strong>Forma de Pago:</strong> ${factura.FormaDePago}</p>
                <p><strong>Cantidad de Cuotas / Cheques:</strong> ${
                  factura.CantidadDeCuotas || 0
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
                <p>¡Gracias por tenernos en cuenta!</p>
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

async function obtenerNumeroPresupuesto() {
  try {
    const response = await fetch("http://localhost:3001/presupuesto");
    const presupuesto = await response.json();
    const ultimoPresupuesto =
      presupuesto[presupuesto.length - 1]?.IDPedido || 0;
    return ultimoPresupuesto + 1;
  } catch (error) {
    console.error("Error al obtener el número de factura:", error);
    return null;
  }
}

// Función para limpiar el formulario
function limpiarFormulario() {
  //location.reload();
}
