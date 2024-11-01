import { Router } from "express";
import { presupuestoController } from "../controllers/presupuesto.js";

export const presupuestosRouter = Router();

// Obtener Todos los Presupuestos
presupuestosRouter.get("/", presupuestoController.getAll);

// Crear un nuevo presupuesto
presupuestosRouter.post("/presupuestosCrear", presupuestoController.crear);

// Obtener un presupuesto por número de pedido
presupuestosRouter.get(
  "/:numeroPedido",
  presupuestoController.getByNumeroPedido
);
