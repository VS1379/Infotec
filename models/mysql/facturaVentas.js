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

  static async crear(
    IDCliente,
    IDPedido,
    Fecha,
    MontoTotal,
    FormaDePago,
    CantidadDeCuotas,
    PeriodoDeCuotas
  ) {
    const [result] = await connection.query(
      "INSERT INTO facturas_venta (IDCliente, IDPedido,	Fecha, MontoTotal,	FormaDePago,	CantidadDeCuotas,	PeriodoDeCuotas) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        IDCliente,
        IDPedido,
        Fecha,
        MontoTotal,
        FormaDePago,
        CantidadDeCuotas,
        PeriodoDeCuotas,
      ]
    );
    return result;
  }

  static async getByNumeroFactura(numeroFactura) {
    const [rows] = await connection.query(
      "SELECT * FROM facturas_venta WHERE NroFacv = ?",
      [numeroFactura]
    );
    return rows[0];
  }

  static async modificar(numeroFactura, datos) {
    const {
      IdCliente,
      IdPedido,
      fechaVenta,
      montoTotal,
      formaPago,
      cantCuotas,
      periodoCuotas,
    } = datos;
    const query = `
      UPDATE facturas_venta
      SET IDCliente =?, IDPedido=?,	Fecha=?, MontoTotal=?,	FormaDePago=?,	CantidadDeCuotas=?,	PeriodoDeCuotas=?
      WHERE NroFacv = ?
    `;
    const [result] = await connection.query(query, [
      IdCliente,
      IdPedido,
      fechaVenta,
      montoTotal,
      formaPago,
      cantCuotas,
      periodoCuotas,
      numeroFactura,
    ]);
    return result;
  }

  // Eliminar una factura de venta
  static async eliminarItem(numeroFactura) {
    const query = `
      DELETE FROM facturas_venta
      WHERE NroFacv = ?
    `;
    await connection.query(query, [numeroFactura]);
  }
}