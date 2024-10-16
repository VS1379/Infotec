import { detalleFacturaModel } from "../models/mysql/detalleFactura.js";

export class detalleFacturaController {
  static async getAll(req, res) {
    try {
      const detalles = await detalleFacturaModel.getAll();
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los detalles de factura" });
    }
  }

  static async getById(req, res) {
    try {
      const detalle = await detalleFacturaModel.getById(req.params.id);
      if (!detalle) {
        return res.status(404).json({ message: "Detalle no encontrado" });
      }
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el detalle de factura" });
    }
  }

  static async crear(req, res) {
    try {
      const detalle = req.body;
      const nuevoDetalleId = await detalleFacturaModel.crear(detalle);
      res.status(201).json({ message: "Detalle creado exitosamente", id: nuevoDetalleId });
    } catch (error) {
      res.status(500).json({ message: "Error al crear el detalle de factura" });
    }
  }

  static async eliminar(req, res) {
    try {
      const id = req.params.id;
      const eliminado = await detalleFacturaModel.eliminar(id);
      if (!eliminado) {
        return res.status(404).json({ message: "Detalle no encontrado" });
      }
      res.json({ message: "Detalle eliminado exitosamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el detalle de factura" });
    }
  }
}
