import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'infotec'
};

const connection = await mysql.createConnection(config);

export class tipoHardModel {
    static async getAll() {
        const [rows] = await connection.query('SELECT * FROM tipoHard');
        return rows;
    }

    static async getById(id) {
        const [rows] = await connection.query('SELECT * FROM tipoHard WHERE idTipohard = ?', [id]);
        return rows[0];
    }

    static async crear(tipoHard) {
        const { idTipohard, descripcion } = tipoHard;
        const [result] = await connection.query(
            'INSERT INTO tipoHard (idTipohard, descripcion) VALUES (?, ?)',
            [idTipohard, descripcion]
        );
        return result;
    }

    static async modificar(id, tipoHard) {
        const { descripcion } = tipoHard;
        const [result] = await connection.query(
            'UPDATE tipoHard SET descripcion = ? WHERE idTipohard = ?',
            [descripcion, id]
        );
        return result;
    }

    static async eliminar(id) {
        const [result] = await connection.query('DELETE FROM tipoHard WHERE idTipohard = ?', [id]);
        return result.affectedRows > 0;
    }
}
