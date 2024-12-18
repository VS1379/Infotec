import { Router } from 'express';
import { detalleFacturaController } from '../controllers/detalleFacturaVenta.js';

export const detalleFacturaRouter = Router();

// Obtener todos los detalles de factura
detalleFacturaRouter.get('/', detalleFacturaController.getAll);

// Obtener un detalle de factura por ID
detalleFacturaRouter.get('/:id', detalleFacturaController.getById);

// Crear un nuevo detalle de factura
detalleFacturaRouter.post('/', detalleFacturaController.crear);

// Eliminar un detalle de factura
detalleFacturaRouter.delete('/:id', detalleFacturaController.eliminar);

detalleFacturaRouter.post('/cobrar/', detalleFacturaController.crearCobro);

