import express from 'express';
import { hardwareController } from '../controllers/hardware.js';

export const hardwareRouter = express.Router();

// Obtener todos los hardware
hardwareRouter.get('/', hardwareController.getAll);

// Obtener hardware por ID
hardwareRouter.get('/:id', hardwareController.getById);

// Crear nuevo hardware
hardwareRouter.post('/', hardwareController.crear);

// Modificar hardware existente
hardwareRouter.put('/:id', hardwareController.modificar);

// Eliminar hardware por ID
hardwareRouter.delete('/:id', hardwareController.eliminar);
