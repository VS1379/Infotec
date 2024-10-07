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

    static async getById(id_proveedor) {
        const [rows] = await connection.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [id_proveedor]);
        return rows;
    }

    static async crear(proveedor) {
        const { id_proveedor, cuit, nombre, direccion, telefono, correo } = proveedor;
        const [result] = await connection.query(
            'INSERT INTO proveedores (id_proveedor, cuit, nombre, direccion, telefono, correo) VALUES (?, ?, ?, ?, ?, ?)',
            [id_proveedor, cuit, nombre, direccion, telefono, correo]
        );
        return result;
    }

    static async modificar(id_proveedor, proveedor) {
        const { cuit, nombre, direccion, telefono, correo } = proveedor;
        const [result] = await connection.query(
            'UPDATE proveedores SET cuit = ?, nombre = ?, direccion = ?, telefono = ?, correo = ? WHERE id_proveedor = ?',
            [cuit, nombre, direccion, telefono, correo, id_proveedor]
        );
        return result;
    }

    static async eliminar(id_proveedor) {
        const [result] = await connection.query('DELETE FROM proveedores WHERE id_proveedor = ?', [id_proveedor]);
        return result.affectedRows > 0;
    }
}
