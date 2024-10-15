import { pedidoModel } from "../models/mysql/pedidos.js";

export class pedidoController {
  static async getAll(req, res) {
    try {
      const pedidos = await pedidoModel.getAll();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los pedidos" });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const pedido = await pedidoModel.getById(id);
      if (pedido) return res.json(pedido);
      res.status(404).json({ message: "Pedido no encontrado" });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el pedido" });
    }
  }

  static async crear(req, res) {
    try {
      const { cliente, fechaPedido, tipoPedido } = req.body;
      const nuevoPedido = await pedidoModel.crear({
        cliente,
        fechaPedido,
        tipoPedido,
      });
      res.status(201).json({ IDPedido: nuevoPedido.IDPedido });
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      res.status(500).json({ message: "Error al crear el pedido" });
    }
  }

  static async agregarDetalle(req, res) {
    try {
      const { id } = req.params;
      const detalle = req.body;
      await pedidoModel.agregarDetalle(id, detalle);
      res.status(201).json({ message: "Detalle agregado al pedido" });
    } catch (error) {
      res.status(500).json({ message: "Error al agregar detalle" });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id } = req.params;
      await pedidoModel.eliminar(id);
      res.json({ message: "Pedido eliminado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el pedido" });
    }
  }
  static async cancelar(req, res) {
    try {
      const { numeroPedido } = req.params;
      const pedido = await pedidoModel.getByNumeroPedido(numeroPedido);

      if (
        !pedido ||
        (pedido.condicion !== "Registrado" &&
          pedido.condicion !== "Presupuestado")
      ) {
        return res
          .status(400)
          .json({ message: "No se puede cancelar el pedido" });
      }

      // Actualizar la condición a "Cancelado"
      await pedidoModel.actualizarCondicion(numeroPedido, "Cancelado");

      res.json({ message: "Pedido cancelado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al cancelar el pedido" });
    }
  }
}