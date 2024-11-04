import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class detalleFacturaModel {
  static async getAll() {
    const [result] = await connection.query(
      "SELECT * FROM detalle_facturas_venta"
    );
    return result;
  }

  static async getById(id) {
    const [result] = await connection.query(
      "SELECT * FROM detalle_facturas_venta WHERE NroFacv = ?",
      [id]
    );
    return result[0];
  }

  static async crear(detalle) {
    const [result] = await connection.query(
      "INSERT INTO detalle_facturas_venta (NroFacv, IDHard, PrecioUnitario, Cantidad, PrecioTotal, IVA, PrecioIVA) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        detalle.NroFacv,
        detalle.IDHard,
        detalle.PrecioUnitario,
        detalle.Cantidad,
        detalle.PrecioTotal,
        detalle.IVA,
        detalle.PrecioIVA,
      ]
    );
    return result.insertId;
  }

  static async eliminar(id) {
    const [result] = await connection.query(
      "DELETE FROM detalle_facturas_venta WHERE NroFacv = ?",
      [id]
    );
    return result.affectedRows > 0;
  }
}
