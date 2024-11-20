document.addEventListener("DOMContentLoaded", cargarPedidos);

function cargarPedidos() {
  fetch("http://localhost:3001/pedidos/presupuestado")
    .then((response) => response.json())
    .then((pedidos) => {
      const pedidosContainer = document.getElementById("presupuestoContainer");
      pedidosContainer.innerHTML = ""; // Limpia el contenedor antes de agregar nuevos pedidos

      pedidos.forEach((pedido, index) => {
        if (pedido.Condicion == 0) {
          pedido.Condicion = "Registrado";
        } else if (pedido.Condicion == 1) {
          pedido.Condicion = "Presupuestado";
        } else if (pedido.Condicion == 2) {
          pedido.Condicion = "Cancelado";
        } else if (pedido.Condicion == 3) {
          pedido.Condicion = "Finalizado";
        } else {
          pedido.Condicion = "Desconocido"; // O cualquier otro valor predeterminado
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
        pedidosContainer.appendChild(row);
      });
    })
    .catch((error) => console.error("Error al cargar los pedidos:", error));
}
