import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class tipoHardwareModel {
  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM tipo_hardware");
    return rows;
  }

  static async getById(id_tipohard) {
    const [rows] = await connection.query(
      "SELECT * FROM tipo_hardware WHERE id_tipohard = ?",
      [id_tipohard]
    );
    return rows;
  }

  static async crear(tipo) {
    const { descripcionTipoHardware: descripcion } = tipo;
    const [result] = await connection.query(
      "INSERT INTO tipo_hardware (descripcion) VALUES (?)",
      [descripcion]
    );
    return result;
  }

  static async modificar(id_tipohard, tipo) {
    const { updateDescripcionTipoHardware: descripcion } = tipo;
    const [result] = await connection.query(
      "UPDATE tipo_hardware SET descripcion = ? WHERE id_tipohard = ?",
      [descripcion, id_tipohard]
    );
    return result;
  }
  
  static async eliminar(id_tipohard) {
    const [result] = await connection.query(
      "DELETE FROM tipo_hardware WHERE id_tipohard = ?",
      [id_tipohard]
    );
    return result.affectedRows > 0;
  }

  static async eliminarConDependencias(id_tipohard) {
    await connection.query("DELETE FROM hardware WHERE ID_Tipohard = ?", [
      id_tipohard,
    ]);
    const [result] = await connection.query(
      "DELETE FROM tipo_hardware WHERE ID_Tipohard = ?",
      [id_tipohard]
    );
    return result.affectedRows > 0;
  }

  static async obtenerDependencias(id_tipohard) {
    const [dependencies] = await connection.query(
      "SELECT * FROM hardware WHERE ID_Tipohard = ?",
      [id_tipohard]
    );

    return dependencies;
  }

  static async buscarPorCampo(campo, valor) {
    const [rows] = await connection.query(
      `SELECT * FROM tipo_hardware WHERE ${campo} LIKE ?`,
      `%${valor}%`
    );
    return rows;
  }
}
