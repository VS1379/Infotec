import { marcaModel } from '../models/mysql/marca.js';

export class marcaController {
    static async getAll(req, res) {
        try {
            const marcas = await marcaModel.getAll();
            res.json(marcas);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener las marcas' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const marca = await marcaModel.getById(id);
            if (marca) return res.json(marca);
            res.status(404).json({ message: 'Marca no encontrada' });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener la marca' });
        }
    }

    static async crear(req, res) {
        try {
            const marca = req.body;
            const result = await marcaModel.crear(marca);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la marca' });
        }
    }

    static async modificar(req, res) {
        try {
            const { id } = req.params;
            const marca = req.body;
            const result = await marcaModel.modificar(id, marca);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: 'Marca no encontrada' });
        } catch (error) {
            res.status(500).json({ message: 'Error al modificar la marca' });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const result = await marcaModel.eliminar(id);
            if (result) return res.status(204).end();
            res.status(404).json({ message: 'Marca no encontrada' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar la marca' });
        }
    }
}
