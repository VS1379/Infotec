import { Router } from 'express';
import { marcaController } from '../controllers/marca.js';
export const marcaRouter = Router();

// Obtener todas las marcas
marcaRouter.get('/', marcaController.getAll);

// Obtener marca por ID
marcaRouter.get('/:id_marca', marcaController.getById);

// Crear nueva marca
marcaRouter.post('/marcaCrear', marcaController.crear);

// Modificar marca existente
marcaRouter.patch('/:id_marca', marcaController.modificar);

// Eliminar marca
marcaRouter.delete('/:id_marca', marcaController.eliminar);

// Buscar marca por campo
marcaRouter.get('/buscar/:campo/:valor', marcaController.buscarPorCampo);
