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

    static async getById(dni) {
        const [rows] = await connection.query('SELECT * FROM socios WHERE DNI = ?', [dni]);
        console.log(rows);
        
        return rows[0];
    }

    static async getByField(field, data) {
        const query = `SELECT * FROM socios WHERE ?? LIKE ?`;
        const [rows] = await connection.query(query, [field, `%${data}%`]);
        return rows;
    }

    static async crear(socio) {
        const {dni, apellido_nombre, direccion, telefono, correo, socio_gerente } = socio;
        const [result] = await connection.query(
            'INSERT INTO socios (dni, apellido_nombre, direccion, telefono, correo, socio_gerente) VALUES (?, ?, ?, ?, ?, ?)',
            [dni, apellido_nombre, direccion, telefono, correo, socio_gerente]
        );
        return result;
    }

    static async modificar(dni, socio) {
        const {apellido_nombre, direccion, telefono, correo, socio_gerente } = socio;
        const [result] = await connection.query(
            'UPDATE socios SET apellido_nombre = ?, direccion = ?, telefono = ?, correo = ?, socio_gerente = ? WHERE DNI = ?',
            [apellido_nombre, direccion, telefono, correo, socio_gerente, dni]
        );
        return result;
    }

    static async eliminar(dni) {
        const [result] = await connection.query('DELETE FROM socios WHERE DNI = ?', [dni]);
        return result.affectedRows > 0;
    }
}
