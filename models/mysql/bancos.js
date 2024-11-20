import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class bancoModel {
  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM bancos");
    return rows;
  }

  static async crear(banco) {
    const { descripcionBanco: nombre } = banco;
    const [result] = await connection.query(
      "INSERT INTO bancos (Nombre) VALUES (?)",
      [nombre]
    );
    return result;
  }

  static async eliminar(IdBanco) {
    const [result] = await connection.query(
      "DELETE FROM bancos WHERE IdBanco = ?",
      [IdBanco]
    );
    return result.affectedRows > 0;
  }
}
