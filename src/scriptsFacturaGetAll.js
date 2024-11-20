document.addEventListener("DOMContentLoaded", function () {
  cargarFacturas();
});

async function cargarFacturas() {
  try {
    // Realiza una solicitud al backend para obtener todas las facturas
    const response = await fetch("http://localhost:3001/facturaventas");
    const facturas = await response.json();

    // Selecciona el contenedor donde se agregarán las filas de facturas
    const facturaContainer = document.getElementById("facturaContainer");

    // Verifica si se han recibido facturas
    if (facturas.length === 0) {
      facturaContainer.innerHTML =
        "<tr><td colspan='9'>No hay facturas disponibles</td></tr>";
      return;
    }

    // Genera las filas de la tabla para cada factura
    for (const [index, factura] of facturas.entries()) {
      const row = document.createElement("tr");
      const formaPago = ["Contado", "Cuotas", "Cheque", "Deposito"];

      // Obtiene el nombre del cliente si no está en la factura
      let clienteNombre = factura.ClienteNombre || "No especificado";
      if (!factura.ClienteNombre && factura.IDCliente) {

        const clienteResponse = await fetch(
          `http://localhost:3001/clientes/buscar/campo?field=DNI&data=${factura.IDCliente}`
        );
        const cliente = await clienteResponse.json();

        clienteNombre = cliente[0].NOMBRE || "No especificado";
      }

      // Genera la fila de la tabla con el enlace al pedido
      row.innerHTML = `
            <td>${index + 1}</td>
            <td>${factura.NroFacv}</td>
            <td><a href="pedidos-getAll.html?pedido=${factura.IDPedido}">${factura.IDPedido
        }</a></td>
            <td>DNI: ${factura.IDCliente} Nombre: ${clienteNombre}</td>
            <td>${new Date(factura.Fecha).toLocaleString()}</td>
            <td>${factura.MontoTotal}</td>
            <td>${formaPago[factura.FormaDePago]}</td>
            <td>${factura.CantidadDeCuotas}</td>
            <td>${factura.PeriodoDeCuotas}</td>
          `;

      // Agrega la fila al contenedor de la tabla
      facturaContainer.appendChild(row);
    }
  } catch (error) {
    console.error("Error al cargar las facturas:", error);
    document.getElementById("facturaContainer").innerHTML =
      "<tr><td colspan='9'>Error al cargar las facturas</td></tr>";
  }
}
