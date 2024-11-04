import { Router } from "express";
import { ventaController } from "../controllers/facturaVentas.js";

export const ventasRouter = Router();

// Crear una nueva venta
ventasRouter.get("/", ventaController.getAll);

//cobrar
ventasRouter.get("/cobrar/", ventaController.getAllCobrar);

// Obtener los detalles de una venta por número de factura
ventasRouter.get("/:numeroFactura", ventaController.getByNumeroFactura);

// Crear una nueva venta
ventasRouter.post("/ventasCrear", ventaController.crear);

// Modificar un item en la venta
ventasRouter.patch("/:numeroFactura/items/:idItem", ventaController.modificar);

// Eliminar un item de la venta
ventasRouter.delete(
  "/:numeroFactura/items/:idItem",
  ventaController.eliminarItem
);
