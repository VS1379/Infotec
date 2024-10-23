// routes/detallePedidos.js
import { Router } from "express";
import { detallePedidosController } from "../controllers/detallePedidos.js";

export const detallePedidosRouter = Router();

// Obtener todos los detalles de pedidos
detallePedidosRouter.get("/", detallePedidosController.getAll);

// Obtener detalle por ID
detallePedidosRouter.get("/:id_pedido", detallePedidosController.getById);

// Crear nuevo detalle de pedido
detallePedidosRouter.post("/", detallePedidosController.crear);

// Modificar en gral
detallePedidosRouter.patch("/:id_pedido", detallePedidosController.modificar);

// Modificar por id hard
detallePedidosRouter.patch("/modificarCantidad/:id_pedido/", detallePedidosController.modificarCantidad);

// Eliminar detalle
detallePedidosRouter.delete("/:id_pedido", detallePedidosController.eliminar);

// Buscar detalle por campo
detallePedidosRouter.get(
  "/buscar/:campo/:valor",
  detallePedidosController.buscarPorCampo
);
