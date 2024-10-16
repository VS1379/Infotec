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
  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM facturas_venta");
    return rows;
  }
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
      INSERT INTO facturas_venta (numero_factura, pedido_id, fecha_venta, monto_total, forma_pago, cuotas, tipo_periodo)
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
      "SELECT * FROM facturas_venta WHERE numero_factura = ?",
      [numeroFactura]
    );
    return rows[0];
  }

  static async modificar(numeroFactura, datos) {
    const { pedidoId, fechaVenta, montoTotal, formaPago, cuotas, tipoPeriodo } =
      datos;
    const query = `
      UPDATE facturas_venta
      SET pedido_id = ?, fecha_venta = ?, monto_total = ?, forma_pago = ?, cuotas = ?, tipo_periodo = ?
      WHERE numero_factura = ?
    `;
    const [result] = await connection.query(query, [
      pedidoId,
      fechaVenta,
      montoTotal,
      formaPago,
      cuotas,
      tipoPeriodo,
      numeroFactura,
    ]);
    return result;
  }

  // Eliminar una factura de venta
  static async eliminarItem(numeroFactura) {
    const query = `
      DELETE FROM facturas_venta
      WHERE numero_factura = ?
    `;
    await connection.query(query, [numeroFactura]);
  }
}
