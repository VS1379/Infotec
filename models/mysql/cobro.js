export class cobroModel {
  static async registrar({
    numeroFactura,
    fecha,
    monto,
    formaPago,
    numeroCheque,
    banco,
  }) {
    const query = `
        INSERT INTO cobros (numero_factura, fecha, monto, forma_pago, numero_cheque, banco)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
    await connection.query(query, [
      numeroFactura,
      fecha,
      monto,
      formaPago,
      numeroCheque,
      banco,
    ]);
  }
}
