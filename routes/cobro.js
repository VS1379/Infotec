import { Router } from "express";
import { cobroController } from "../controllers/cobro.js";

export const cobroRouter = Router();

cobroRouter.get("/", cobroController.getAll)

cobroRouter.post("/", cobroController.crear);

cobroRouter.patch(
  "/actualizar-cuotas/:numeroFactura",
  cobroController.actualizarCuotas
);
