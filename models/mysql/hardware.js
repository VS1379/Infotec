import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class hardwareModel {
  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM hardware");
    return rows;
  }

  static async getById(id_hard) {
    const [rows] = await connection.query(
      "SELECT * FROM hardware WHERE id_hard = ?",
      [id_hard]
    );
    return rows;
  }

  static async crear(hardware) {
    const {
      id_hard,
      id_tipohard,
      id_marca,
      caracteristicas,
      precio_unitario,
      unidades_disponibles,
    } = hardware;
    const [result] = await connection.query(
      "INSERT INTO hardware (id_hard, id_tipohard, id_marca, caracteristicas, precio_unitario, unidades_disponibles) VALUES (?, ?, ?, ?, ?, ?)",
      [
        id_hard,
        id_tipohard,
        id_marca,
        caracteristicas,
        precio_unitario,
        unidades_disponibles,
      ]
    );
    return result;
  }

  static async modificar(id_hard, hardware) {
    const {
      id_tipohard,
      id_marca,
      caracteristicas,
      precio_unitario,
      unidades_disponibles,
    } = hardware;
    const [result] = await connection.query(
      "UPDATE hardware SET id_tipohard = ?, id_marca = ?, caracteristicas = ?, precio_unitario = ?, unidades_disponibles = ? WHERE id_hard = ?",
      [
        id_tipohard,
        id_marca,
        caracteristicas,
        precio_unitario,
        unidades_disponibles,
        id_hard,
      ]
    );
    return result;
  }

  static async eliminar(id_hard) {
    const [result] = await connection.query(
      "DELETE FROM hardware WHERE id_hard = ?",
      [id_hard]
    );
    return result.affectedRows > 0;
  }

  static async buscarPorCampo(campo, valor) {
    const [rows] = await connection.query(
      `SELECT * FROM hardware WHERE ${campo} LIKE ?`,
      `%${valor}%`
    );
    return rows;
  }
}
