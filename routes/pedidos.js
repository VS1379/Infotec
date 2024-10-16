import { Router } from 'express';
import { pedidoController } from '../controllers/pedidos.js';

export const pedidosRouter = Router();

// Obtener todos los pedidos
pedidosRouter.get('/', pedidoController.getAll);

// Obtener un pedido por ID
pedidosRouter.get('/:id', pedidoController.getById);

// Crear un nuevo pedido
pedidosRouter.post('/', pedidoController.crear);

// Agregar un detalle a un pedido existente
pedidosRouter.post('/:id/detalles', pedidoController.agregarDetalle);

// Eliminar un pedido
pedidosRouter.delete('/:id', pedidoController.eliminar);

// Dar de baja un pedido
pedidosRouter.put('/cancelar/:numeroPedido', pedidoController.cancelar);

