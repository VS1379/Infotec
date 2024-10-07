import { Router } from 'express';
import { proveedorController } from '../controllers/proveedores.js';
export const proveedoresRouter = Router();

// Obtener todos los proveedores
proveedoresRouter.get('/', proveedorController.getAll);

// Obtener proveedor por ID
proveedoresRouter.get('/:id_proveedor', proveedorController.getById);

// Crear nuevo proveedor
proveedoresRouter.post('/proveedoresCrear', proveedorController.crear);

// Modificar proveedor existente
proveedoresRouter.patch('/:id_proveedor', proveedorController.modificar);

// Eliminar proveedor
proveedoresRouter.delete('/:id_proveedor', proveedorController.eliminar);
