import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class ventaModel {
  static async crear({
    numeroFactura,
    pedidoId,
    fechaVenta,
    montoTotal,
    formaPago,
    cuotas,
    tipoPeriodo,
  }) {
    const query = `
      INSERT INTO ventas (numero_factura, pedido_id, fecha_venta, monto_total, forma_pago, cuotas, tipo_periodo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(query, [
      numeroFactura,
      pedidoId,
      fechaVenta,
      montoTotal,
      formaPago,
      cuotas,
      tipoPeriodo,
    ]);
  }

  static async getByNumeroFactura(numeroFactura) {
    const [rows] = await connection.query(
      "SELECT * FROM ventas WHERE numero_factura = ?",
      [numeroFactura]
    );
    return rows[0];
  }
}
