import { tipoHardwareModel } from "../models/mysql/tipoHardware.js";

export class tipoHardwareController {
  static async getAll(req, res) {
    try {
      const tipos = await tipoHardwareModel.getAll();
      res.json(tipos);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los tipos de hardware" });
    }
  }

  static async getById(req, res) {
    try {
      const { id_tipohard } = req.params;
      const tipo = await tipoHardwareModel.getById(id_tipohard);
      if (tipo.length > 0) return res.json(tipo);
      res.status(404).json({ message: "Tipo de hardware no encontrado" });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el tipo de hardware" });
    }
  }

  static async crear(req, res) {
    try {
      const tipo = req.body;
      const result = await tipoHardwareModel.crear(tipo);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el tipo de hardware" });
    }
  }

  static async modificar(req, res) {
    try {
      const { id_tipohard } = req.params;
      const tipo = req.body;
      const result = await tipoHardwareModel.modificar(id_tipohard, tipo);
      if (result.affectedRows > 0) return res.json(result);
      res.status(404).json({ message: "Tipo de hardware no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al modificar el tipo de hardware" });
    }
  }


  static async eliminar(req, res) {
    try {
      const { id_tipohard } = req.params;
      const result = await tipoHardwareModel.eliminar(id_tipohard);
      if (result) return res.status(204).end();
      res.status(404).json({ message: "Tipo de hardware no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el tipo de hardware" });
    }
  }

  static async verificarDependencias(req, res) {
    try {
      const { id_tipohard } = req.params;
      const dependencias = await tipoHardwareModel.obtenerDependencias(
        id_tipohard
      );
      res.json(dependencias);
    } catch (error) {
      res.status(500).json({ message: "Error al verificar dependencias" });
    }
  }

  static async eliminarConConfirmacion(req, res) {
    try {
      const { id_tipohard } = req.params;
      const result = await tipoHardwareModel.eliminarConDependencias(
        id_tipohard
      );
      if (result) {
        return res.status(204).end();
      }
      res.status(404).json({ message: "Tipo de hardware no encontrado" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al eliminar el tipo de hardware" });
    }
  }

  static async buscarPorCampo(req, res) {
    try {
      const { campo, valor } = req.params;
      const tipos = await tipoHardwareModel.buscarPorCampo(campo, valor);
      if (tipos.length > 0) return res.json(tipos);
      res.status(404).json({ message: "Tipo de hardware no encontrado" });
    } catch (error) {
      res.status(500).json({ message: "Error al buscar el tipo de hardware" });
    }
  }
}
