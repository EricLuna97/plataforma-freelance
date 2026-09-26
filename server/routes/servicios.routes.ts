import { Router } from 'express';
import { crearServicio, obtenerServicios, obtenerServicioPorId, actualizarServicio, eliminarServicio } from '../controllers/servicios.controller';

const router = Router();

router.post('/', crearServicio);
router.get('/', obtenerServicios);
router.get('/:id', obtenerServicioPorId);
router.patch('/:id', actualizarServicio);
router.delete('/:id', eliminarServicio);

export default router;