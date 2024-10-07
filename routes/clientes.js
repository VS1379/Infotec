import { Router } from 'express';
import { clienteController } from '../controllers/clientes.js';

export const clientesRouter = Router();

// Obtener todos los clientes
clientesRouter.get('/', clienteController.getAll);

// Obtener un cliente por ID
clientesRouter.get('/:dni', clienteController.getById);

// Obtener un cliente por campo
clientesRouter.get('/buscar/campo', clienteController.getByField);

// Crear un nuevo cliente
clientesRouter.post('/clientesCrear', clienteController.crear);

// Modificar un cliente existente
clientesRouter.patch('/:dni', clienteController.modificar);

// Eliminar un cliente
clientesRouter.delete('/:dni', clienteController.eliminar);
