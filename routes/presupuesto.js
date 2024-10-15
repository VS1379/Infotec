import { Router } from 'express';
import { presupuestoController } from '../controllers/presupuestos.js';

export const presupuestosRouter = Router();

// Crear un nuevo presupuesto
presupuestosRouter.post('/presupuestosCrear', presupuestoController.crear);

// Obtener un presupuesto por número de pedido
presupuestosRouter.get('/:numeroPedido', presupuestoController.getByNumeroPedido);
