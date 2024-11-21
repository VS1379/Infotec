import { Router } from 'express';
import { bancoController } from '../controllers/bancos.js';

export const bancoRouter = Router();

// Obtener todos los bancos
bancoRouter.get('/', bancoController.getAll);

bancoRouter.post('/', bancoController.create);

bancoRouter.delete('/:IdBanco', bancoController.delete);

bancoRouter.patch('/:IdBanco', bancoController.update);

