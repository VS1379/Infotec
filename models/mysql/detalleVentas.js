export class detalleVentaModel {
    static async modificarItem(numeroFactura, idItem, cantidad) {
      const query = 'UPDATE detalle_ventas SET cantidad = ? WHERE numero_factura = ? AND id_item = ?';
      await connection.query(query, [cantidad, numeroFactura, idItem]);
    }
  
    static async eliminarItem(numeroFactura, idItem) {
      const query = 'DELETE FROM detalle_ventas WHERE numero_factura = ? AND id_item = ?';
      await connection.query(query, [numeroFactura, idItem]);
    }
  }
  