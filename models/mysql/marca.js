import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class marcaModel {
  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM marca");
    return rows;
  }

  static async getById(id_marca) {
    const [rows] = await connection.query(
      "SELECT * FROM marca WHERE id_marca = ?",
      [id_marca]
    );
    return rows;
  }

  static async crear(marca) {
    const { descripcion } = marca;
    const [result] = await connection.query(
      "INSERT INTO marca (descripcion) VALUES (?)",
      [descripcion]
    );
    return result;
  }

  static async modificar(id_marca, marca) {
    const { updateNombreMarca: descripcion } = marca;
    const [result] = await connection.query(
      "UPDATE marca SET DESCRIPCION = ? WHERE id_marca = ?",
      [descripcion, id_marca]
    );
    return result;
  }

  static async eliminar(id_marca) {
    const [result] = await connection.query(
      "DELETE FROM marca WHERE id_marca = ?",
      [id_marca]
    );
    return result.affectedRows > 0;
  }

  static async eliminarConDependencias(id_marca) {
    await connection.query("DELETE FROM hardware WHERE ID_Marca = ?", [
      id_marca,
    ]);
    const [result] = await connection.query(
      "DELETE FROM marca WHERE ID_Marca = ?",
      [id_marca]
    );
    return result.affectedRows > 0;
  }

  static async obtenerDependencias(id_marca) {
    const [dependencias] = await connection.query(
      "SELECT * FROM hardware WHERE ID_Marca = ?",
      [id_marca]
    );

    return dependencias;
  }

  static async buscarPorCampo(campo, valor) {
    const [rows] = await connection.query(
      `SELECT * FROM marca WHERE ${campo} LIKE ?`,
      `%${valor}%`
    );
    return rows;
  }
}
