import { Router } from 'express';
import { crearSolicitud, obtenerSolicitudes, obtenerSolicitudPorId, actualizarSolicitud, eliminarSolicitud } from '../controllers/solicitudes.controller';
import { requerirApiKeyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint público: recepción de consultas desde la web
router.post('/', crearSolicitud);

// Endpoints protegidos para administración
router.get('/', requerirApiKeyAdmin, obtenerSolicitudes);
router.get('/:id', requerirApiKeyAdmin, obtenerSolicitudPorId);
router.patch('/:id', requerirApiKeyAdmin, actualizarSolicitud);
router.delete('/:id', requerirApiKeyAdmin, eliminarSolicitud);

export default router;