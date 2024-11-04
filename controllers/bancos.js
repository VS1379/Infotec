import { bancoModel } from "../models/mysql/bancos.js";

export class bancoController {
  static async getAll(req, res) {
    try {
      const bancos = await bancoModel.getAll();
      res.json(bancos);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los bancos" });
    }
  }
}
