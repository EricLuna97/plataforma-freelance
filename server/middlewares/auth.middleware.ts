import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para proteger rutas administrativas (lectura de clientes, borrado, etc.)
 * Exige una clave secreta en la cabecera 'x-api-key' o 'Authorization: Bearer <key>'.
 */
export const requerirApiKeyAdmin = (req: Request, res: Response, next: NextFunction) => {
  // En entorno de tests automáticos de Jest, permitimos el paso para no alterar los tests unitarios existentes
  if (process.env.NODE_ENV === 'test') {
    return next();
  }

  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    if (process.env.NODE_ENV === 'production') {
      return res.status(500).json({
        error: 'Configuración de seguridad incompleta: ADMIN_API_KEY no está configurada en producción.'
      });
    }
    // En desarrollo local sin clave configurada, advertimos pero permitimos avanzar
    console.warn('[SEGURIDAD] Advertencia: Accediendo a ruta protegida sin ADMIN_API_KEY configurada.');
    return next();
  }

  const rawHeader = req.headers['x-api-key'] || req.headers['authorization'];
  let keyProporcionada = '';

  if (typeof rawHeader === 'string') {
    keyProporcionada = rawHeader.startsWith('Bearer ')
      ? rawHeader.slice(7).trim()
      : rawHeader.trim();
  }

  if (!keyProporcionada || keyProporcionada !== adminKey) {
    return res.status(401).json({
      error: 'Acceso no autorizado. Se requiere una API Key administrativa válida.'
    });
  }

  next();
};

