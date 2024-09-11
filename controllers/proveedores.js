import { proveedorModel } from '../models/mysql/proveedores.js';

export class proveedorController {
    static async getAll(req, res) {
        try {
            const proveedores = await proveedorModel.getAll();
            res.json(proveedores);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los proveedores' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const proveedor = await proveedorModel.getById(id);
            if (proveedor) return res.json(proveedor);
            res.status(404).json({ message: 'Proveedor no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el proveedor' });
        }
    }

    static async crear(req, res) {
        try {
            const proveedor = req.body;
            const result = await proveedorModel.crear(proveedor);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el proveedor' });
        }
    }

    static async modificar(req, res) {
        try {
            const { id } = req.params;
            const proveedor = req.body;
            const result = await proveedorModel.modificar(id, proveedor);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: 'Proveedor no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al modificar el proveedor' });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const result = await proveedorModel.eliminar(id);
            if (result) return res.status(204).end();
            res.status(404).json({ message: 'Proveedor no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el proveedor' });
        }
    }
}
