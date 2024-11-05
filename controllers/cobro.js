import { cobroModel } from "../models/mysql/cobro.js";
import { ventaModel } from "../models/mysql/facturaVentas.js";

export class cobroController {
  static async getAll(req, res) {
    try {
      const cobros = await cobroModel.getAll();
      res.json(cobros);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los cobros" });
    }
  }

  static async crear(req, res) {
    try {
      const { numeroFactura, fecha, monto, formaPago, numeroCheque, banco } =
        req.body;
      const nuevoCobroId = await cobroModel.crear({
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
      const facturaActualizada = await ventaModel.restarCuota(numeroFactura);
      
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
