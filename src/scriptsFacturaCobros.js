document.addEventListener("DOMContentLoaded", function () {
  cargarFacturas();
  cargarBancos();
  document.getElementById("numeroFactura").addEventListener("change", (e) => {
    const facturaId = e.target.value;
    if (facturaId && facturaId !== "No Seleccionado") {
      cargarDetallesFactura(facturaId);
    }
  });
});

async function cargarFacturas() {
  try {
    const response = await fetch("http://localhost:3001/facturaventas/cobrar");
    const facturas = await response.json();

    const numeroFacturaSelect = document.getElementById("numeroFactura");

    facturas.forEach((factura) => {
      const option = document.createElement("option");
      option.value = factura.NroFacv;
      option.textContent = `Factura Nº ${factura.NroFacv}`;
      numeroFacturaSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar las facturas:", error);
  }
}

async function cargarDetallesFactura(facturaId) {
  try {
    const response = await fetch(
      `http://localhost:3001/facturaventas/${facturaId}`
    );
    const factura = await response.json();
    document.getElementById("fechaVenta").value = new Date(
      factura.Fecha
    ).toLocaleDateString();

    const formaPago = ["Contado", "Cuotas", "Cheque", "Depósito"];

    document.getElementById("formaPago").value = formaPago[factura.FormaDePago];
    document.getElementById("cantCuotas").value = factura.CantidadDeCuotas;
    document.getElementById("tipoPeriodo").value = factura.PeriodoDeCuotas;
    cargarDatosPedido(factura.IDPedido);

    const detalleResponse = await fetch(
      "http://localhost:3001/detallefacturaventas"
    );
    const detallesFactura = await detalleResponse.json();
    const detallesFiltrados = detallesFactura.filter(
      (detalle) => detalle.NroFacv === factura.NroFacv
    );

    document.getElementById("IVA").value = (
      detallesFiltrados[0].IVA * 100
    ).toFixed(2);
    cargarDetallesHardware(detallesFiltrados);
  } catch (error) {
    console.error("Error al cargar los detalles de la factura:", error);
  }
}

async function cargarDatosPedido(pedidoId) {
  try {
    const response = await fetch(`http://localhost:3001/pedidos/${pedidoId}`);
    const pedido = await response.json();

    document.getElementById("pedidoId").value = pedido.IDPedido;
    cargarDatosCliente(pedido.IDCliente);
  } catch (error) {
    console.error("Error al cargar los datos del pedido:", error);
  }
}

async function cargarDatosCliente(clienteId) {
  try {
    const response = await fetch(`http://localhost:3001/clientes/${clienteId}`);
    const cliente = await response.json();

    document.getElementById("clienteDni").value = cliente.DNI;
    document.getElementById("clienteName").value = cliente.NOMBRE;
  } catch (error) {
    console.error("Error al cargar los datos del cliente:", error);
  }
}

async function cargarDetallesHardware(detallesFiltrados) {
  try {
    let i = 0;
    const detallesVentaTableBody = document.querySelector(
      "#detallesVenta tbody"
    );
    detallesVentaTableBody.innerHTML = "";

    for (const detalle of detallesFiltrados) {
      const hardwareResponse = await fetch(
        `http://localhost:3001/hardware/${detalle.IDHard}`
      );
      const hardware = await hardwareResponse.json();

      const tipoResponse = await fetch(
        `http://localhost:3001/tipohardware/${hardware[0].ID_Tipohard}`
      );
      const tipo = await tipoResponse.json();

      const marcaResponse = await fetch(
        `http://localhost:3001/marca/${hardware[0].ID_Marca}`
      );
      const marca = await marcaResponse.json();

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${(i += 1)}</td>
        <td>${tipo[0].DESCRIPCION}</td>
        <td>${marca[0].DESCRIPCION}</td>
        <td>${hardware[0].CARACTERISTICAS}</td>
        <td>${detalle.Cantidad}</td>
        <td>${hardware[0].PRECIO_UNITARIO}</td>
        <td>${(detalle.Cantidad * hardware[0].PRECIO_UNITARIO).toFixed(2)}</td>
      `;
      detallesVentaTableBody.appendChild(row);
      cargarMontoIvaMontoTotal();
    }
  } catch (error) {
    console.error("Error al cargar los detalles del hardware vendido:", error);
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

// Resto de funciones sin cambios
function toggleChequeFields() {
  const chequeFields = document.getElementById("chequeFields");
  chequeFields.style.display = document.getElementById("cheque").checked
    ? "block"
    : "none";
}

async function cargarBancos() {
  try {
    const response = await fetch("http://localhost:3001/bancos");
    const bancos = await response.json();

    const bancoSelect = document.getElementById("banco");

    bancos.forEach((banco) => {
      const option = document.createElement("option");
      option.value = banco.IdBanco;
      option.textContent = banco.Nombre;
      bancoSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar los bancos:", error);
  }
}

function registrarCobro() {
  const numeroFactura = document.getElementById("numeroFactura").value;
  const fecha = document.getElementById("fechaCobro").value;
  const monto = document.getElementById("monto").value;
  const cheque = document.getElementById("cheque").checked;
  const numeroCheque = cheque
    ? document.getElementById("numeroCheque").value
    : null;
  const banco = cheque ? document.getElementById("banco").value : null;

  if ((formaPago = "Contado")) {
    formaPago = 1;
  } else if ((formaPago = "Cuotas")) {
    formaPago = 2;
  } else if ((formaPago = "Cheque")) {
    formaPago = 3;
  } else {
    formaPago = 4;
  }
  fetch("http://localhost:3001/cobros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      numeroFactura,
      fecha,
      monto,
      formaPago,
      numeroCheque,
      banco,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.mensaje);
      actualizarCuotas(numeroFactura);
    })
    .catch((error) => {
      console.error("Error al registrar el cobro:", error);
      alert("Error al registrar el cobro.");
    });
}

function actualizarCuotas(numeroFactura) {
  console.log(numeroFactura);
  
  fetch(`http://localhost:3001/cobros/actualizar-cuotas/${numeroFactura}`, {
    method: "PATCH",
   //headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.mensaje);
      document.getElementById("formCobro").reset();
    })
    .catch((error) => {
      console.error("Error al actualizar las cuotas:", error);
      alert("Error al actualizar las cuotas.");
    });
}
