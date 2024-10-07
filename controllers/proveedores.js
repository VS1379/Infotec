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
            const { id_proveedor } = req.params;
            const proveedor = await proveedorModel.getById(id_proveedor);
            if (proveedor) return res.json(proveedor);
            res.status(404).json({ message: "Proveedor no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el proveedor" });
        }
    }

    static async crear(req, res) {
        try {
            const { id_proveedor, cuit, nombre, direccion, telefono, correo } = req.body;
            if (!id_proveedor || !cuit || !nombre || !direccion || !telefono || !correo) {
                return res.status(400).json({ message: "Todos los campos son obligatorios" });
            }
            const nuevoProveedor = await proveedorModel.crear({
                id_proveedor,
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
            const { id_proveedor } = req.params;
            const proveedor = req.body;
            const result = await proveedorModel.modificar(id_proveedor, proveedor);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: "Proveedor no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al modificar el proveedor" });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id_proveedor } = req.params;
            const result = await proveedorModel.eliminar(id_proveedor);
            if (result) return res.status(204).end();
            res.status(404).json({ message: "Proveedor no encontrado" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el proveedor" });
        }
    }
}
