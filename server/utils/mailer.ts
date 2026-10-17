import { Resend } from 'resend';

// Inicializamos Resend solo si la clave está configurada (evita fallos al importar en tests o entornos sin clave)
const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Escapa caracteres especiales de HTML para prevenir inyecciones de código (HTML/XSS) en clientes de correo.
 */
export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

export const enviarAlertaNuevoCliente = async (nombre: string, emailCliente: string, mensaje: string) => {
  if (!resend) {
    console.warn('RESEND_API_KEY no configurada. Omitiendo el envío del email de alerta.');
    return;
  }

  // Sanitizamos el contenido para evitar inyecciones HTML en el lector de correo
  const nombreLimpio = escapeHtml(nombre);
  const emailLimpio = escapeHtml(emailCliente);
  const mensajeLimpio = escapeHtml(mensaje);

  // Evitamos inyección de cabeceras en el subject removiendo saltos de línea
  const subjectLimpio = `Nuevo cliente web: ${nombre.replace(/[\r\n]+/g, ' ').trim()}`;

  // Resend usa su propio método de envío
  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>', // Resend te da este correo temporal gratis para que funcione sin configurar dominios
    to: (process.env.EMAIL_USER as string) || 'soporte@local.dev',
    replyTo: emailCliente,
    subject: subjectLimpio,
    html: `
      <h2>¡Tenés una nueva solicitud de trabajo!</h2>
      <p><strong>Nombre:</strong> ${nombreLimpio}</p>
      <p><strong>Email de contacto:</strong> ${emailLimpio}</p>
      <br/>
      <h3>Mensaje del cliente:</h3>
      <p style="padding: 12px; border-left: 4px solid #333; background-color: #f9f9f9; color: #333; white-space: pre-wrap;">
        ${mensajeLimpio}
      </p>
    `
  });
};