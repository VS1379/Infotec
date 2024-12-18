import { ventaModel } from "../models/mysql/facturaVentas.js";

export const ventaController = {
  async getAll(req, res) {
    try {
      const ventas = await ventaModel.getAll();
      res.json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      res.status(500).json({ error: "Error al obtener las ventas" });
    }
  },

  async getAllCobrar(req, res) {
    try {
      const ventas = await ventaModel.getAllCobrar();
      res.json(ventas);
    } catch (error) {
      console.error("Error al obtener las ventas:", error);
      res.status(500).json({ error: "Error al obtener las ventas" });
    }
  },

  async crear(req, res) {
    try {
      const {
        IDCliente,
        IDPedido,
        Fecha,
        MontoTotal,
        FormaDePago,
        CantidadDeCuotas,
        PeriodoDeCuotas,
      } = req.body;

      await ventaModel.crear(
        IDCliente,
        IDPedido,
        Fecha,
        MontoTotal,
        FormaDePago,
        CantidadDeCuotas,
        PeriodoDeCuotas
      );

      res.status(201).json({ message: "Venta creada exitosamente" });
    } catch (error) {
      console.error("Error al crear la venta:", error);
      res.status(500).json({ error: "Error al crear la venta" });
    }
  },

  async modificar(req, res) {
    const { numeroFactura } = req.params;
    const {
      IdCliente,
      IdPedido,
      fechaVenta,
      montoTotal,
      formaPago,
      cantCuotas,
      periodoCuotas,
    } = req.body;

    try {
      const result = await ventaModel.modificar(numeroFactura, {
        IdCliente,
        IdPedido,
        fechaVenta,
        montoTotal,
        formaPago,
        cantCuotas,
        periodoCuotas,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Factura no encontrada" });
      }

      res.json({ message: "Factura modificada exitosamente" });
    } catch (error) {
      console.error("Error al modificar la factura:", error);
      res.status(500).json({ error: "Error al modificar la factura" });
    }
  },

  async eliminarItem(req, res) {
    const { numeroFactura } = req.params;

    try {
      await ventaModel.eliminarItem(numeroFactura);
      res.json({ message: "Factura eliminada exitosamente" });
    } catch (error) {
      console.error("Error al eliminar la factura:", error);
      res.status(500).json({ error: "Error al eliminar la factura" });
    }
  },

  async getByNumeroFactura(req, res) {
    const { numeroFactura } = req.params;

    try {
      const venta = await ventaModel.getByNumeroFactura(numeroFactura);
      if (!venta) {
        return res.status(404).json({ error: "Venta no encontrada" });
      }
      res.json(venta);
    } catch (error) {
      console.error("Error al obtener la venta:", error);
      res.status(500).json({ error: "Error al obtener la venta" });
    }
  },
};
