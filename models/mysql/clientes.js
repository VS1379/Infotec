import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'infotec'
};

const connection = await mysql.createConnection(config);

export class clienteModel {
    static async getAll() {
        const [rows] = await connection.query('SELECT * FROM `clientes` ORDER BY `clientes`.`NOMBRE` ASC');
        return rows;
    }

    static async getById(dni) {
        const [rows] = await connection.query(`SELECT * FROM clientes WHERE dni =?`, [dni]);
        return rows[0];
    }

    static async getByField(field, data) {
        const query = `SELECT * FROM clientes WHERE ?? LIKE ?`;
        const [rows] = await connection.query(query, [field, `%${data}%`]);
        return rows;
    }

    static async crear(cliente) {
        const { dni, cuit, nombre, direccion, telefono, correo } = cliente;
        const [result] = await connection.query(
            'INSERT INTO clientes (dni, cuit, nombre, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?, ?)',
            [dni, cuit, nombre, direccion, telefono, correo]
        );
        return result;
    }

    static async modificar(dni, cliente) {
        const { cuit, nombre, direccion, telefono, correo } = cliente;
        const [result] = await connection.query(
            'UPDATE clientes SET cuit = ?, nombre = ?, direccion = ?, telefono = ?, correo = ? WHERE dni = ?',
            [cuit, nombre, direccion, telefono, correo, dni]
        );
        return result;
    }

    static async eliminar(dni) {
        const [result] = await connection.query('DELETE FROM clientes WHERE dni = ?', [dni]);
        return result.affectedRows > 0;
    }
}
