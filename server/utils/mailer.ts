import nodemailer from 'nodemailer';

// Configuramos la conexión con Gmail
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función armadora del correo
export const enviarAlertaNuevoCliente = async (nombre: string, emailCliente: string, mensaje: string) => {
  const mailOptions = {
    from: `"Plataforma Freelance" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: emailCliente,
    subject: `🚀 Nuevo cliente web: ${nombre}`,
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
  };

  await transporter.sendMail(mailOptions);
};