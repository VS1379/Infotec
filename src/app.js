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
import { detalleFacturaRouter } from '../routes/detalleFactura.js'
//import validate from '../schemas/clientes/clientes.js'
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
app.use("/detallefactura", detalleFacturaRouter);

const PORT = process.env.PORT ?? 3001;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
