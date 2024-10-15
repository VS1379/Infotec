document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
  cargarTiposHardware();
  cargarMarcasHardware();
  cargarHardwarePorTipoYMarca(); // Cargar hardware filtrado al inicio
  document
    .getElementById("formPedido")
    .addEventListener("submit", finalizarPedido);
});

document
  .getElementById("tipoHardware")
  .addEventListener("change", cargarHardwarePorTipoYMarca);
document
  .getElementById("marcaHardware")
  .addEventListener("change", cargarHardwarePorTipoYMarca);

document
  .getElementById("formPedido")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    await finalizarPedido(event);
    imprimirComprobante(); // Imprimir comprobante al finalizar el pedido
  });

// Función para cargar los clientes en el select
async function cargarClientes() {
  try {
    const response = await fetch("http://localhost:3001/clientes");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const clientes = await response.json();

    if (Array.isArray(clientes) && clientes.length > 0) {
      const selectCliente = document.getElementById("cliente");
      clientes.forEach((cliente) => {
        if (cliente.NOMBRE && cliente.DNI) {
          const option = document.createElement("option");
          option.value = cliente.DNI;
          option.textContent = `${cliente.NOMBRE} (DNI: ${cliente.DNI})`;
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

    if (Array.isArray(tiposHardware) && tiposHardware.length > 0) {
      tiposHardware.forEach((tipo) => {
        if (tipo.ID_Tipohard && tipo.DESCRIPCION) {
          const option = document.createElement("option");
          option.value = tipo.ID_Tipohard;
          option.textContent = tipo.DESCRIPCION;
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
async function cargarMarcasHardware() {
  try {
    const response = await fetch("http://localhost:3001/marca");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const marcasHardware = await response.json();
    const selectMarca = document.getElementById("marcaHardware");

    if (Array.isArray(marcasHardware) && marcasHardware.length > 0) {
      marcasHardware.forEach((marca) => {
        if (marca.ID_Marca && marca.DESCRIPCION) {
          const option = document.createElement("option");
          option.value = marca.ID_Marca;
          option.textContent = marca.DESCRIPCION;
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

// Función para cargar hardware filtrado por tipo y marca
async function cargarHardwarePorTipoYMarca() {
  const tipoHardware = document.getElementById("tipoHardware").value;
  const marcaHardware = document.getElementById("marcaHardware").value;
  const selectElement = document.getElementById("hardware");

  selectElement.innerHTML = ""; // Limpiar opciones anteriores

  try {
    const response = await fetch("http://localhost:3001/hardware");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Filtrar hardware por tipo y marca
    const hardwareFiltrado = data.filter((hardware) => {
      const coincideTipo =
        !tipoHardware || hardware.ID_Tipohard == tipoHardware;
      const coincideMarca =
        !marcaHardware || hardware.ID_Marca == marcaHardware;
      return coincideTipo && coincideMarca;
    });

    // Agregar opciones al select
    hardwareFiltrado.forEach((hardware) => {
      const option = document.createElement("option");
      option.value = hardware.ID_Hard;
      option.textContent = `${hardware.CARACTERISTICAS} - $${hardware.PRECIO_UNITARIO}`;
      selectElement.appendChild(option);
    });

    if (hardwareFiltrado.length === 0) {
      const option = document.createElement("option");
      option.textContent =
        "No hay hardware disponible con los filtros seleccionados.";
      selectElement.appendChild(option);
    }
  } catch (error) {
    console.error("Error al cargar el hardware filtrado:", error);
  }
}

// Función para finalizar el pedido
async function finalizarPedido(event) {
  event.preventDefault();

  // Captura de datos del formulario
  const cliente = document.getElementById("cliente").value;
  const fechaPedido = document.getElementById("fechaPedido").value;
  const tipoPedido = document.getElementById("tipoPedido").value;

  // Obtener los valores de los elementos ocultos
  const idMarca = document.getElementById("idMarca").textContent;
  const descripcion = document.getElementById("descripcion").textContent;

  // Validación de campos obligatorios
  if (!cliente || !fechaPedido || !tipoPedido) {
    alert("Por favor, complete todos los campos del pedido.");
    return;
  }

  // Array para almacenar los detalles del pedido
  const detalles = [];
  const filas = document
    .getElementById("detallesPedido")
    .querySelectorAll("tbody tr");

  // Recorre cada fila de la tabla para capturar detalles
  filas.forEach((fila) => {
    const detalle = {
      idHard: fila.cells[0].textContent, // ID del hardware
      cantidad: parseInt(fila.cells[4].textContent, 10), // Cantidad
    };
    detalles.push(detalle); // Agrega detalle al array
  });

  try {
    // Primero, se registra el pedido
    const response = await fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente,
        fechaPedido: new Date().toISOString().slice(0, 19).replace("T", " "),
        tipoPedido,
      }),
    });

    if (response.ok) {
      const { IDPedido } = await response.json(); // Obtener el ID del pedido creado
      console.log(detalle.idHard);

      // Luego, agregar los detalles al pedido
      for (const detalle of detalles) {
        const detalleResponse = await fetch(
          "http://localhost:3001/detallePedidos",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              IDPedido, // El ID del pedido
              IDHard: detalle.idHard, // ID del hardware
              CANTIDAD: detalle.cantidad, // Cantidad de hardware
            }),
          }
        );

        // Verificación de error al agregar detalle
        if (!detalleResponse.ok) {
          alert("Error al agregar detalle al pedido.");
          return;
        }
      }

      // Mensaje de éxito
      alert("Pedido registrado y detalles agregados exitosamente.");
      document.getElementById("formPedido").reset();
      document
        .getElementById("detallesPedido")
        .querySelector("tbody").innerHTML = ""; // Limpia la tabla
    } else {
      alert("Error al registrar el pedido.");
    }
  } catch (error) {
    console.error("Error al finalizar el pedido:", error);
  }
}

// Función para imprimir el comprobante del pedido
function imprimirComprobante() {
  const cliente =
    document.getElementById("cliente").selectedOptions[0].textContent;
  const fechaPedido = document.getElementById("fechaPedido").value;
  const tipoPedido =
    document.getElementById("tipoPedido").selectedOptions[0].textContent;

  let detallesHTML = `<h2>Comprobante de Pedido</h2>
    <p>Cliente: ${cliente}</p>
    <p>Fecha del Pedido: ${fechaPedido}</p>
    <p>Tipo de Pedido: ${tipoPedido}</p>
    <table border="1">
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Marca</th>
          <th>Características</th>
          <th>Precio Unitario</th>
          <th>Cantidad</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>`;

  const filas = document
    .getElementById("detallesPedido")
    .querySelectorAll("tbody tr");
  filas.forEach((fila) => {
    detallesHTML += `
      <tr>
        <td>${fila.cells[0].textContent}</td>
        <td>${fila.cells[1].textContent}</td>
        <td>${fila.cells[2].textContent}</td>
        <td>${fila.cells[3].textContent}</td>
        <td>${fila.cells[4].textContent}</td>
        <td>${fila.cells[6].textContent}</td>
      </tr>`;
  });

  detallesHTML += `</tbody></table>`;

  const nuevaVentana = window.open("", "_blank");
  nuevaVentana.document.write(detallesHTML);
  nuevaVentana.document.close();
  nuevaVentana.print();
}

async function agregarDetalle() {
  try {
    const hardwareSelect = document.getElementById("hardware");
    const cantidadInput = document.getElementById("cantidad");
    const tipoHardwareText =
      document.getElementById("tipoHardware").selectedOptions[0].text;
    const marcaHardwareText =
      document.getElementById("marcaHardware").selectedOptions[0].text;
    const cantidadPedida = parseInt(cantidadInput.value, 10);

    // Obtener el ID del hardware seleccionado
    const idHardwareSeleccionado = hardwareSelect.value;
    if (!idHardwareSeleccionado) {
      alert("Seleccione un hardware válido.");
      return;
    }

    // Obtener datos del hardware desde la API
    const response = await fetch(
      `http://localhost:3001/hardware/${idHardwareSeleccionado}`
    );
    const hardware = await response.json();
    console.log(hardware);
    console.log(hardware.PRECIO_UNITARIO);
    console.log(hardware.UNIDADES_DISPONIBLES);

    // Verificar que se obtuvieron los datos correctamente
    if (
      !hardware ||
      !hardware[0].PRECIO_UNITARIO ||
      !hardware[0].UNIDADES_DISPONIBLES
    ) {
      console.error("Datos del hardware incompletos o no encontrados.");
      alert("No se pudieron obtener los datos del hardware seleccionado.");
      return;
    }

    const precioUnitario = parseFloat(hardware[0].PRECIO_UNITARIO);
    const stockDisponible = parseInt(hardware[0].UNIDADES_DISPONIBLES, 10);

    // Verificar el stock disponible
    const estadoStock =
      cantidadPedida <= stockDisponible ? "Disponible" : "Sin Stock";

    // Agregar la fila a la tabla de detalles del pedido
    const detallesPedidoBody = document
      .getElementById("detallesPedido")
      .querySelector("tbody");
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>${tipoHardwareText}</td>
      <td>${marcaHardwareText}</td>
      <td>${hardware[0].CARACTERISTICAS}</td>
      <td>${precioUnitario.toFixed(2)}</td>
      <td>${cantidadPedida}</td>
      <td>${stockDisponible}</td>
      <td>${estadoStock}</td>
    `;
    detallesPedidoBody.appendChild(nuevaFila);
  } catch (error) {
    console.error("Error al agregar el detalle:", error);
    alert("Hubo un error al intentar agregar el detalle del pedido.");
  }
}

// Función para obtener información del cliente seleccionado
async function obtenerCliente(clienteId) {
  const response = await fetch(`http://localhost:3001/clientes/${clienteId}`);
  return await response.json();
}

// Actualizar el evento del select de cliente
document
  .getElementById("cliente")
  .addEventListener("change", async function () {
    const clienteSelect = this;
    const clienteId = clienteSelect.value;

    if (clienteId) {
      const cliente = await obtenerCliente(clienteId);
      const infoCliente = document.getElementById("infoCliente");
      infoCliente.innerHTML = `
      <strong>Domicilio:</strong> ${cliente.DIRECCION} <br />
      <strong>Teléfono:</strong> ${cliente.TELEFONO}
    `;
      infoCliente.style.display = "block";
    } else {
      document.getElementById("infoCliente").style.display = "none";
    }
    validarBotones();
  });

// Validar los botones
function validarBotones() {
  const cantidad = document.getElementById("cantidad").value;
  const clienteSeleccionado = document.getElementById("cliente").value;
  const detallesPedidoBody = document
    .getElementById("detallesPedido")
    .querySelector("tbody");
  const hayDetalles = detallesPedidoBody.children.length > 0;

  // Habilitar/Deshabilitar botón "Agregar al Pedido"
  document.querySelector("button[onclick='agregarDetalle()']").disabled = !(
    cantidad && clienteSeleccionado
  );

  // Habilitar/Deshabilitar botón "Finalizar Pedido"
  document.querySelector("button[type='submit']").disabled = !hayDetalles;
}

// Llamar a validarBotones cuando se cambia la cantidad
document.getElementById("cantidad").addEventListener("input", validarBotones);

// Modificar la función agregarDetalle para llamar a validarBotones
async function agregarDetalle() {
  try {
    const hardwareSelect = document.getElementById("hardware");
    const cantidadInput = document.getElementById("cantidad");
    const tipoHardwareText =
      document.getElementById("tipoHardware").selectedOptions[0].text;
    const marcaHardwareText =
      document.getElementById("marcaHardware").selectedOptions[0].text;
    const cantidadPedida = parseInt(cantidadInput.value, 10);

    // Obtener el ID del hardware seleccionado
    const idHardwareSeleccionado = hardwareSelect.value;
    if (!idHardwareSeleccionado) {
      alert("Seleccione un hardware válido.");
      return;
    }

    // Obtener datos del hardware desde la API
    const response = await fetch(
      `http://localhost:3001/hardware/${idHardwareSeleccionado}`
    );
    const hardware = await response.json();

    // Verificar que se obtuvieron los datos correctamente
    if (
      !hardware ||
      !hardware[0].PRECIO_UNITARIO ||
      !hardware[0].UNIDADES_DISPONIBLES
    ) {
      console.error("Datos del hardware incompletos o no encontrados.");
      alert("No se pudieron obtener los datos del hardware seleccionado.");
      return;
    }

    const precioUnitario = parseFloat(hardware[0].PRECIO_UNITARIO);
    const stockDisponible = parseInt(hardware[0].UNIDADES_DISPONIBLES, 10);

    // Verificar el stock disponible
    const estadoStock =
      cantidadPedida <= stockDisponible ? "Disponible" : "Sin Stock";

    // Agregar la fila a la tabla de detalles del pedido
    const detallesPedidoBody = document
      .getElementById("detallesPedido")
      .querySelector("tbody");
    const nuevaFila = document.createElement("tr");
    nuevaFila.innerHTML = `
      <td>${tipoHardwareText}</td>
      <td>${marcaHardwareText}</td>
      <td>${hardware[0].CARACTERISTICAS}</td>
      <td>${precioUnitario.toFixed(2)}</td>
      <td>${cantidadPedida}</td>
      <td>${stockDisponible}</td>
      <td>${estadoStock}</td>
    `;
    detallesPedidoBody.appendChild(nuevaFila);

    // Llamar a la función de validación de botones
    validarBotones();
  } catch (error) {
    console.error("Error al agregar el detalle:", error);
    alert("Hubo un error al intentar agregar el detalle del pedido.");
  }
}
