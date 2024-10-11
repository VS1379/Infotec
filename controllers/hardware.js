import { hardwareModel } from '../models/mysql/hardware.js';

export class hardwareController {
    static async getAll(req, res) {
        try {
            const hardware = await hardwareModel.getAll();
            res.json(hardware);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el hardware' });
        }
    }

    static async getById(req, res) {
        try {
            const { id_hard } = req.params;
            const hardware = await hardwareModel.getById(id_hard);
            if (hardware.length > 0) return res.json(hardware);
            res.status(404).json({ message: 'Hardware no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el hardware' });
        }
    }

    static async crear(req, res) {
        try {
            const hardware = req.body;
            const result = await hardwareModel.crear(hardware);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el hardware' });
        }
    }

    static async modificar(req, res) {
        try {
            const { id_hard } = req.params;
            const hardware = req.body;
            const result = await hardwareModel.modificar(id_hard, hardware);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: 'Hardware no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al modificar el hardware' });
        }
    }

    static async eliminar(req, res) {
        try {
            const { id_hard } = req.params;
            const result = await hardwareModel.eliminar(id_hard);
            if (result) return res.status(204).end();
            res.status(404).json({ message: 'Hardware no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el hardware' });
        }
    }

    static async buscarPorCampo(req, res) {
        try {
            const { campo, valor } = req.params;
            const hardware = await hardwareModel.buscarPorCampo(campo, valor);
            if (hardware.length > 0) return res.json(hardware);
            res.status(404).json({ message: 'Hardware no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al buscar el hardware' });
        }
    }
}
