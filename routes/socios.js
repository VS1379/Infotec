import { Router } from "express";
import { socioController } from "../controllers/socios.js";

export const sociosRouter = Router();

sociosRouter.get("/socio", socioController.getAll);
sociosRouter.get("/socio/:id", socioController.getById);
sociosRouter.post("/socio", socioController.crear);
sociosRouter.put("/socio/:id", socioController.modificar);
sociosRouter.delete("/socio/:id", socioController.eliminar);
