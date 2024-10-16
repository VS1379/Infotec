import { Router } from 'express';
import { hardwareController } from '../controllers/hardware.js';
export const hardwareRouter = Router();

// Obtener todo el hardware
hardwareRouter.get('/', hardwareController.getAll);

// Obtener hardware por ID
hardwareRouter.get('/:id_hard', hardwareController.getById);

// Crear nuevo hardware
hardwareRouter.post('/hardwareCrear', hardwareController.crear);

// Modificar hardware existente
hardwareRouter.patch('/:id_hard', hardwareController.modificar);

// Eliminar hardware
hardwareRouter.delete('/:id_hard', hardwareController.eliminar);
hardwareRouter.delete('/checkDependencies/:id', hardwareController.eliminar);
hardwareRouter.delete('/:id_hard', hardwareController.eliminar);

// Buscar hardware por campo
hardwareRouter.get('/buscar/:campo/:valor', hardwareController.buscarPorCampo);
