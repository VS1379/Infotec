import { Router } from "express";
import { pedidoController } from "../controllers/pedidos.js";

export const pedidosRouter = Router();

// Obtener todos los pedidos
pedidosRouter.get("/", pedidoController.getAll);

// Obtener todos los pedidos Registrados
pedidosRouter.get("/registrado", pedidoController.getAllRegistrado);

// Obtener todos los pedidos Presupuestado
pedidosRouter.get("/presupuestado", pedidoController.getAllPresupuestado);

// Obtener todos los pedidos Cancelado
pedidosRouter.get("/cancelado", pedidoController.getAllCancelado);

// Obtener todos los pedidos Finalizado
pedidosRouter.get("/finalizado", pedidoController.getAllFinalizado);

// Obtener un pedido por ID
pedidosRouter.get("/:id", pedidoController.getById);

// Crear un nuevo pedido
pedidosRouter.post("/", pedidoController.crear);

// Agregar un detalle a un pedido existente
pedidosRouter.post("/:id/detalles", pedidoController.agregarDetalle);

// Eliminar un pedido
pedidosRouter.delete("/:id", pedidoController.eliminar);

// Cancelar un pedido
pedidosRouter.patch("/cancelar/:numeroPedido", pedidoController.cancelar);
