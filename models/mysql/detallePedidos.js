// models/mysql/detallePedidos.js
import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class detallePedidosModel {
  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM detalle_pedidos");
    return rows;
  }

  static async getById(id_detalle) {
    const [rows] = await connection.query(
      "SELECT * FROM detalle_pedidos WHERE id_detalle = ?",
      [id_detalle]
    );
    return rows;
  }

  static async crear(detalle) {
    const { IDPedido, IDHard, CANTIDAD } = detalle;
    const [result] = await connection.query(
      "INSERT INTO detalle_pedidos (IDPedido, IDHard, CANTIDAD) VALUES (?, ?, ?)",
      [IDPedido, IDHard, CANTIDAD]
    );
    return result;
  }

  static async modificar(id_detalle, detalle) {
    const { IDPedido, IDHard, CANTIDAD } = detalle;
    const [result] = await connection.query(
      "UPDATE detalle_pedidos SET IDPedido = ?, IDHard = ?, CANTIDAD = ? WHERE id_detalle = ?",
      [IDPedido, IDHard, CANTIDAD, id_detalle]
    );
    return result;
  }

  static async eliminar(id_detalle) {
    const [result] = await connection.query(
      "DELETE FROM detalle_pedidos WHERE id_detalle = ?",
      [id_detalle]
    );
    return result.affectedRows > 0;
  }

  static async buscarPorCampo(campo, valor) {
    const [rows] = await connection.query(
      `SELECT * FROM detalle_pedidos WHERE ${campo} LIKE ?`,
      `%${valor}%`
    );
    return rows;
  }
}
