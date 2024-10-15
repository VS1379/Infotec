document.getElementById("ventaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const ventaData = {
    numeroFactura: document.getElementById("numeroFactura").value,
    pedidoId: document.getElementById("pedidoId").value,
    fechaVenta: document.getElementById("fechaVenta").value,
    montoTotal: document.getElementById("montoTotal").value,
    formaPago: document.getElementById("formaPago").value,
    cuotas: document.getElementById("cuotas").value,
    tipoPeriodo: document.getElementById("tipoPeriodo").value,
  };

  try {
    const response = await fetch("http://localhost:3001/ventas/ventasCrear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ventaData),
    });
    const result = await response.json();
    alert(result.message);
  } catch (error) {
    alert("Error al registrar la venta");
  }
});
