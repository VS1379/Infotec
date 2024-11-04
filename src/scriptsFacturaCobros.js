function verificarFactura() {
  const numeroFactura = document.getElementById("numeroFactura").value;
  fetch(`http://localhost:3001/facturas/${numeroFactura}`)
    .then((response) => response.json())
    .then((factura) => {
      if (factura.cantidadCuotas === 0) {
        alert("La factura ya está pagada.");
        return;
      }
      const datosFacturaDiv = document.getElementById("datosFactura");
      datosFacturaDiv.innerHTML = `
          <p>Cliente: ${factura.cliente}</p>
          <p>Total: ${factura.total}</p>
          <p>Cuotas Restantes: ${factura.cantidadCuotas}</p>
        `;
    })
    .catch((error) => alert("Factura no encontrada."));
}

function mostrarCamposCheque() {
  const formaPago = document.getElementById("formaPago").value;
  const camposCheque = document.getElementById("camposCheque");
  if (formaPago === "cheque" || formaPago === "deposito") {
    camposCheque.style.display = "block";
  } else {
    camposCheque.style.display = "none";
  }
}

function registrarCobro() {
  const numeroFactura = document.getElementById("numeroFactura").value;
  const fecha = document.getElementById("fechaCobro").value;
  const monto = document.getElementById("montoCobro").value;
  const formaPago = document.getElementById("formaPago").value;
  const numeroCheque = document.getElementById("numeroCheque").value;
  const banco = document.getElementById("banco").value;

  fetch("http://localhost:3001/cobros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    .catch((error) => alert("Error al registrar el cobro."));
}

function actualizarCuotas(numeroFactura) {
  fetch(`http://localhost:3001/facturas/actualizar-cuotas/${numeroFactura}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.mensaje);
      document.getElementById("formCobro").reset();
      document.getElementById("datosFactura").innerHTML = "";
    })
    .catch((error) => alert("Error al actualizar las cuotas."));
}
