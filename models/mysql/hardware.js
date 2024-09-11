import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'infotec'
};

const connection = await mysql.createConnection(config);

export class hardwareModel {
    static async getAll() {
        const [rows] = await connection.query('SELECT * FROM hardware');
        return rows;
    }

    static async getById(id) {
        const [rows] = await connection.query('SELECT * FROM hardware WHERE idHard = ?', [id]);
        return rows[0];
    }

    static async crear(hardware) {
        const { idHard, idTipohard, idMarca, características, precioUnitario, unidadesDisponibles } = hardware;
        const [result] = await connection.query(
            'INSERT INTO hardware (idHard, idTipohard, idMarca, características, precioUnitario, unidadesDisponibles) VALUES (?, ?, ?, ?, ?, ?)',
            [idHard, idTipohard, idMarca, características, precioUnitario, unidadesDisponibles]
        );
        return result;
    }

    static async modificar(id, hardware) {
        const { idTipohard, idMarca, características, precioUnitario, unidadesDisponibles } = hardware;
        const [result] = await connection.query(
            'UPDATE hardware SET idTipohard = ?, idMarca = ?, características = ?, precioUnitario = ?, unidadesDisponibles = ? WHERE idHard = ?',
            [idTipohard, idMarca, características, precioUnitario, unidadesDisponibles, id]
        );
        return result;
    }

    static async eliminar(id) {
        const [result] = await connection.query('DELETE FROM hardware WHERE idHard = ?', [id]);
        return result.affectedRows > 0;
    }
}
