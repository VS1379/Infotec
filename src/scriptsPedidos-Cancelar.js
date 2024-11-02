document.addEventListener("DOMContentLoaded", cargarPedidos);

function cargarPedidos() {
  fetch("http://localhost:3001/pedidos/registrado")
    .then((response) => response.json())
    .then((pedidos) => {
      const pedidosContainer = document.getElementById("pedidosContainer");
      pedidosContainer.innerHTML = ""; // Limpia el contenedor antes de agregar nuevos pedidos

      pedidos.forEach((pedido, index) => {
        if (pedido.Condicion == 0) {
          pedido.Condicion = "Registrado";
        }

        if (pedido.TipoPedido == 1) {
          pedido.TipoPedido = "Presupuesto";
        } else if (pedido.TipoPedido == 2) {
          pedido.TipoPedido = "Licitacion";
        } else {
          pedido.TipoPedido = "Compra Directa";
        }

        pedido.FechaHora = new Date(pedido.FechaHora);

        const opciones = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };

        pedido.FechaHora = pedido.FechaHora.toLocaleString("es-AR", opciones);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${pedido.IDPedido}</td>
            <td>${pedido.IDCliente}</td>
            <td>${pedido.FechaHora}</td>
            <td>${pedido.Condicion}</td>
            <td>${pedido.TipoPedido}</td>
          `;

        // Botón de cancelar
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancelar";
        cancelBtn.onclick = () => cancelarPedido(pedido.IDPedido);
        row.appendChild(cancelBtn);

        pedidosContainer.appendChild(row);
      });
    })
    .catch((error) => console.error("Error al cargar los pedidos:", error));

  fetch("http://localhost:3001/pedidos/presupuestado")
    .then((response) => response.json())
    .then((pedidos) => {
      const pedidosContainer = document.getElementById("pedidosContainer");

      pedidos.forEach((pedido, index) => {
        if (pedido.Condicion == 1) {
          pedido.Condicion = "Presupuestado";
        }

        if (pedido.TipoPedido == 1) {
          pedido.TipoPedido = "Presupuesto";
        } else if (pedido.TipoPedido == 2) {
          pedido.TipoPedido = "Licitacion";
        } else {
          pedido.TipoPedido = "Compra Directa";
        }

        pedido.FechaHora = new Date(pedido.FechaHora);

        const opciones = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };

        pedido.FechaHora = pedido.FechaHora.toLocaleString("es-AR", opciones);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}                        </td>
            <td>${pedido.IDPedido}                  </td>
            <td>${pedido.IDCliente}                 </td>
            <td>${pedido.FechaHora}                 </td>
            <td>${pedido.Condicion}                 </td>
            <td>${pedido.TipoPedido}                </td>
          `;

        // Botón de cancelar
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancelar";
        cancelBtn.onclick = () => cancelarPedido(pedido.IDPedido);
        row.appendChild(cancelBtn);

        pedidosContainer.appendChild(row);
      });
    })
    .catch((error) => console.error("Error al cargar los pedidos:", error));
}

function cancelarPedido(pedidoId) {
  const confirmacion = confirm(
    "¿Estás seguro de que deseas cancelar este pedido?"
  );
  if (confirmacion) {
    fetch(`http://localhost:3001/pedidos/cancelar/${pedidoId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Pedido cancelado exitosamente.");
          cargarPedidos();
        } else {
          response.json().then((data) => {
            alert(data.error || "No se pudo cancelar el pedido.");
          });
        }
      })
      .catch((error) => console.error("Error al cancelar el pedido:", error));
  }
}
