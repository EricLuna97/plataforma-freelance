import { Router } from 'express';
import { crearServicio, obtenerServicios, obtenerServicioPorId, actualizarServicio, eliminarServicio } from '../controllers/servicios.controller';
import { requerirApiKeyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Lectura de catálogo pública
router.get('/', obtenerServicios);
router.get('/:id', obtenerServicioPorId);

// Modificación y eliminación restringida a administradores
router.post('/', requerirApiKeyAdmin, crearServicio);
router.patch('/:id', requerirApiKeyAdmin, actualizarServicio);
router.delete('/:id', requerirApiKeyAdmin, eliminarServicio);

export default router;