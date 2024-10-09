import { socioModel } from "../models/mysql/socios.js";

export class socioController {
    static async getAll(req, res) {
        try {
            const socios = await socioModel.getAll();
            res.json(socios);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los socios" });
        }
    }

    static async getById(req, res) {
        try {
            const { dni } = req.params;
            const socio = await socioModel.getById(dni);
            if (socio) return res.json(socio);
            res.status(404).json({ message: "Socio no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el socio" });
        }
    }

    static async getByField(req, res) {
        try {
          const { field, data } = req.query;
          const validFields = ['DNI', 'APELLIDO_NOMBRE', 'DIRECCION', 'TELEFONO', 'CORREO'];
          if (!validFields.includes(field)) {
            return res.status(400).json({ message: 'Campo inválido para la búsqueda' });
          }
    
          const consulta = await socioModel.getByField(field, data);
    
          if (consulta.length > 0) {
            return res.json(consulta);
          } else {
            res.status(404).json({ message: "No se encontró ningún socio coincidente" });
          }
        } catch (error) {
          res.status(500).json({ message: "Error al obtener el socio" });
        }
      }

    static async crear(req, res) {
        try {
            const {dni, apellido_nombre, direccion, telefono, correo, socio_gerente } = req.body;
            if (!dni || !apellido_nombre || !direccion || !telefono || !correo) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }
            const nuevoSocio = await socioModel.crear({
                dni,
                apellido_nombre,
                direccion,
                telefono,
                correo,
                socio_gerente,
            });
            res.status(201).json(nuevoSocio);
        } catch (error) {
            console.error("Error al crear el socio:", error);
            res.status(500).json({ message: "Error al crear el socio" });
        }
    }

    static async modificar(req, res) {
        try {
            const { dni } = req.params;
            const socio = req.body;
            const result = await socioModel.modificar(dni, socio);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: "Socio no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al modificar el socio" });
        }
    }

    static async eliminar(req, res) {
        try {
            const { dni } = req.params;
            const result = await socioModel.eliminar(dni);
            if (result) return res.status(204).end();
            res.status(404).json({ message: "Socio no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el socio" });
        }
    }
}
