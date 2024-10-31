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
            option.dataset.clienteId = dniCliente;
            option.textContent = `DNI: ${dniCliente} - Nombre: ${nombreCliente}`;
            pedidoSelect.appendChild(option);
          })
          .catch((error) => console.error("Error al cargar cliente:", error));
        clientePromises.push(clientePromise);
      });

      Promise.all(clientePromises).then(() => {
        pedidoSelect.addEventListener("change", (event) => {
          const selectedId = event.target.value;
          if (selectedId) {
            cargarDetallesPedido(selectedId);
            document.getElementById("pedidoId").value = selectedId;
            const selectedOption =
              pedidoSelect.options[pedidoSelect.selectedIndex];
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
                tipoCell.textContent = item.ID_Tipohard;
                marcaCell.textContent = item.ID_Marca;
                caracteristicasCell.textContent = item.CARACTERISTICAS;
                precioCell.textContent = parseFloat(
                  item.PRECIO_UNITARIO
                ).toFixed(2);
                cantidadCell.textContent = detalle.Cantidad;
                precioTotal.textContent = (
                  item.PRECIO_UNITARIO * detalle.Cantidad
                ).toFixed(2);
              });
              calcularTotalPresupuesto();
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

function calcularTotalPresupuesto() {
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
    "MONTO: $" + total.toFixed(2);

  const iva = parseFloat(document.getElementById("IVA").value || 0) / 100;
  const montoTotal = total + total * iva;
  document.getElementById("montoTotalColumna").textContent =
    "MONTO TOTAL: $" + montoTotal.toFixed(2);
}

function finalizarPresupuesto() {
  const pedidoId = document.getElementById("pedidoId").value;
  const clienteId = document.getElementById("clienteId").value;

  if (!pedidoId || !clienteId) {
    alert("Debe seleccionar un cliente y un pedido válido.");
    return;
  }

  const montoTotal = document
    .getElementById("montoTotalColumna")
    .textContent.replace("MONTO TOTAL: $", "");

  const detalleFactura = generarFactura(montoTotal);

  console.log("Datos simulados de la venta:");
  console.log("Cliente:", clienteId);
  console.log("Pedido:", pedidoId);
  console.log("Monto Total:", montoTotal);
  console.log("Detalles de Factura:", detalleFactura);
}

function generarFactura(montoTotal) {
  const tabla = document.getElementById("detallesPresupuesto");
  const detallesFactura = [];

  for (let i = 1; i < tabla.rows.length; i++) {
    const row = tabla.rows[i];
    const idHardware = row.getAttribute("data-id");
    const cantidad = parseInt(row.cells[4].textContent);
    const precioUnitario = parseFloat(row.cells[5].textContent);

    detallesFactura.push({
      IDHard: idHardware,
      Cantidad: cantidad,
      PrecioUnitario: precioUnitario,
      PrecioTotal: (cantidad * precioUnitario).toFixed(2),
    });
  }

  const factura = {
    NumeroFactura: generarNumeroFactura(),
    Fecha: new Date().toLocaleDateString(),
    MontoTotal: parseFloat(montoTotal),
    Detalle: detallesFactura,
  };

  return factura;
}

function generarNumeroFactura() {
  return Math.floor(Math.random() * 1000000); // Generación aleatoria para simular número de factura
}

function imprimirPresupuesto() {
  // Creamos la nueva ventana
  const ventanaImpresion = window.open("", "_blank");

  // Obtener datos del presupuesto y el total
  const detallesPresupuesto = document
    .getElementById("detallesPresupuesto")
    .querySelector("tbody");
  const total = document.getElementById("totalPresupuesto").textContent;

  // Crear el contenido HTML para la impresión
  const contenidoImpresion = `
      <html>
        <head>
          <title>Comprobante de Presupuesto</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; }
            .total { font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>
          <h2>Comprobante de Presupuesto</h2>
          <p>Fecha: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Características</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${Array.from(detallesPresupuesto.rows)
                .map(
                  (row) => `
                <tr>
                  ${Array.from(row.cells)
                    .map((cell) => `<td>${cell.textContent}</td>`)
                    .join("")}
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <p class="total">Total: $${total}</p>
        </body>
      </html>
    `;
    
  // Cargar el contenido HTML en la nueva ventana y ejecutar la impresión
  ventanaImpresion.document.open();
  ventanaImpresion.document.write(contenidoImpresion);
  ventanaImpresion.document.close();
  ventanaImpresion.print();
}
