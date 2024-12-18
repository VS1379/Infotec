import express, { json } from "express";
import { clientesRouter } from "../routes/clientes.js";
import { sociosRouter } from "../routes/socios.js";
import { proveedoresRouter } from "../routes/proveedores.js";
import { hardwareRouter } from "../routes/hardware.js";
import { marcaRouter } from "../routes/marca.js";
import { tipoHardwareRouter } from "../routes/tipoHarware.js";
import { pedidosRouter } from "../routes/pedidos.js";
import { detallePedidosRouter } from "../routes/detallePedidos.js";
import { ventasRouter } from "../routes/facturaVentas.js";
import { detalleFacturaRouter } from '../routes/detalleFacturaVenta.js'
import { presupuestosRouter } from '../routes/presupuesto.js'
import { cobroRouter } from '../routes/cobro.js'
import { bancoRouter } from '../routes/bancos.js'
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/clientes", clientesRouter);
app.use("/socios", sociosRouter);
app.use("/proveedores", proveedoresRouter);
app.use("/hardware", hardwareRouter);
app.use("/marca", marcaRouter);
app.use("/tipohardware", tipoHardwareRouter);
app.use("/pedidos", pedidosRouter);
app.use("/detallePedidos", detallePedidosRouter);
app.use("/facturaventas", ventasRouter);
app.use("/detallefacturaventas", detalleFacturaRouter);
app.use("/presupuesto", presupuestosRouter);
app.use("/cobros", cobroRouter)
app.use("/bancos", bancoRouter)

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
