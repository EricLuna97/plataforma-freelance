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

export { app };