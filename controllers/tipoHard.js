import { tipoHardModel } from '../models/mysql/tipoHard.js';

export class tipoHardController {
    static async getAll(req, res) {
        try {
            const tiposHard = await tipoHardModel.getAll();
            res.json(tiposHard);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los tipos de hardware' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const tipoHard = await tipoHardModel.getById(id);
            if (tipoHard) return res.json(tipoHard);
            res.status(404).json({ message: 'Tipo de hardware no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el tipo de hardware' });
        }
    }

    static async crear(req, res) {
        try {
            const tipoHard = req.body;
            const result = await tipoHardModel.crear(tipoHard);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el tipo de hardware' });
        }
    }

    static async modificar(req, res) {
        try {
            const { id } = req.params;
            const tipoHard = req.body;
            const result = await tipoHardModel.modificar(id, tipoHard);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: 'Tipo de hardware no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al modificar el tipo de hardware' });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const result = await tipoHardModel.eliminar(id);
            if (result) return res.status(204).end();
            res.status(404).json({ message: 'Tipo de hardware no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el tipo de hardware' });
        }
    }
}
