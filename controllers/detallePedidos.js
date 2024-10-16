// controllers/detallePedidos.js
import { detallePedidosModel } from "../models/mysql/detallePedidos.js";

export class detallePedidosController {
  static async getAll(req, res) {
    try {
      const detalles = await detallePedidosModel.getAll();
      res.json(detalles);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los detalles de pedidos" });
    }
  }

  static async getById(req, res) {
    try {
      const { id_detalle } = req.params;
      const detalle = await detallePedidosModel.getById(id_detalle);
      if (detalle.length > 0) return res.json(detalle);
      res.status(404).json({ message: "Detalle de pedido no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener el detalle de pedido" });
    }
  }

  static async crear(req, res) {
    try {
      const { IDPedido, IDHard, CANTIDAD } = req.body;

      //console.log(req.body);

      if (!IDPedido || !IDHard || CANTIDAD <= 0) {
        return res
          .status(400)
          .json({ message: "IDPedido, IDHard y CANTIDAD son obligatorios" });
      }

      const result = await detallePedidosModel.crear({
        IDPedido,
        IDHard,
        CANTIDAD,
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el detalle de pedido" });
    }
  }

  static async modificar(req, res) {
    try {
      const { id_detalle } = req.params;
      const detalle = req.body;

      const result = await detallePedidosModel.modificar(id_detalle, detalle);
      if (result.affectedRows > 0) return res.json(result);
      res.status(404).json({ message: "Detalle de pedido no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al modificar el detalle de pedido" });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id_detalle } = req.params;
      const result = await detallePedidosModel.eliminar(id_detalle);
      if (result) return res.status(204).end();
      res.status(404).json({ message: "Detalle de pedido no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el detalle de pedido" });
    }
  }

  static async buscarPorCampo(req, res) {
    try {
      const { campo, valor } = req.params;
      const detalles = await detallePedidosModel.buscarPorCampo(campo, valor);
      if (detalles.length > 0) return res.json(detalles);
      res.status(404).json({ message: "Detalles de pedido no encontrados" });
    } catch (error) {
      res.status(500).json({ message: "Error al buscar el detalle de pedido" });
    }
  }
}
