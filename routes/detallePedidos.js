// routes/detallePedidos.js
import { Router } from "express";
import { detallePedidosController } from "../controllers/detallePedidos.js";

export const detallePedidosRouter = Router();

// Obtener todos los detalles de pedidos
detallePedidosRouter.get("/", detallePedidosController.getAll);

// Obtener detalle por ID
detallePedidosRouter.get("/:id_detalle", detallePedidosController.getById);

// Crear nuevo detalle de pedido
detallePedidosRouter.post("/", detallePedidosController.crear);

// Modificar detalle existente
detallePedidosRouter.patch("/:id_detalle", detallePedidosController.modificar);

// Eliminar detalle
detallePedidosRouter.delete("/:id_detalle", detallePedidosController.eliminar);

// Buscar detalle por campo
detallePedidosRouter.get(
  "/buscar/:campo/:valor",
  detallePedidosController.buscarPorCampo
);
