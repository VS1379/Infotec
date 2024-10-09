import { Router } from 'express';
import { proveedorController } from '../controllers/proveedores.js';
export const proveedoresRouter = Router();

// Obtener todos los proveedores
proveedoresRouter.get('/', proveedorController.getAll);

// Obtener proveedor por ID
proveedoresRouter.get('/:cuit', proveedorController.getById);

// Obtener un cliente por campo
proveedoresRouter.get('/buscar/campo', proveedorController.getByField);

// Crear nuevo proveedor
proveedoresRouter.post('/proveedoresCrear', proveedorController.crear);

// Modificar proveedor existente
proveedoresRouter.patch('/:cuit', proveedorController.modificar);

// Eliminar proveedor
proveedoresRouter.delete('/:cuit', proveedorController.eliminar);
