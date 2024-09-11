import { socioModel } from '../models/mysql/socios.js';

export class socioController {
    static async getAll(req, res) {
        try {
            const socios = await socioModel.getAll();
            res.json(socios);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los socios' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const socio = await socioModel.getById(id);
            if (socio) return res.json(socio);
            res.status(404).json({ message: 'Socio no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el socio' });
        }
    }

    static async crear(req, res) {
        try {
            const socio = req.body;
            const result = await socioModel.crear(socio);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el socio' });
        }
    }

    static async modificar(req, res) {
        try {
            const { id } = req.params;
            const socio = req.body;
            const result = await socioModel.modificar(id, socio);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: 'Socio no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al modificar el socio' });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const result = await socioModel.eliminar(id);
            if (result) return res.status(204).end();
            res.status(404).json({ message: 'Socio no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el socio' });
        }
    }
}
