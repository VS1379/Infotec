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

  static async create(req, res) {
    try {
      const banco = req.body;
      const result = await bancoModel.crear(banco);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el banco" });
    }
  }

  static async delete(req, res) {
    try {
      const { IdBanco } = req.params;
      const result = await bancoModel.eliminar(IdBanco);
      if (result) return res.status(204).end();
      res.status(404).json({ message: "banco no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el banco" });
    }
  }
  static async update(req, res) {
    try {
      const { IdBanco } = req.params;
      const nombre = req.body;

      const result = await bancoModel.update(IdBanco, nombre);
      if (result.affectedRows > 0) return res.json(result);
      res.status(404).json({ message: "Banco no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al modificar el Banco" });
    }
  }
}
