import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class presupuestoModel {

  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM pedidos");
    return rows;
  }

  static async crear({ numeroPedido, formasDePago }) {
    const query = `
      INSERT INTO presupuestos (numero_pedido, formas_de_pago)
      VALUES (?, ?)
    `;
    await connection.query(query, [numeroPedido, formasDePago]);
  }

  static async getByNumeroPedido(numeroPedido) {
    const [rows] = await connection.query(
      "SELECT * FROM presupuestos WHERE numero_pedido = ?",
      [numeroPedido]
    );
    return rows[0];
  }
}
