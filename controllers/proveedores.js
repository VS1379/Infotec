import { proveedorModel } from "../models/mysql/proveedores.js";

export class proveedorController {
    static async getAll(req, res) {
        try {
            const proveedores = await proveedorModel.getAll();
            res.json(proveedores);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los proveedores" });
        }
    }

    static async getById(req, res) {
        try {
            const { cuit } = req.params;
            const proveedor = await proveedorModel.getById(cuit);
            if (proveedor) return res.json(proveedor);
            res.status(404).json({ message: "Proveedor no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el proveedor" });
        }
    }

    static async getByField(req, res) {
        try {
            const { field, data } = req.query;
            const validFields = ['CUIT', 'NOMBRE', 'DIRECCION', 'TELEFONO', 'CORREO'];
            if (!validFields.includes(field)) {
                return res.status(400).json({ message: 'Campo inválido para la búsqueda' });
            }

            const consulta = await proveedorModel.getByField(field, data);

            if (consulta.length > 0) {
                return res.json(consulta);
            } else {
                res.status(404).json({ message: "No se encontró ningún proveedor coincidente" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el proveedor" });
        }
    }

    static async crear(req, res) {
        try {
            const { cuit, nombre, direccion, telefono, correo } = req.body;
            if (!cuit || !nombre || !direccion || !telefono || !correo) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }
            const nuevoProveedor = await proveedorModel.crear({
                cuit,
                nombre,
                direccion,
                telefono,
                correo,
            });
            res.status(201).json(nuevoProveedor);
        } catch (error) {
            console.error("Error al crear el proveedor:", error);
            res.status(500).json({ message: "Error al crear el proveedor" });
        }
    }

    static async modificar(req, res) {
        try {
            const { cuit } = req.params;
            const proveedor = req.body;
            const result = await proveedorModel.modificar(cuit, proveedor);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: "Proveedor no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al modificar el proveedor" });
        }
    }

    static async eliminar(req, res) {
        try {
            const { cuit } = req.params;
            const result = await proveedorModel.eliminar(cuit);
            if (result) return res.status(204).end();
            res.status(404).json({ message: "Proveedor no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el proveedor" });
        }
    }
}
