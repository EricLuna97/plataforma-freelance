import { Router } from 'express';
import { 
  crearCliente, 
  obtenerClientes, 
  obtenerClientePorId, 
  actualizarCliente, 
  eliminarCliente 
} from '../controllers/clientes.controller';
import { requerirApiKeyAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de administración de clientes requieren autenticación
router.post('/', requerirApiKeyAdmin, crearCliente);
router.get('/', requerirApiKeyAdmin, obtenerClientes);
router.get('/:id', requerirApiKeyAdmin, obtenerClientePorId);
router.patch('/:id', requerirApiKeyAdmin, actualizarCliente);
router.delete('/:id', requerirApiKeyAdmin, eliminarCliente);

export default router;