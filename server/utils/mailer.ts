import { Resend } from 'resend';

// Inicializamos Resend con la llave que pondremos en Render
const resend = new Resend(process.env.RESEND_API_KEY);

export const enviarAlertaNuevoCliente = async (nombre: string, emailCliente: string, mensaje: string) => {
  // Resend usa su propio método de envío
  await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>', // Resend te da este correo temporal gratis para que funcione sin configurar dominios
    to: process.env.EMAIL_USER as string, // Tu correo de Gmail a donde te van a llegar las alertas
    replyTo: emailCliente,
    subject: `Nuevo cliente web: ${nombre}`,
    html: `
      <h2>¡Tenés una nueva solicitud de trabajo!</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Email de contacto:</strong> ${emailCliente}</p>
      <br/>
      <h3>Mensaje del cliente:</h3>
      <p style="padding: 12px; border-left: 4px solid #333; background-color: #f9f9f9; color: #333;">
        ${mensaje}
      </p>
    `
  });
};