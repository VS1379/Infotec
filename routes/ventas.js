import { Router } from 'express';
import { ventaController } from '../controllers/ventas.js';

export const ventasRouter = Router();

// Crear una nueva venta
ventasRouter.post('/ventasCrear', ventaController.crear);

// Modificar un item en la venta
ventasRouter.patch('/:numeroFactura/items/:idItem', ventaController.modificarItem);

// Eliminar un item de la venta
ventasRouter.delete('/:numeroFactura/items/:idItem', ventaController.eliminarItem);

// Obtener los detalles de una venta por número de factura
ventasRouter.get('/:numeroFactura', ventaController.getByNumeroFactura);
