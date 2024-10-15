import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class pedidoModel {
  static async getAll() {
    const [result] = await connection.query("SELECT * FROM pedidos");
    return result;
  }

  static async getById(id) {
    const [result] = await connection.query(
      "SELECT * FROM pedidos WHERE id = ?",
      [id]
    );
    return result[0];
  }

  static async crear(pedido) {
    const { cliente, fechaPedido, tipoPedido } = pedido;
    const [result] = await connection.query(
      "INSERT INTO pedidos (cliente, fechaPedido, tipoPedido) VALUES (?, ?, ?)",
      [cliente, fechaPedido, tipoPedido]
    );
    return result.insertId;
  }

  static async agregarDetalle(pedidoId, detalle) {
    const { tipoHardware, marcaHardware, cantidad } = detalle;
    const [result] = await connection.query(
      "INSERT INTO detalles_pedido (pedido_id, tipoHardware, marcaHardware, cantidad) VALUES (?, ?, ?, ?)",
      [pedidoId, tipoHardware, marcaHardware, cantidad]
    );
    return result;
  }

  static async eliminar(id) {
    await connection.query("DELETE FROM detalles_pedido WHERE pedido_id = ?", [
      id,
    ]);
    const [result] = await connection.query(
      "DELETE FROM pedidos WHERE id = ?",
      [id]
    );
    return result;
  }
}
