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

    static async getById(id) {
        const [rows] = await connection.query('SELECT * FROM socios WHERE idSocio = ?', [id]);
        return rows[0];
    }

    static async crear(socio) {
        const { idSocio, dni, apellidoNombre, direccion, telefono, correo, socioGerente } = socio;
        const [result] = await connection.query(
            'INSERT INTO socios (idSocio, dni, apellidoNombre, direccion, telefono, correo, socioGerente) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [idSocio, dni, apellidoNombre, direccion, telefono, correo, socioGerente ? 1 : 0]
        );
        return result;
    }

    static async modificar(id, socio) {
        const { dni, apellidoNombre, direccion, telefono, correo, socioGerente } = socio;
        const [result] = await connection.query(
            'UPDATE socios SET dni = ?, apellidoNombre = ?, direccion = ?, telefono = ?, correo = ?, socioGerente = ? WHERE idSocio = ?',
            [dni, apellidoNombre, direccion, telefono, correo, socioGerente ? 1 : 0, id]
        );
        return result;
    }

    static async eliminar(id) {
        const [result] = await connection.query('DELETE FROM socios WHERE idSocio = ?', [id]);
        return result.affectedRows > 0;
    }
}

