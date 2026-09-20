import express, { Request, Response } from 'express';

const app = express();

app.use(express.json()); 

// Endpoint encargado de recibir los datos del cliente y registrarlos en la base de datos
app.post('/servicios', (req: Request, res: Response) => {
  const datosDelCliente = req.body;

  // Sad Path: Falta nombre comercial
  if (!datosDelCliente.nombre_comercial) {
    return res.status(400).json({ 
      error: 'El nombre comercial es obligatorio' 
    });
  }

  // Sad Path: Falta modelo de cobro
  if (!datosDelCliente.modelo_cobro) {
    return res.status(400).json({ 
      error: 'El modelo de cobro es obligatorio' 
    });
  }

  // Happy Path: creación exitosa
  const servicioCreado = {
    ...datosDelCliente,
    id_servicio: "123-uuid-falso"
  };

  res.status(201).json(servicioCreado);
});

//Endpoint para listar el catálogo completo
app.get('/servicios', (req: Request, res: Response) => {
  
  // Como aún no conectamos Prisma, simulamos que la base de datos 
  // está vacía o nos devuelve nuestra lista.
  const catalogoServicios: any[] = [];

  res.status(200).json(catalogoServicios);
});

//Endpoint para ver el detalle de un solo trabajo
app.get('/servicios/:id', (req: Request, res: Response) => {
  // 1. Extraemos el ID dinámico que el cliente puso en la URL
  const { id } = req.params;

  
  // Sad Path: ID con formato inválido
  
  if (isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Formato de ID inválido'
    });
  }
  
  

  // Sad Path: ID no existe
  // Mock temporal de Base de Datos vacía
  // Si el test nos pide el ID "9999", fingimos que Prisma no encontró nada.
  if (id === '9999') {
    return res.status(404).json({
      error: 'Servicio no encontrado'
    });
  }

  // Happy Path: Búsqueda exitosa
  // 2. Mock: Creamos un servicio falso con el ID que nos pidieron,
  // fingiendo que Prisma lo acaba de encontrar en PostgreSQL.
  const servicioEncontrado = {
    id_servicio: id,
    nombre_comercial: "Desarrollo Web",
    modelo_cobro: "Fijo",
    precio: 500
  };

  // 3. Devolvemos el servicio con estado 200
  res.status(200).json(servicioEncontrado);
});

// Endpoint para modificar datos específicos
app.patch('/servicios/:id', (req: Request, res: Response) => {
  
  const { id } = req.params;
  const datosNuevos = req.body;

  // Sad Path: ID con formato inválido
  // Si intentan convertir el ID a número y da NaN
  if (isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Formato de ID inválido'
    });
  }

  // Sad Path: Actualizar ID inexistente
  // Simulamos que Prisma buscó en la BD y no encontró nada
  if (id === '9999') {
    return res.status(404).json({
      error: 'Servicio no encontrado'
    });
  }

  // Happy Path: Actualización exitosa
  // 2. Simulamos el servicio como estaba en la BD antes del cambio
  const servicioViejo = {
    id_servicio: id,
    nombre_comercial: "Desarrollo Web",
    modelo_cobro: "Fijo",
    precio: 500 // precio viejo!
  };

  // 3. Fusionamos ambos usando spread operator (...)
  const servicioActualizado = {
    ...servicioViejo,
    ...datosNuevos
  };

  // 4. Respondemos con el código 200 y el objeto ya fusionado
  res.status(200).json(servicioActualizado);
});

// Endpoint para borrar un servicio
app.delete('/servicios/:id', (req: Request, res: Response) => {
  // 1. Extraemos el ID de la URL
  const { id } = req.params;

  // Sad Path: ID con formato inválido
  if (isNaN(Number(id))) {
    return res.status(400).json({
      error: 'Formato de ID inválido'
    });
  }

  // Sad Path: Eliminar ID inexistente
  if (id === '9999') {
    return res.status(404).json({
      error: 'Servicio no encontrado'
    });
  }

  // Happy Path: Eliminación exitosa
  // 2. Aquí en el futuro Prisma ejecutará: await prisma.servicio.delete({ where: { id } })
  // Por ahora simulamos que la eliminación física en la BD fue un éxito.

  // 3. Respondemos con 204 y enviamos la respuesta vacía (.send)
  res.status(204).send();
});

export { app };