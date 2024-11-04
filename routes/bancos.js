import { Router } from 'express';
import { bancoController } from '../controllers/bancos.js';

export const bancoRouter = Router();

// Obtener todos los clientes
bancoRouter.get('/', bancoController.getAll);