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
  static async getAllRegistrado(req, res) {
    try {
      const pedidos = await pedidoModel.getAllRegistrado();
      res.json(pedidos);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los pedidos Registrados" });
    }
  }
  static async getAllPresupuestado(req, res) {
    try {
      const pedidos = await pedidoModel.getAllPresupuestado();
      res.json(pedidos);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los Pedidos Presupuestados" });
    }
  }
  static async getAllCancelado(req, res) {
    try {
      const pedidos = await pedidoModel.getAllCancelado();
      res.json(pedidos);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los Pedidos Cancelados" });
    }
  }
  static async getAllFinalizado(req, res) {
    try {
      const pedidos = await pedidoModel.getAllFinalizado();
      res.json(pedidos);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los Pedidos Finalizados" });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const pedido = await pedidoModel.getById(id);
      if (pedido) return res.json(pedido);
      res.status(404).json({ message: `Pedido no encontrado ${id}` });
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

      const pedido = await pedidoModel.getById(numeroPedido);

      if (!pedido || pedido.condicion === 1) {
        return res
          .status(400)
          .json({ message: "No se puede Cancelar el pedido" });
      }
      // Actualizar la condición a "Cancelado"
      await pedidoModel.actualizarCondicion(numeroPedido, 2);

      res.json({ message: "Pedido cancelado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al Cancelar el pedido" });
    }
  }

  static async presupuestar(req, res) {
    try {
      const { numeroPedido } = req.params;

      const pedido = await pedidoModel.getById(numeroPedido);

      if (!pedido || pedido.condicion === 2) {
        return res
          .status(400)
          .json({ message: "No se puede Presupuestar el pedido" });
      }
      // Actualizar la condición a "Cancelado"
      await pedidoModel.actualizarCondicion(numeroPedido, 1);

      res.json({ message: "Pedido cancelado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al Presupuestar el pedido" });
    }
  }
}
