import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "infotec",
};

const connection = await mysql.createConnection(config);

export class hardwareModel {
  static async getAll() {
    const [rows] = await connection.query("SELECT * FROM hardware");
    return rows;
  }

  static async getById(id_hard) {
    const [rows] = await connection.query(
      "SELECT * FROM hardware WHERE id_hard = ?",
      [id_hard]
    );
    return rows;
  }

  static async crear(hardware) {
    const {
      id_tipohard,
      id_marca,
      caracteristicas,
      precio_unitario,
      unidades_disponibles,
    } = hardware;

    const [result] = await connection.query(
      "INSERT INTO hardware (id_tipohard, id_marca, caracteristicas, precio_unitario, unidades_disponibles) VALUES (?, ?, ?, ?, ?)",
      [
        id_tipohard,
        id_marca,
        caracteristicas,
        precio_unitario,
        unidades_disponibles,
      ]
    );
    return result;
  }

  static async modificar(id_hard, hardware) {
    const { ID_Tipohard: id_tipohard } = hardware;
    const { ID_Marca: id_marca } = hardware;
    const { CARACTERISTICAS: caracteristicas } = hardware;
    const { PRECIO_UNITARIO: precio_unitario } = hardware;
    const { UNIDADES_DISPONIBLES: unidades_disponibles } = hardware;

    const [result] = await connection.query(
      "UPDATE hardware SET id_tipohard = ?, id_marca = ?, caracteristicas = ?, precio_unitario = ?, unidades_disponibles = ? WHERE id_hard = ?",
      [
        id_tipohard,
        id_marca,
        caracteristicas,
        precio_unitario,
        unidades_disponibles,
        id_hard,
      ]
    );
    return result;
  }

  static async verificarDependencias(id_hard) {
    // Consulta para verificar si el hardware está en uso en las tablas relacionadas
    const [ventas] = await connection.query(
        "SELECT COUNT(*) as count FROM detalle_facturas_venta WHERE IDHard = ?",
        [id_hard]
    );
    const [compras] = await connection.query(
        "SELECT COUNT(*) as count FROM detalle_facturas_compra WHERE IDHard = ?",
        [id_hard]
    );
    const [pedidos] = await connection.query(
        "SELECT COUNT(*) as count FROM detalle_pedidos WHERE IDHard = ?",
        [id_hard]
    );

    // Retorna true si existen dependencias, false en caso contrario
    return ventas[0].count > 0 || compras[0].count > 0 || pedidos[0].count > 0;
}


  static async eliminar(id_hard) {
    const [result] = await connection.query(
      "DELETE FROM hardware WHERE id_hard = ?",
      [id_hard]
    );
    return result.affectedRows > 0;
  }

  static async buscarPorCampo(campo, valor) {
    const [rows] = await connection.query(
      `SELECT * FROM hardware WHERE ${campo} LIKE ?`,
      `%${valor}%`
    );
    return rows;
  }
}
