import { Router } from 'express';
import { crearSolicitud, obtenerSolicitudes, obtenerSolicitudPorId, actualizarSolicitud, eliminarSolicitud } from '../controllers/solicitudes.controller';

const router = Router();

router.post('/', crearSolicitud);
router.get('/', obtenerSolicitudes);
router.get('/:id', obtenerSolicitudPorId);
router.patch('/:id', actualizarSolicitud);
router.delete('/:id', eliminarSolicitud);

export default router;