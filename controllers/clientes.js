import { clienteModel } from "../models/mysql/clientes.js";

export class clienteController {
  static async getAll(req, res) {
    try {
      const clientes = await clienteModel.getAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los clientes" });
    }
  }

  static async getById(req, res) {
    try {
      const { dni } = req.params;
      const cliente = await clienteModel.getById(dni);
      
      if (cliente) return res.json(cliente);
      res.status(404).json({ message: "Cliente no encontrado" });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el cliente" });
    }
  }

  static async getByField(req, res) {
    try {
      const { field, data } = req.query;
      const validFields = ['DNI', 'CUIT', 'NOMBRE', 'DIRECCION', 'TELEFONO', 'CORREO'];
      if (!validFields.includes(field)) {
        return res.status(400).json({ message: 'Campo inválido para la búsqueda' });
      }

      const consulta = await clienteModel.getByField(field, data);

      if (consulta.length > 0) {
        return res.json(consulta);
      } else {
        res.status(404).json({ message: "No se encontró ningún cliente coincidente" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el cliente" });
    }
  }

  static async crear(req, res) {
    try {
      const { dni, cuit, nombre, direccion, telefono, correo } = req.body;
      if (!dni || !cuit || !nombre || !direccion || !telefono || !correo) {
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios" });
      }

      const nuevoCliente = await clienteModel.crear({
        dni,
        cuit,
        nombre,
        direccion,
        telefono,
        correo,
      });
      res.status(201).json(nuevoCliente);
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      res.status(500).json({ message: "Error al crear el cliente" });
    }
  }

  static async modificar(req, res) {
    try {
      const { dni } = req.params;
      const cliente = req.body;
      const result = await clienteModel.modificar(dni, cliente);
      if (result.affectedRows > 0) return res.json(result);
      res.status(404).json({ message: "Cliente no encontrado" });
    } catch (error) {
      res.status(500).json({ message: "Error al modificar el cliente" });
    }
  }

  static async eliminar(req, res) {
    try {
      const { dni } = req.params;
      const result = await clienteModel.eliminar(dni);
      if (result) return res.status(204).end();
      res.status(404).json({ message: "Cliente no encontrado" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el cliente" });
    }
  }
}
