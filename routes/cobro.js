import { Router } from 'express';
import { cobroController } from '../controllers/cobros.js';

export const cobrosRouter = Router();

// Registrar un cobro
cobrosRouter.post('/cobrosRegistrar', cobroController.registrar);
