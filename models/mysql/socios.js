import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'infotec'
};

const connection = await mysql.createConnection(config);

export class socioModel {
    static async getAll() {
        const [rows] = await connection.query('SELECT * FROM socios');
        return rows;
    }

    static async getById(id_socio) {
        const [rows] = await connection.query('SELECT * FROM socios WHERE id_socio = ?', [id_socio]);
        return rows;
    }

    static async crear(socio) {
        const { id_socio, dni, apellido_nombre, direccion, telefono, correo, socio_gerente } = socio;
        const [result] = await connection.query(
            'INSERT INTO socios (id_socio, dni, apellido_nombre, direccion, telefono, correo, socio_gerente) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id_socio, dni, apellido_nombre, direccion, telefono, correo, socio_gerente]
        );
        return result;
    }

    static async modificar(id_socio, socio) {
        const { dni, apellido_nombre, direccion, telefono, correo, socio_gerente } = socio;
        const [result] = await connection.query(
            'UPDATE socios SET dni = ?, apellido_nombre = ?, direccion = ?, telefono = ?, correo = ?, socio_gerente = ? WHERE id_socio = ?',
            [dni, apellido_nombre, direccion, telefono, correo, socio_gerente, id_socio]
        );
        return result;
    }

    static async eliminar(id_socio) {
        const [result] = await connection.query('DELETE FROM socios WHERE id_socio = ?', [id_socio]);
        return result.affectedRows > 0;
    }
}
