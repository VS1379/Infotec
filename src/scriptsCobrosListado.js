document.addEventListener("DOMContentLoaded", function () {
  cargarCobros();
  cargarFechaHoy()
});

function cargarFechaHoy() {
  document.getElementById("fechaHoy").value = new Date().toISOString().split('T')[0];
}

async function cargarCobros() {
  try {
    const response = await fetch("http://localhost:3001/cobros");
    const cobros = await response.json();

    const bancosResponse = await fetch("http://localhost:3001/bancos");
    const bancos = await bancosResponse.json();

    // Crear un mapa para acceder rápidamente al nombre del banco por IdBanco
    const bancosMap = bancos.reduce((map, banco) => {
      map[banco.IdBanco] = banco.Nombre;
      return map;
    }, {});


    const formaPagoLabels = ["Contado", "Cuotas", "Cheque", "Depósito"];
    const cobrosPorTipo = {};
    let montoTotalCobrado = 0;

    // Agrupa los cobros por Forma de Pago y acumula el monto total
    cobros.forEach((cobro) => {
      const tipoPago = formaPagoLabels[cobro.Tipo - 1] || "Otro";
      if (!cobrosPorTipo[tipoPago]) cobrosPorTipo[tipoPago] = [];
      cobrosPorTipo[tipoPago].push(cobro);
      montoTotalCobrado += parseFloat(cobro.Monto) || 0;
    });

    const cobrosContainer = document.getElementById("cobrosContainer");
    cobrosContainer.innerHTML = `<h1>Cobros Realizados</h1>`;

    for (const [tipoPago, cobros] of Object.entries(cobrosPorTipo)) {
      cobrosContainer.innerHTML += `
      <fieldset>
      <h2>Forma de pago: ${tipoPago}</h2>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Banco</th>
            <th>Nro Cheque/Cuota</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          ${cobros
          .map((cobro) => {
            const nombreBanco = bancosMap[cobro.IdBanco] || "N/A";
            return `
                <tr>
                  <td>${new Date(cobro.FechaCobro).toLocaleDateString("es-AR")}</td>
                  <td>${nombreBanco}</td>
                  <td>${cobro.NroCheque || cobro.CantidadDeCuotas || "N/A"}</td>
                  <td>${parseFloat(cobro.Monto).toFixed(2)} $</td>
                </tr>
              `;
          })
          .join("")}
        </tbody>
      </table>
      </fieldset>
      <br>`;
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
