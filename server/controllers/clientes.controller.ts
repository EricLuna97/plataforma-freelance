import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const crearCliente = async (req: Request, res: Response) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });
    if (!email) return res.status(400).json({ error: 'El email es obligatorio' });

    const nuevoCliente = await prisma.cliente.create({ data: { nombre, email } });
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
};

export const obtenerClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
};

export const obtenerClientePorId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    const cliente = await prisma.cliente.findUnique({ where: { id_cliente: id } });
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });

    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el cliente' });
  }
};

export const actualizarCliente = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    const { nombre, email, fecha_registro } = req.body;
    const clienteActualizado = await prisma.cliente.update({
      where: { id_cliente: id },
      data: { nombre, email, fecha_registro }
    });

    res.status(200).json(clienteActualizado);
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Cliente no encontrado' });
    res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
};

export const eliminarCliente = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(id)) return res.status(400).json({ error: 'Formato de ID inválido' });

    await prisma.cliente.delete({ where: { id_cliente: id } });
    res.status(204).send();
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: 'Cliente no encontrado' });
    res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
};