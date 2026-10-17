import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// 1. Importamos todas las rutas
import clientesRoutes from './routes/clientes.routes';
import serviciosRoutes from './routes/servicios.routes';
import solicitudesRoutes from './routes/solicitudes.routes';
import caracteristicasRoutes from './routes/caracteristicas.routes';

const app = express();

// 2. Cabeceras de seguridad HTTP con Helmet (oculta tecnología, previene clickjacking y sniffing)
app.use(helmet());

// 3. Orígenes permitidos para CORS (whitelist)
const origenesConfigurados = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

const origenesPermitidos = [
  'http://localhost:4321',
  'http://127.0.0.1:4321',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  ...origenesConfigurados
].filter((o): o is string => Boolean(o));

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (herramientas locales, tests, curl, o solicitudes del mismo servidor)
    if (!origin || origenesPermitidos.length === 0 || origenesPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acceso no permitido por política CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));

// 4. Límite estricto de tamaño del payload JSON (previene ataques DoS por cuerpos gigantes)
app.use(express.json({ limit: '10kb' }));

// 5. Rate Limiting general para la API (150 peticiones cada 15 minutos por IP)
const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'Demasiadas peticiones. Por favor inténtalo más tarde.' }
});
app.use(limitadorGeneral);

// 6. Rate Limiting específico y estricto para recepción de consultas (máximo 10 solicitudes cada 15 minutos)
const limitadorSolicitudes = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'Límite de envío alcanzado. Espera unos minutos antes de volver a consultar.' }
});

// 7. Conectamos las rutas (manteniendo prefijo /api y alias sin prefijo para compatibilidad)
app.use('/api/solicitudes', limitadorSolicitudes, solicitudesRoutes);
app.use('/solicitudes', limitadorSolicitudes, solicitudesRoutes);

app.use('/api/clientes', clientesRoutes);
app.use('/clientes', clientesRoutes);

app.use('/api/servicios', serviciosRoutes);
app.use('/servicios', serviciosRoutes);

app.use('/api/caracteristicas', caracteristicasRoutes);
app.use('/caracteristicas', caracteristicasRoutes);

export { app };