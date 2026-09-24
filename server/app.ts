import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()
const app = express();

app.use(express.json()); 

// Endpoint encargado de recibir los datos del cliente y registrarlos en la base de datos
app.post('/servicios', async (req: Request, res: Response) => {
  try {
    const { nombre_comercial, modelo_cobro, precio } = req.body;

    // Escudos individuales para cumplir con los tests
    if (!nombre_comercial) {
      return res.status(400).json({ error: 'El nombre comercial es obligatorio' });
    }
    if (!modelo_cobro) {
      return res.status(400).json({ error: 'El modelo de cobro es obligatorio' });
    }
    if (precio === undefined) {
      return res.status(400).json({ error: 'El precio es obligatorio' }); 
    }

    const nuevoServicio = await prisma.servicio.create({
      data: {
        nombre_comercial,
        modelo_cobro,
        precio
      }
    });

    res.status(201).json(nuevoServicio);

  } catch (error) {
    res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
});

app.get('/servicios', async (req: Request, res: Response) => {
  try {
    const servicios = await prisma.servicio.findMany();
    res.status(200).json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
});

//Endpoint para ver el detalle de un solo trabajo
app.get('/servicios/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // 1. ESCUDO DE FORMATO UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    // 2. BUSCAMOS EN LA BD 
    const servicio = await prisma.servicio.findUnique({
      where: { id_servicio: id } 
    });

    if (!servicio) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.status(200).json(servicio);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
});
// Endpoint para modificar datos específicos
app.patch('/servicios/:id', async (req: Request, res: Response) => {
  try {
  const id = req.params.id as string;
  // 1. ESCUDO DE FORMATO UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    // Extraemos lo que sea que nos hayan enviado en el body (puede ser solo el precio, o todo)
    const { nombre_comercial, modelo_cobro, precio, esta_activo } = req.body;

    // 2. ACTUALIZAMOS DIRECTO EN LA BD
    const servicioActualizado = await prisma.servicio.update({
      where: { id_servicio: id },
      data: {
        nombre_comercial,
        modelo_cobro,
        precio,
        esta_activo
      }
    });

    res.status(200).json(servicioActualizado);

  } catch (error: any) {
    // Si Prisma no encuentra el ID para actualizar, lanza el error P2025
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
});

// Endpoint para borrar un servicio
app.delete('/servicios/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // ESCUDO DE FORMATO UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    // ELIMINAMOS DIRECTO EN LA BD
    await prisma.servicio.delete({
      where: { id_servicio: id }
    });

    res.status(204).send();

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
});

app.post('/clientes', async (req: Request, res: Response) => {
  try {
    const { nombre, email } = req.body;

    // 1. ESCUDOS: Exactamente como los exigen los tests
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    if (!email) {
      return res.status(400).json({ error: 'El email es obligatorio' });
    }

    // 2. CREACIÓN: Le pedimos a Prisma que guarde el cliente
    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombre,
        email
      }
    });

    // 3. RESPUESTA: Devolvemos código 201 y el objeto recién creado (que ya traerá el id_cliente y la fecha_registro)
    res.status(201).json(nuevoCliente);

  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
});

app.get('/clientes', async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
});

