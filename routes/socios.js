import { Router } from 'express';
import { socioController } from '../controllers/socios.js';
export const sociosRouter = Router();

// Obtener todos los socios
sociosRouter.get('/', socioController.getAll);

// Obtener socio por DNI
sociosRouter.get('/:dni', socioController.getById);

// Obtener un cliente por campo
sociosRouter.get('/buscar/campo', socioController.getByField);

// Crear nuevo socio
sociosRouter.post('/sociosCrear', socioController.crear);

// Modificar socio existente
sociosRouter.patch('/:dni', socioController.modificar);

// Eliminar socio
sociosRouter.delete('/:dni', socioController.eliminar);

