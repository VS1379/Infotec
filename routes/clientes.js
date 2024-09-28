import { Router } from 'express';
import { clienteController } from '../controllers/clientes.js';

export const clientesRouter = Router();

// Obtener todos los clientes
clientesRouter.get('/clientes', clienteController.getAll);

// Obtener un cliente por ID
clientesRouter.get('/clientes/:dni', clienteController.getById);

// Crear un nuevo cliente
clientesRouter.post('/clientesCrear', clienteController.crear);

// Modificar un cliente existente
clientesRouter.patch('/clientes/:dni', clienteController.modificar);

// Eliminar un cliente
clientesRouter.delete('/clientes/:dni', clienteController.eliminar);
