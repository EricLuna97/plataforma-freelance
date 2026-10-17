import request from 'supertest';
import { app } from '../app';

describe('Pruebas de Seguridad y Escudos del Sistema', () => {

  describe('Validación y Saneamiento en POST /api/solicitudes', () => {

    it('Debe rechazar solicitudes con formato de email inválido', async () => {
      const response = await request(app)
        .post('/api/solicitudes')
        .send({
          nombre: 'Juan Tester',
          email: 'correo-invalido-sin-arroba',
          mensaje: 'Hola, quiero una consulta'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/email/i);
    });

    it('Debe rechazar mensajes con longitud menor a la requerida', async () => {
      const response = await request(app)
        .post('/api/solicitudes')
        .send({
          nombre: 'Juan Tester',
          email: 'juan@test.com',
          mensaje: 'Hi'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/mensaje/i);
    });

    it('Debe neutralizar bots mediante el escudo Honeypot (retornar 201 sin procesar)', async () => {
      const response = await request(app)
        .post('/api/solicitudes')
        .send({
          nombre: 'Spambot 3000',
          email: 'bot@spam.com',
          mensaje: 'Compra criptomonedas ahora mismo',
          telefono_confirmacion: '555-SPAM' // Campo trampa completado por el bot
        });

      expect(response.status).toBe(201);
      expect(response.body.estado).toBe('PENDIENTE');
      expect(response.body.id_solicitud).toBe('ok');
    });

  });

  describe('Cabeceras de Seguridad HTTP (Helmet)', () => {
    it('Debe incluir cabeceras de seguridad y ocultar X-Powered-By', async () => {
      const response = await request(app).get('/servicios');

      expect(response.headers['x-powered-by']).toBeUndefined();
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });
  });

});

