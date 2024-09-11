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

    static async getById(id) {
        const [rows] = await connection.query('SELECT * FROM proveedores WHERE idProveedor = ?', [id]);
        return rows[0];
    }

    static async crear(proveedor) {
        const { idProveedor, cuit, nombre, direccion, telefono, correo } = proveedor;
        const [result] = await connection.query(
            'INSERT INTO proveedores (idProveedor, cuit, nombre, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?, ?)',
            [idProveedor, cuit, nombre, direccion, telefono, correo]
        );
        return result;
    }

    static async modificar(id, proveedor) {
        const { cuit, nombre, direccion, telefono, correo } = proveedor;
        const [result] = await connection.query(
            'UPDATE proveedores SET cuit = ?, nombre = ?, direccion = ?, telefono = ?, correo = ? WHERE idProveedor = ?',
            [cuit, nombre, direccion, telefono, correo, id]
        );
        return result;
    }

    static async eliminar(id) {
        const [result] = await connection.query('DELETE FROM proveedores WHERE idProveedor = ?', [id]);
        return result.affectedRows > 0;
    }
}
