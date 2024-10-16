import { Router } from "express";
import { tipoHardwareController } from "../controllers/tipoHardware.js";
export const tipoHardwareRouter = Router();

// Obtener todos los tipos de hardware
tipoHardwareRouter.get("/", tipoHardwareController.getAll);

// Obtener tipo de hardware por ID
tipoHardwareRouter.get("/:id_tipohard", tipoHardwareController.getById);

// Crear nuevo tipo de hardware
tipoHardwareRouter.post("/tipoHardwareCrear", tipoHardwareController.crear);

// Modificar tipo de hardware existente
tipoHardwareRouter.patch("/:id_tipohard", tipoHardwareController.modificar);

// Eliminar tipo de hardware
tipoHardwareRouter.delete("/:id_tipohard", tipoHardwareController.eliminar);
tipoHardwareRouter.get(
  "/verificarDependencias/:id_tipohard",
  tipoHardwareController.verificarDependencias
);
tipoHardwareRouter.delete(
  "/eliminarConConfirmacion/:id_tipohard",
  tipoHardwareController.eliminarConConfirmacion
);

// Buscar tipo de hardware por campo
tipoHardwareRouter.get(
  "/buscar/:campo/:valor",
  tipoHardwareController.buscarPorCampo
);
