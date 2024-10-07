import { Router } from 'express';
import { socioController } from '../controllers/socios.js';
export const sociosRouter = Router();

// Obtener todos los socios
sociosRouter.get('/', socioController.getAll);

// Obtener socio por ID
sociosRouter.get('/:id_socio', socioController.getById);

// Crear nuevo socio
sociosRouter.post('/sociosCrear', socioController.crear);

// Modificar socio existente
sociosRouter.patch('/:id_socio', socioController.modificar);

// Eliminar socio
sociosRouter.delete('/:id_socio', socioController.eliminar);

