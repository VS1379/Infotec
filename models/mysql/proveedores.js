import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'infotec'
};

const connection = await mysql.createConnection(config);

export class proveedorModel {
    static async getAll() {
        const [rows] = await connection.query('SELECT * FROM proveedores');
        return rows;
    }

    static async getById(cuit) {
        const [rows] = await connection.query('SELECT * FROM proveedores WHERE CUIT = ?', [cuit]);
        return rows[0];
    }

    static async getByField(field, data) {
        const query = `SELECT * FROM proveedores WHERE ?? LIKE ?`;
        const [rows] = await connection.query(query, [field, `%${data}%`]);
        return rows;
    }

    static async crear(proveedor) {
        const { cuit, nombre, direccion, telefono, correo } = proveedor;
        const [result] = await connection.query(
            'INSERT INTO proveedores (cuit, nombre, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?)',
            [cuit, nombre, direccion, telefono, correo]
        );
        return result;
    }

    static async modificar(cuit, proveedor) {
        const { nombre, direccion, telefono, correo } = proveedor;
        const [result] = await connection.query(
            'UPDATE proveedores SET nombre = ?, direccion = ?, telefono = ?, correo = ? WHERE CUIT = ?',
            [nombre, direccion, telefono, correo, cuit]
        );
        return result;
    }

    static async eliminar(cuit) {
        const [result] = await connection.query('DELETE FROM proveedores WHERE CUIT = ?', [cuit]);
        return result.affectedRows > 0;
    }
}

