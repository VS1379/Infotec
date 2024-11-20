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

  static async crear(req, res) {
    try {
      const tipo = req.body;
      const result = await bancoModel.crear(tipo);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el banco" });
    }
  }

  static async eliminar(req, res) {
    try {
      const { id_banco } = req.params;
      const result = await bancoModel.eliminar(id_banco);
      if (result) return res.status(204).end();
      res.status(404).json({ message: "banco no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el banco" });
    }
  }
}
