import { Router } from "express";
import { proveedorController } from "../controllers/proveedores.js";

export const proveedoresRouter = Router();

proveedoresRouter.get("/proveedor", proveedorController.getAll);
proveedoresRouter.get("/proveedor/:id", proveedorController.getById);
proveedoresRouter.post("/proveedor", proveedorController.crear);
proveedoresRouter.put("/proveedor/:id", proveedorController.modificar);
proveedoresRouter.delete("/proveedor/:id", proveedorController.eliminar);
