import { clienteModel } from '../models/mysql/clientes.js';

export class clienteController {
    static async getAll(req, res) {
        try {
            const clientes = await clienteModel.getAll();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los clientes' });
        }
    }

    static async getById(req, res) {
        try {
            const { dni } = req.params;
            const cliente = await clienteModel.getById(dni);
            if (cliente) return res.json(cliente);
            res.status(404).json({ message: 'Cliente no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el cliente' });
        }
    }

    static async crear(req, res) {
        try {
            const cliente = req.body;
            const result = await clienteModel.crear(cliente);
            res.status(201).json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el cliente' });
        }
    }

    static async modificar(req, res) {
        try {
            const { dni } = req.params;
            const cliente = req.body;
            const result = await clienteModel.modificar(dni, cliente);
            if (result.affectedRows > 0) return res.json(result);
            res.status(404).json({ message: 'Cliente no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al modificar el cliente' });
        }
    }

    static async eliminar(req, res) {
        try {
            const { dni } = req.params;
            const result = await clienteModel.eliminar(dni);
            if (result) return res.status(204).end();
            res.status(404).json({ message: 'Cliente no encontrado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el cliente' });
        }
    }
}