app.get('/clientes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // 1. ESCUDO DE FORMATO UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    // 2. BUSCAMOS EN LA BD 
    const cliente = await prisma.cliente.findUnique({
      where: { id_cliente: id } 
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(cliente);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
});
// Endpoint para modificar datos específicos
app.patch('/clientes/:id', async (req: Request, res: Response) => {
  try {
  const id = req.params.id as string;
  // 1. ESCUDO DE FORMATO UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    // Extraemos lo que sea que nos hayan enviado en el body 
    const { nombre, email, fecha_registro } = req.body;

    // 2. ACTUALIZAMOS DIRECTO EN LA BD
    const clienteActualizado = await prisma.cliente.update({
      where: { id_cliente: id },
      data: {
        nombre, email, fecha_registro
      }
    });

    res.status(200).json(clienteActualizado);

  } catch (error: any) {
    // Si Prisma no encuentra el ID para actualizar, lanza el error P2025
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
});

// Endpoint para borrar un cliente
app.delete('/clientes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    // ESCUDO DE FORMATO UUID
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    // ELIMINAMOS DIRECTO EN LA BD
    await prisma.cliente.delete({
      where: { id_cliente: id }
    });

    res.status(204).send();

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
});

// Endpoints de Solicitudes
app.post('/solicitudes', async (req: Request, res: Response) => {
  try {
    const { id_cliente, id_servicio, estado, mensaje_adicional } = req.body;

    // 1. ESCUDOS: Verificar que vengan los datos obligatorios
    if (!id_cliente || !id_servicio || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 2. CREACIÓN: Le pedimos a Prisma que guarde la solicitud
    const nuevaSolicitud = await prisma.solicitud.create({
      data: {
        id_cliente,
        id_servicio,
        estado,
        mensaje_adicional // Prisma sabe que este es opcional
      }
    });

    // 3. RESPUESTA: Todo OK
    res.status(201).json(nuevaSolicitud);

  } catch (error) {
    res.status(500).json({ error: 'Error al crear la solicitud' });
  }
});

app.get('/solicitudes', async (req: Request, res: Response) => {
  try {
    const solicitudes = await prisma.solicitud.findMany();
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las solicitudes' });
  }
});

app.get('/solicitudes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    const solicitud = await prisma.solicitud.findUnique({
      where: { id_solicitud: id } 
    });

    if (!solicitud) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.status(200).json(solicitud);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la solicitud' });
  }
});

app.patch('/solicitudes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    const { id_cliente, id_servicio, estado, mensaje_adicional } = req.body;

    const solicitudActualizada = await prisma.solicitud.update({
      where: { id_solicitud: id },
      data: {
        id_cliente, 
        id_servicio, 
        estado, 
        mensaje_adicional
      }
    });

    res.status(200).json(solicitudActualizada);

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la solicitud' });
  }
});

app.delete('/solicitudes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    await prisma.solicitud.delete({
      where: { id_solicitud: id }
    });

    res.status(204).send();

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la solicitud' });
  }
});

// ENDPOINTS DE CARACTERÍSTICAS DE SERVICIOS
app.post('/caracteristicas', async (req: Request, res: Response) => {
  try {
    const { descripcion, orden_visual, id_servicio } = req.body;

    // 1. ESCUDOS: Verificar campos obligatorios (orden_visual es opcional según tu esquema)
    if (!descripcion || !id_servicio) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 2. CREACIÓN
    const nuevaCaracteristica = await prisma.caracteristicaServicio.create({
      data: {
        descripcion,
        orden_visual,
        id_servicio
      }
    });

    res.status(201).json(nuevaCaracteristica);

  } catch (error) {
    res.status(500).json({ error: 'Error al crear la característica' });
  }
});

app.get('/caracteristicas', async (req: Request, res: Response) => {
  try {
    const caracteristicas = await prisma.caracteristicaServicio.findMany();
    res.status(200).json(caracteristicas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las características' });
  }
});

app.get('/caracteristicas/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    const caracteristica = await prisma.caracteristicaServicio.findUnique({
      where: { id_caracteristica: id } 
    });

    if (!caracteristica) {
      return res.status(404).json({ error: 'Característica no encontrada' });
    }

    res.status(200).json(caracteristica);

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la característica' });
  }
});

app.patch('/caracteristicas/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    const { descripcion, orden_visual, id_servicio } = req.body;

    const caracteristicaActualizada = await prisma.caracteristicaServicio.update({
      where: { id_caracteristica: id },
      data: {
        descripcion,
        orden_visual,
        id_servicio
      }
    });

    res.status(200).json(caracteristicaActualizada);

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Característica no encontrada' });
    }
    res.status(500).json({ error: 'Error al actualizar la característica' });
  }
});

app.delete('/caracteristicas/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) {
      return res.status(400).json({ error: 'Formato de ID inválido' });
    }

    await prisma.caracteristicaServicio.delete({
      where: { id_caracteristica: id }
    });

    res.status(204).send();

  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Característica no encontrada' });
    }
    res.status(500).json({ error: 'Error al eliminar la característica' });
  }
});

export { app };