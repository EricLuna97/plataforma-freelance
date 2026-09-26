import { Router } from 'express';
import { crearCaracteristica, obtenerCaracteristicas, obtenerCaracteristicaPorId, actualizarCaracteristica, eliminarCaracteristica } from '../controllers/caracteristicas.controller';

const router = Router();

router.post('/', crearCaracteristica);
router.get('/', obtenerCaracteristicas);
router.get('/:id', obtenerCaracteristicaPorId);
router.patch('/:id', actualizarCaracteristica);
router.delete('/:id', eliminarCaracteristica);

export default router;