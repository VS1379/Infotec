import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'infotec'
};

const connection = await mysql.createConnection(config);

export class marcaModel {
    static async getAll() {
        const [rows] = await connection.query('SELECT * FROM marca');
        return rows;
    }

    static async getById(id) {
        const [rows] = await connection.query('SELECT * FROM marca WHERE idMarca = ?', [id]);
        return rows[0];
    }

    static async crear(marca) {
        const { idMarca, descripcion } = marca;
        const [result] = await connection.query(
            'INSERT INTO marca (idMarca, descripcion) VALUES (?, ?)',
            [idMarca, descripcion]
        );
        return result;
    }

    static async modificar(id, marca) {
        const { descripcion } = marca;
        const [result] = await connection.query(
            'UPDATE marca SET descripcion = ? WHERE idMarca = ?',
            [descripcion, id]
        );
        return result;
    }

    static async eliminar(id) {
        const [result] = await connection.query('DELETE FROM marca WHERE idMarca = ?', [id]);
        return result.affectedRows > 0;
    }
}
