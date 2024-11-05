// scriptsCobrosListado.js

document.addEventListener("DOMContentLoaded", function () {
  cargarCobros();
});

async function cargarCobros() {
  try {
    const response = await fetch("http://localhost:3001/facturaventas/cobrar");
    const facturas = await response.json();

    const formaPagoLabels = ["Contado", "Cuotas", "Cheque", "Depósito"];
    const cobrosPorTipo = {};
    let montoTotalCobrado = 0;

    // Agrupa los cobros por Forma de Pago y acumula el monto total
    facturas.forEach((factura) => {
      const tipoPago = formaPagoLabels[factura.FormaDePago - 1] || "Otro";
      if (!cobrosPorTipo[tipoPago]) cobrosPorTipo[tipoPago] = [];
      cobrosPorTipo[tipoPago].push(factura);
      montoTotalCobrado += parseFloat(factura.MontoTotal) || 0;
    });

    const cobrosContainer = document.getElementById("cobrosContainer");
    cobrosContainer.innerHTML = `<h1>Cobros Realizados</h1>`;

    for (const [tipoPago, cobros] of Object.entries(cobrosPorTipo)) {
      cobrosContainer.innerHTML += `<h2>Forma de pago: ${tipoPago}</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Banco</th>
            <th>Nro Cheque</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          ${cobros
            .map(
              (cobro) => `
            <tr>
              <td>${new Date(cobro.Fecha).toLocaleDateString("es-AR")}</td>
              <td>${cobro.IdBanco || "N/A"}</td>
              <td>${cobro.NroCheque || "N/A"}</td>
              <td>${parseFloat(cobro.MontoTotal).toFixed(2)} $</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>`;
    }

    cobrosContainer.innerHTML += `<h3>Monto Total Cobrado: ${montoTotalCobrado.toFixed(
      2
    )} $</h3>`;
  } catch (error) {
    console.error("Error al cargar los cobros:", error);
    document.getElementById("cobrosContainer").innerHTML =
      "<p>Error al cargar los cobros.</p>";
  }
}
