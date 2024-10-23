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

  static async getById(id_pedido) {
    const [rows] = await connection.query(
      "SELECT * FROM detalle_pedidos WHERE IDPedido = ?",
      [id_pedido]
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

  static async modificar(id_pedido, detalle) {
    const { IDHard, CANTIDAD } = detalle;
    const [result] = await connection.query(
      "UPDATE detalle_pedidos SET IDHard = ?, CANTIDAD = ? WHERE IDPedido = ?",
      [IDHard, CANTIDAD, id_pedido]
    );
    return result;
  }

  static async modificarCantidad(id_pedido, detalle) {
    const IDPedido = id_pedido;
    const { IDHard, CANTIDAD } = detalle;

    const [result] = await connection.query(
      "UPDATE detalle_pedidos SET CANTIDAD = ? WHERE IDPedido = ? AND IDHard = ?",
      [CANTIDAD, IDPedido, IDHard]
    );
    return result;
  }

  static async eliminar(id_pedido) {
    const [result] = await connection.query(
      "DELETE FROM detalle_pedidos WHERE IDPedido = ?",
      [id_pedido]
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
