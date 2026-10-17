import { Router } from 'express';
import { crearCaracteristica, obtenerCaracteristicas, obtenerCaracteristicaPorId, actualizarCaracteristica, eliminarCaracteristica } from '../controllers/caracteristicas.controller';
import { requerirApiKeyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Lectura de características pública
router.get('/', obtenerCaracteristicas);
router.get('/:id', obtenerCaracteristicaPorId);

// Modificación y eliminación restringida a administradores
router.post('/', requerirApiKeyAdmin, crearCaracteristica);
router.patch('/:id', requerirApiKeyAdmin, actualizarCaracteristica);
router.delete('/:id', requerirApiKeyAdmin, eliminarCaracteristica);

export default router;