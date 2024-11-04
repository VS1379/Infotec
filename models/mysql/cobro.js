import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class cobroModel {
  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM cobros");
    return rows;
  }
  static async crear(cobro) {
    const [result] = await connection.query(
      "INSERT INTO cobros (NroFacv, FechaCobro, Monto, Tipo, NroCheque, IdBanco) VALUES (?, ?, ?, ?, ?, ?)",
      [
        cobro.numeroFactura,
        cobro.fecha,
        cobro.monto,
        cobro.formaPago,
        cobro.numeroCheque,
        cobro.banco,
      ]
    );
    return result.insertId;
  }
}
