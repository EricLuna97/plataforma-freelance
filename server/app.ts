import express from 'express';
import cors from 'cors';

// 1. Importamos todas las rutas
import clientesRoutes from './routes/clientes.routes';
import serviciosRoutes from './routes/servicios.routes';
import solicitudesRoutes from './routes/solicitudes.routes';
import caracteristicasRoutes from './routes/caracteristicas.routes';

const app = express();

// 2. Middlewares globales
app.use(cors());
app.use(express.json()); 

// 3. Conectamos las rutas
app.use('/api/clientes', clientesRoutes);
app.use('/api/servicios', serviciosRoutes);
app.use('/api/solicitudes', solicitudesRoutes);
app.use('/api/caracteristicas', caracteristicasRoutes);

export { app };