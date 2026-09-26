import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearCaracteristica = async (req: Request, res: Response) => {
  try {
    const { descripcion, orden_visual, id_servicio } = req.body;
    if (!descripcion || !id_servicio) return res.status(400).json({ error: 'Faltan campos obligatorios' });

    const nuevaCaracteristica = await prisma.caracteristicaServicio.create({
      data: { descripcion, orden_visual, id_servicio }
    });
    res.status(201).json(nuevaCaracteristica);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la característica' });
  }
};

export const obtenerCaracteristicas = async (req: Request, res: Response) => {
  try {
    const caracteristicas = await prisma.caracteristicaServicio.findMany();
    res.status(200).json(caracteristicas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las características' });
  }
};

export const obtenerCaracteristicaPorId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    const caracteristica = await prisma.caracteristicaServicio.findUnique({
      where: { id_caracteristica: id } 
    });

    if (!caracteristica) return res.status(404).json({ error: 'Característica no encontrada' });
    res.status(200).json(caracteristica);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la característica' });
  }
};

export const actualizarCaracteristica = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    const { descripcion, orden_visual, id_servicio } = req.body;
    const caracteristicaActualizada = await prisma.caracteristicaServicio.update({
      where: { id_caracteristica: id },
      data: { descripcion, orden_visual, id_servicio }
    });
    res.status(200).json(caracteristicaActualizada);
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Característica no encontrada' });
    res.status(500).json({ error: 'Error al actualizar la característica' });
  }
};

export const eliminarCaracteristica = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    await prisma.caracteristicaServicio.delete({
      where: { id_caracteristica: id }
    });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Característica no encontrada' });
    res.status(500).json({ error: 'Error al eliminar la característica' });
  }
};