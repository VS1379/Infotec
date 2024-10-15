import { presupuestoModel } from '../models/mysql/presupuestos.js';
import { pedidoModel } from '../models/mysql/pedidos.js';

export class presupuestoController {
  static async crear(req, res) {
    try {
      const { numeroPedido, formasDePago } = req.body;
      // Obtener los detalles del pedido para el presupuesto
      const pedido = await pedidoModel.getByNumeroPedido(numeroPedido);

      if (!pedido) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      // Crear el presupuesto
      await presupuestoModel.crear({ numeroPedido, formasDePago });

      // Actualizar la condición del pedido a "Presupuestado"
      await pedidoModel.actualizarCondicion(numeroPedido, 'Presupuestado');

      res.status(201).json({ message: 'Presupuesto creado exitosamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el presupuesto' });
    }
  }

  static async getByNumeroPedido(req, res) {
    try {
      const { numeroPedido } = req.params;
      const presupuesto = await presupuestoModel.getByNumeroPedido(numeroPedido);

      if (!presupuesto) {
        return res.status(404).json({ message: 'Presupuesto no encontrado' });
      }

      res.json(presupuesto);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el presupuesto' });
    }
  }
}

