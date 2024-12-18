document.addEventListener("DOMContentLoaded", () => {
  cargarClientes();
  cargarTiposHardware();
  cargarMarcasHardware();
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
  const idHardwareSeleccionado = document.getElementById(
    "idHardwareSeleccionado"
  );

  selectElement.innerHTML = ""; // Limpiar opciones anteriores
  idHardwareSeleccionado.value = ""; // Limpiar el ID del hardware seleccionado

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
      option.textContent = `${hardware.CARACTERISTICAS} - $${hardware.PRECIO_UNITARIO} Cant. ${hardware.UNIDADES_DISPONIBLES}`;
      selectElement.appendChild(option);
    });

    if (hardwareFiltrado.length === 0) {
      const option = document.createElement("option");
      option.textContent =
        "No hay hardware disponible con los filtros seleccionados.";
      selectElement.appendChild(option);
    }

    // Actualizar el campo oculto cuando el usuario cambie la selección
    selectElement.addEventListener("change", () => {
      idHardwareSeleccionado.value = selectElement.value;
    });

    // Si hay al menos un hardware disponible, seleccionar el primero automáticamente
    if (hardwareFiltrado.length > 0) {
      selectElement.selectedIndex = 0;
      idHardwareSeleccionado.value = selectElement.value;
    }
  } catch (error) {
    console.error("Error al cargar el hardware filtrado:", error);
  }
}


const formulario = document.getElementById("formPedido");

formulario.addEventListener("submit", function (event) {
  event.preventDefault(); // Previene el comportamiento por defecto

  if (formulario.dataset.enviando === "true") {
    return; // Si ya se está enviando, evita que se ejecute de nuevo
  }

  formulario.dataset.enviando = "true";

  // Lógica para enviar los datos al servidor

  formulario.dataset.enviando = "false"; // Reinicia el estado cuando termine el envío
});

function agregarHardware(idHardware, descripcion, precio, cantidad) {
  const tbody = document.querySelector("#detallesPedido tbody");
  const fila = document.createElement("tr");

  fila.innerHTML = `
      <td>${descripcion}</td>
      <td>${precio}</td>
      <td contenteditable="true">${cantidad}</td>
      <td>
          <input type="hidden" value="${idHardware}" /> <!-- ID del hardware oculto -->
          <button class="eliminar">Eliminar</button>
      </td>
  `;

  tbody.appendChild(fila);
}

function agregarHardwareATabla() {
  const selectElement = document.getElementById("hardware");
  const tabla = document.getElementById("tablaHardware"); // Asegúrate de que esta tabla esté en tu HTML
  const selectedOption = selectElement.options[selectElement.selectedIndex];

  // Verifica que se haya seleccionado una opción válida
  if (selectedOption.value) {
    const idHard = selectedOption.value;
    const descripcion = selectedOption.textContent;

    // Crear una nueva fila en la tabla
    const nuevaFila = tabla.insertRow();
    const celdaDescripcion = nuevaFila.insertCell(0);
    const celdaPrecio = nuevaFila.insertCell(1);
    const celdaIdHard = nuevaFila.insertCell(2); // Celda para ID_Hard

    celdaDescripcion.textContent = descripcion;
    celdaPrecio.textContent = `$${getPrecioUnitario(idHard)}`; // Implementa getPrecioUnitario según tu lógica

    // Agregar el ID_Hard como un campo oculto
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.value = idHard;
    celdaIdHard.appendChild(hiddenInput);

    // Puedes agregar más celdas según sea necesario
  } else {
    alert("Por favor, selecciona un hardware válido.");
  }
}

