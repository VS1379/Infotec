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
}
