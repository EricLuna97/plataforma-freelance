import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearSolicitud = async (req: Request, res: Response) => {
  try {
    const { id_cliente, id_servicio, estado, mensaje_adicional } = req.body;
    if (!id_cliente || !id_servicio || !estado) return res.status(400).json({ error: 'Faltan campos obligatorios' });

    const nuevaSolicitud = await prisma.solicitud.create({
      data: { id_cliente, id_servicio, estado, mensaje_adicional }
    });
    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la solicitud' });
  }
};

export const obtenerSolicitudes = async (req: Request, res: Response) => {
  try {
    const solicitudes = await prisma.solicitud.findMany({
      include: { cliente: true, servicio: true }
    });
    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las solicitudes' });
  }
};

export const obtenerSolicitudPorId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    const solicitud = await prisma.solicitud.findUnique({
      where: { id_solicitud: id },
      include: { cliente: true, servicio: true }
    });

    if (!solicitud) return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la solicitud' });
  }
};

export const actualizarSolicitud = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    const { id_cliente, id_servicio, estado, mensaje_adicional } = req.body;
    const solicitudActualizada = await prisma.solicitud.update({
      where: { id_solicitud: id },
      data: { id_cliente, id_servicio, estado, mensaje_adicional }
    });
    res.status(200).json(solicitudActualizada);
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.status(500).json({ error: 'Error al actualizar la solicitud' });
  }
};

export const eliminarSolicitud = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    await prisma.solicitud.delete({ where: { id_solicitud: id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.status(500).json({ error: 'Error al eliminar la solicitud' });
  }
};