// Función para finalizar el pedido
async function finalizarPedido(event) {
  event.preventDefault();

  // Captura de datos del formulario
  const cliente = document.getElementById("cliente").value;
  const fechaPedido = document.getElementById("fechaPedido").value;
  const tipoPedido = document.getElementById("tipoPedido").value;

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
    // Asegúrate de que el índice de la celda sea el correcto para idHard
    const idHard = fila.cells[7].textContent.trim(); // ID del hardware
    const cantidad = parseInt(fila.cells[4].textContent.trim(), 10); // Cantidad

    // Validación de datos de la fila
    if (!idHard || isNaN(cantidad) || cantidad <= 0) {
      alert(
        "Hay un error en los detalles del pedido. Verifique las cantidades."
      );
      return;
    }

    // Agregar el detalle al array
    detalles.push({
      idHard,
      cantidad,
    });
  });

  if (detalles.length === 0) {
    alert("Debe agregar al menos un hardware al pedido.");
    return;
  }

  try {
    // Registro del pedido
    const response = await fetch("http://localhost:3001/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cliente,
        fechaPedido: new Date(fechaPedido)
          .toISOString()
          .slice(0, 19)
          .replace("T", " "),
        tipoPedido,
      }),
    });

    // Verificación de la respuesta
    if (!response.ok) {
      throw new Error("Error al registrar el pedido.");
    }

    const { IDPedido } = await response.json();

    for (const detalle of detalles) {
      const detalleResponse = await fetch(
        "http://localhost:3001/detallePedidos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            IDPedido,
            IDHard: detalle.idHard,
            CANTIDAD: detalle.cantidad,
          }),
        }
      );

      // Verificación de errores al agregar detalle
      if (!detalleResponse.ok) {
        throw new Error("Error al agregar detalle al pedido.");
      }
    }

    // Mensaje de éxito y limpieza del formulario
    alert("Pedido registrado y detalles agregados exitosamente.");
    imprimirComprobante();
    document.getElementById("formPedido").reset();
    document.getElementById("detallesPedido").querySelector("tbody").innerHTML =
      "";
  } catch (error) {
    console.error("Error al finalizar el pedido:", error);
    alert(error.message);
  }
  setTimeout(() => {
    location.reload();
  }, 3000);
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
  });

// Modificar la función agregarDetalle para llamar a validarBotones
function agregarDetalle() {
  const fechaPedido = document.getElementById("fechaPedido").value; // Obtener la fecha seleccionada
  const hardwareSelect = document.getElementById("hardware");
  const idHardware = hardwareSelect.value;
  const hardwareTexto = hardwareSelect.selectedOptions[0].textContent;
  const cantidad = document.getElementById("cantidad").value;

  // Validaciones
  if (!fechaPedido) {
    alert("Debe seleccionar una fecha para el pedido.");
    return;
  }

  if (
    !idHardware ||
    hardwareTexto === "No hay hardware disponible con los filtros seleccionados."
  ) {
    alert("Debe seleccionar un hardware válido.");
    return;
  }

  if (!cantidad || isNaN(cantidad) || cantidad <= 0) {
    alert("Debe ingresar una cantidad mayor a 0.");
    return;
  }

  // Si todas las validaciones pasan, agregar el detalle
  const tipoHardware =
    document.getElementById("tipoHardware").selectedOptions[0].textContent;
  const marcaHardware =
    document.getElementById("marcaHardware").selectedOptions[0].textContent;

  // Obtener precio y stock del texto del hardware seleccionado
  const partes = hardwareTexto.split(" - $");
  const precio = partes[1]?.split(" Cant. ")[0]; // Extraer precio unitario
  const stock = parseInt(partes[1]?.split(" Cant. ")[1], 10); // Extraer unidades disponibles
  const estado = stock >= cantidad ? "Disponible" : "Sin stock";

  // Crear la fila para la tabla de detalles del pedido
  const tbody = document.querySelector("#detallesPedido tbody");
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${tipoHardware}</td>
    <td>${marcaHardware}</td>
    <td>${hardwareTexto}</td>
    <td>$${precio}</td>
    <td>${cantidad}</td>
    <td>${stock}</td>
    <td>${estado}</td>
    <td style="display: none;">${idHardware}</td>
  `;

  tbody.appendChild(fila);

  // Limpiar los campos después de agregar el detalle
  document.getElementById("cantidad").value = "";
  document.getElementById("hardware").selectedIndex = 0;
  alert("Detalle agregado exitosamente.");
}

