document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
  cargarTiposHardware();
  cargarMarcasHardware();
  document
    .getElementById("formPedido")
    .addEventListener("submit", finalizarPedido);
});

// Función para cargar los clientes en el select
async function cargarClientes() {
  try {
    const response = await fetch("http://localhost:3001/clientes");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const clientes = await response.json();

    // Verifica si 'clientes' es un arreglo y tiene elementos
    if (Array.isArray(clientes) && clientes.length > 0) {
      const selectCliente = document.getElementById("cliente");

      clientes.forEach((cliente) => {
        // Asegúrate de que las propiedades existen
        if (cliente.NOMBRE && cliente.DNI) {
          const option = document.createElement("option");
          option.value = cliente.DNI; // Usando el DNI como valor
          option.textContent = `${cliente.NOMBRE} (DNI: ${cliente.DNI})`; // Usando el NOMBRE y DNI
          selectCliente.appendChild(option);
        } else {
          console.warn("Cliente sin nombre o DNI:", cliente);
        }
      });
    } else {
      console.warn("No se encontraron clientes en la respuesta.");
    }
  } catch (error) {
    console.error("Error al cargar clientes:", error);
  }
}

// Función para cargar los tipos de hardware
async function cargarTiposHardware() {
  try {
    const response = await fetch("http://localhost:3001/tipohardware");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tiposHardware = await response.json();
    const selectTipo = document.getElementById("tipoHardware");

    // Verifica si 'tiposHardware' es un arreglo y tiene elementos
    if (Array.isArray(tiposHardware) && tiposHardware.length > 0) {
      tiposHardware.forEach((tipo) => {
        // Asegúrate de que las propiedades existen
        if (tipo.ID_Tipohard && tipo.DESCRIPCION) {
          const option = document.createElement("option");
          option.value = tipo.ID_Tipohard; // Usando el ID_Tipohard como valor
          option.textContent = tipo.DESCRIPCION; // Usando la DESCRIPCION como texto
          selectTipo.appendChild(option);
        } else {
          console.warn("Tipo de hardware sin ID o descripción:", tipo);
        }
      });
    } else {
      console.warn("No se encontraron tipos de hardware en la respuesta.");
    }
  } catch (error) {
    console.error("Error al cargar tipos de hardware:", error);
  }
}

// Función para cargar las marcas de hardware
// Función para cargar las marcas de hardware
async function cargarMarcasHardware() {
  try {
    const response = await fetch("http://localhost:3001/marca");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const marcasHardware = await response.json();
    const selectMarca = document.getElementById("marcaHardware");

    // Verifica si 'marcasHardware' es un arreglo y tiene elementos
    if (Array.isArray(marcasHardware) && marcasHardware.length > 0) {
      marcasHardware.forEach((marca) => {
        // Asegúrate de que las propiedades existen
        if (marca.ID_Marca && marca.DESCRIPCION) {
          const option = document.createElement("option");
          option.value = marca.ID_Marca; // Usando el ID_Marca como valor
          option.textContent = marca.DESCRIPCION; // Usando la DESCRIPCION como texto
          selectMarca.appendChild(option);
        } else {
          console.warn("Marca de hardware sin ID o descripción:", marca);
        }
      });
    } else {
      console.warn("No se encontraron marcas de hardware en la respuesta.");
    }
  } catch (error) {
    console.error("Error al cargar marcas de hardware:", error);
  }
}

// Llama a la función para cargar marcas al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
  cargarMarcasHardware();
});
``;

// Función para agregar un detalle del hardware al pedido
function agregarDetalle() {
  const tipoHardware = document.getElementById("tipoHardware").value;
  const marcaHardware = document.getElementById("marcaHardware").value;
  const cantidad = document.getElementById("cantidad").value;

  if (!tipoHardware || !marcaHardware || !cantidad) {
    alert(
      "Por favor, complete todos los campos para agregar el hardware al pedido."
    );
    return;
  }

  const detallesPedido = document
    .getElementById("detallesPedido")
    .querySelector("tbody");
  const nuevaFila = detallesPedido.insertRow();

  // Agregar las celdas a la fila
  nuevaFila.innerHTML = `
    <td>${document.getElementById("tipoHardware").selectedOptions[0].text}</td>
    <td>${document.getElementById("marcaHardware").selectedOptions[0].text}</td>
    <td>Características aquí</td>
    <td>Precio aquí</td>
    <td>${cantidad}</td>
    <td>Stock aquí</td>
    <td>Nuevo</td>
  `;
}

// Función para finalizar el pedido
async function finalizarPedido(event) {
  event.preventDefault();

  const cliente = document.getElementById("cliente").value;
  const fechaPedido = document.getElementById("fechaPedido").value;
  const tipoPedido = document.getElementById("tipoPedido").value;

  if (!cliente || !fechaPedido || !tipoPedido) {
    alert("Por favor, complete todos los campos del pedido.");
    return;
  }

  // Recopilar los detalles del pedido
  const detalles = [];
  const filas = document
    .getElementById("detallesPedido")
    .querySelectorAll("tbody tr");

  filas.forEach((fila) => {
    const detalle = {
      tipo: fila.cells[0].textContent,
      marca: fila.cells[1].textContent,
      cantidad: parseInt(fila.cells[4].textContent, 10),
      estado: fila.cells[6].textContent,
    };
    detalles.push(detalle);
  });

  try {
    // Enviar el pedido al backend
    const response = await fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente,
        fechaPedido,
        tipoPedido,
        detalles,
      }),
    });

    if (response.ok) {
      alert("Pedido registrado exitosamente.");
      document.getElementById("formPedido").reset();
      document
        .getElementById("detallesPedido")
        .querySelector("tbody").innerHTML = "";
    } else {
      alert("Error al registrar el pedido.");
    }
  } catch (error) {
    console.error("Error al finalizar el pedido:", error);
  }
}
