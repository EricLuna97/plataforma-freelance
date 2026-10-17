import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { enviarAlertaNuevoCliente } from '../utils/mailer';

const prisma = new PrismaClient();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const crearSolicitud = async (req: Request, res: Response) => {
  try {
    const { nombre, email, mensaje, id_servicio, id_cliente, estado, mensaje_adicional, telefono_confirmacion, sitio_web } = req.body;

    // 1. ESCUDO ANTI-BOTS (Honeypot): Si el bot llenó campos invisibles para humanos, descartamos en silencio
    if (telefono_confirmacion || sitio_web) {
      return res.status(201).json({ id_solicitud: 'ok', estado: 'PENDIENTE' });
    }

    // 2. FLUJO FORMULARIO WEB (nombre, email, mensaje)
    if (nombre !== undefined || email !== undefined || mensaje !== undefined) {
      const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
      const emailLimpio = typeof email === 'string' ? email.trim().toLowerCase() : '';
      const mensajeLimpio = typeof mensaje === 'string' ? mensaje.trim() : '';

      if (!nombreLimpio || !emailLimpio || !mensajeLimpio) {
        return res.status(400).json({ error: 'Faltan nombre, email o mensaje' });
      }

      if (nombreLimpio.length < 2 || nombreLimpio.length > 100) {
        return res.status(400).json({ error: 'El nombre debe tener entre 2 y 100 caracteres' });
      }

      if (emailLimpio.length < 5 || emailLimpio.length > 150 || !EMAIL_REGEX.test(emailLimpio)) {
        return res.status(400).json({ error: 'El email proporcionado no tiene un formato válido' });
      }

      if (mensajeLimpio.length < 5 || mensajeLimpio.length > 3000) {
        return res.status(400).json({ error: 'El mensaje debe tener entre 5 y 3000 caracteres' });
      }

      // Upsert del cliente seguro
      const cliente = await prisma.cliente.upsert({
        where: { email: emailLimpio },
        update: { nombre: nombreLimpio },
        create: {
          nombre: nombreLimpio,
          email: emailLimpio
        }
      });

      // Determinamos el servicio: si mandaron uno válido, lo usamos; sino buscamos el de consulta general o el primero activo
      let servicioAsociadoId = id_servicio;
      if (!servicioAsociadoId) {
        const servicioGeneral = await prisma.servicio.findFirst({
          where: { esta_activo: true }
        });
        if (servicioGeneral) {
          servicioAsociadoId = servicioGeneral.id_servicio;
        } else {
          // Si no hay servicios creados en la BD, creamos uno base para evitar fallo de integridad referencial
          const servicioNuevo = await prisma.servicio.create({
            data: {
              nombre_comercial: 'Consulta General',
              modelo_cobro: 'A convenir',
              esta_activo: true
            }
          });
          servicioAsociadoId = servicioNuevo.id_servicio;
        }
      }

      const nuevaSolicitud = await prisma.solicitud.create({
        data: {
          id_cliente: cliente.id_cliente,
          id_servicio: servicioAsociadoId,
          estado: 'PENDIENTE',
          mensaje_adicional: mensajeLimpio
        }
      });

      // Alerta por email protegida contra fallos
      try {
        await enviarAlertaNuevoCliente(nombreLimpio, emailLimpio, mensajeLimpio);
      } catch (errEmail) {
        console.error('Error enviando el email de alerta:', errEmail);
      }

      return res.status(201).json(nuevaSolicitud);
    }

    // 3. FLUJO DIRECTO DE API / TESTS (id_cliente, id_servicio, estado)
    if (!id_cliente || !id_servicio || !estado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevaSolicitud = await prisma.solicitud.create({
      data: {
        id_cliente,
        id_servicio,
        estado,
        mensaje_adicional
      }
    });

    return res.status(201).json(nuevaSolicitud);

  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
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