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

// Función para imprimir informe
// Función para imprimir informe con estilos
// Función para imprimir informe con estilos integrados
function imprimirInforme() {
  const contenido = document.getElementById("cobrosContainer").outerHTML;
  const fechaHoy = document.getElementById("fechaHoy").value;

  const estilos = `
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; background-color: #f9f9f9; color: #333; }
    h1, h3 { text-align: center; color: #0056b3; }
    input[type="date"] { font-size: 16px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; background-color: #fff; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 16px; background-color: #fff; }
    table th, table td { border: 1px solid #ddd; text-align: left; padding: 8px; }
    table th { background-color: #0056b3; color: white; text-align: center; }
    table tr:nth-child(even) { background-color: #f2f2f2; }
    table tr:hover { background-color: #f1f1f1; }
    fieldset { border: 2px solid #0056b3; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    fieldset h2 { color: #0056b3; text-align: left; }
    #cobrosContainer h3 { color: #0056b3; font-weight: bold; text-align: center; margin-top: 20px; }
  `;

  const ventana = window.open("", "_blank");
  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Informe de Cobros</title>
        <style>${estilos}</style>
      </head>
      <body>
        <h1>Informe de Cobros</h1>
        <p>Fecha: ${fechaHoy}</p>
        ${contenido}
      </body>
    </html>
  `);

  ventana.document.close();
  ventana.print();
  ventana.close();
}


