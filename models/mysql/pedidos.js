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

  // static async modificar(id_marca, marca) {
  // const { updateNombreMarca: descripcion } = marca;

  static async crear(datos) {
    const condicion = 1;
    console.log(datos);
    const { cliente: IDCliente } = datos;
    const { fechaPedido: FechaHora } = datos;
    const { tipoPedido: TipoPedido } = datos;

    try {
      const [result] = await connection.query(
        "INSERT INTO pedidos (IDCliente, FechaHora, Condicion, TipoPedido) VALUES (?, ?, ?, ?)",
        [IDCliente, FechaHora, condicion, TipoPedido]
      );
      const [lastIdResult] = await connection.query(
        "SELECT LAST_INSERT_ID() AS IDPedido"
      );
      const IDPedido = lastIdResult[0].IDPedido;

      return { result, IDPedido };
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      throw error;
    }
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
