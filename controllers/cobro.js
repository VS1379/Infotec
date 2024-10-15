import { cobroModel } from '../models/mysql/cobros.js';
import { ventaModel } from '../models/mysql/ventas.js';

export class cobroController {
  static async registrar(req, res) {
    try {
      const { numeroFactura, fecha, monto, formaPago, numeroCheque, banco } = req.body;
      const venta = await ventaModel.getByNumeroFactura(numeroFactura);

      if (!venta) {
        return res.status(404).json({ message: 'Factura no encontrada' });
      }

      if (venta.cuotas <= 0) {
        return res.status(400).json({ message: 'La factura ya está totalmente pagada' });
      }

      // Registrar el cobro
      await cobroModel.registrar({ numeroFactura, fecha, monto, formaPago, numeroCheque, banco });

      // Actualizar la cantidad de cuotas restantes en la venta
      await ventaModel.actualizarCuotas(numeroFactura, venta.cuotas - 1);

      res.status(201).json({ message: 'Cobro registrado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el cobro' });
    }
  }
}
