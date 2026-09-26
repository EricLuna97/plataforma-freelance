import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearServicio = async (req: Request, res: Response) => {
  try {
    const { nombre_comercial, modelo_cobro, precio } = req.body;
    if (!nombre_comercial) return res.status(400).json({ error: 'El nombre comercial es obligatorio' });
    if (!modelo_cobro) return res.status(400).json({ error: 'El modelo de cobro es obligatorio' });
    if (precio === undefined) return res.status(400).json({ error: 'El precio es obligatorio' }); 

    const nuevoServicio = await prisma.servicio.create({
      data: { nombre_comercial, modelo_cobro, precio }
    });
    res.status(201).json(nuevoServicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar en la base de datos' });
  }
};

export const obtenerServicios = async (req: Request, res: Response) => {
  try {
    const servicios = await prisma.servicio.findMany();
    res.status(200).json(servicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los servicios' });
  }
};

export const obtenerServicioPorId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    const servicio = await prisma.servicio.findUnique({ where: { id_servicio: id } });
    if (!servicio) return res.status(404).json({ error: 'Servicio no encontrado' });

    res.status(200).json(servicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el servicio' });
  }
};

export const actualizarServicio = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    const { nombre_comercial, modelo_cobro, precio, esta_activo } = req.body;
    const servicioActualizado = await prisma.servicio.update({
      where: { id_servicio: id },
      data: { nombre_comercial, modelo_cobro, precio, esta_activo }
    });

    res.status(200).json(servicioActualizado);
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Servicio no encontrado' });
    res.status(500).json({ error: 'Error al actualizar el servicio' });
  }
};

export const eliminarServicio = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    await prisma.servicio.delete({ where: { id_servicio: id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Servicio no encontrado' });
    res.status(500).json({ error: 'Error al eliminar el servicio' });
  }
};