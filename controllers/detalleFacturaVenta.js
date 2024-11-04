import { detalleFacturaModel } from "../models/mysql/detalleFacturaVenta.js";

export class detalleFacturaController {
  static async getAll(req, res) {
    try {
      const detalles = await detalleFacturaModel.getAll();
      res.json(detalles);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los detalles de factura" });
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
      res
        .status(500)
        .json({ message: "Error al obtener el detalle de factura" });
    }
  }

  static async crear(req, res) {
    try {
      const detalle = req.body;
      const nuevoDetalleId = await detalleFacturaModel.crear(detalle);
      res
        .status(201)
        .json({ message: "Detalle creado exitosamente", id: nuevoDetalleId });
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
      res
        .status(500)
        .json({ message: "Error al eliminar el detalle de factura" });
    }
  }

  static async crearCobro(req, res) {
    try {
      const { numeroFactura, fecha, monto, formaPago, numeroCheque, banco } =
        req.body;
      const nuevoCobroId = await detalleFacturaModel.crear({
        numeroFactura,
        fecha,
        monto,
        formaPago,
        numeroCheque,
        banco,
      });
      res
        .status(201)
        .json({ message: "Cobro registrado exitosamente", id: nuevoCobroId });
    } catch (error) {
      res.status(500).json({ message: "Error al registrar el cobro", error });
    }
  }

  static async actualizarCuotas(req, res) {
    try {
      const { numeroFactura } = req.params;
      const facturaActualizada = await detalleFacturaModel.actualizarCuotas(numeroFactura);

      if (facturaActualizada) {
        res.json({ message: "Cuotas actualizadas exitosamente" });
      } else {
        res.status(404).json({ message: "Factura no encontrada o ya pagada" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al actualizar las cuotas", error });
    }
  }
}
