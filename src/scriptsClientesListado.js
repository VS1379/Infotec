document.addEventListener("DOMContentLoaded", function () {
  cargarClientes();

});


async function cargarClientes() {
  try {
    // Obtiene los clientes
    const response = await fetch("http://localhost:3001/clientes");
    const clientesArray = await response.json();
    let i = 0;
    clientesArray.sort((a, b) =>
      (a.NOMBRE || "").localeCompare(b.NOMBRE || "")
    );

    const clienteContainer = document.getElementById("clienteContainer");
    clienteContainer.innerHTML = `
      <table>
        <tbody>
          ${clientesArray
        .map(
          (cliente) => `
            <tr>
            
            <td>${(i += 1)}</td>
              <td>${cliente.DNI.toLocaleString("es-AR")}</td>
              <td>${cliente.CUIT.toLocaleString("es-AR")}</td>
              <td>${cliente.NOMBRE}</td>
              <td>${cliente.DIRECCION}</td>
              <td>${cliente.TELEFONO}</td>
              <td>${cliente.CORREO}</td>
            </tr>
            `
        )
        .join("")}
          </tbody>
      </table>
          
      <table>
        <thead>
          <tr>
            <td><h2>Total de Clientes: ${clientesArray.length}</h2></td>
          </tr>
        </thead>
      </table>`;
  } catch (error) {
    console.error("Error al cargar los clientes:", error);
    document.getElementById("clienteContainer").innerHTML =
      "<p>Error al cargar los clientes.</p>";
  }
}
// Función para imprimir el informe
function imprimirInforme() {
  // Capturamos el contenido de la tabla
  const tabla = document.querySelector("table").outerHTML;

  // Creamos una nueva ventana para imprimir
  const ventana = window.open("", "_blank");
  ventana.document.write(`
    <html>
      <head>
        <title>Informe de Clientes</title>
        <style>
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            text-align: left;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Informe de Clientes</h1>
        ${tabla}
      </body>
    </html>
  `);

  // Imprimimos el contenido
  ventana.document.close();
  ventana.print();
  ventana.close();
}

