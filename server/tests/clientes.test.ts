import request from 'supertest';
import { app } from '../app';

describe('API de Clientes', () => {
  
  describe('POST /clientes', () => {
    
    it('Debería crear un nuevo cliente al recibir nombre y email', async () => {
      const response = await request(app)
        .post('/clientes')
        .send({
          nombre: "Juan Pérez",
          email: `juan_${Date.now()}@ejemplo.com`
        });

      expect(response.status).toBe(201);
      expect(response.body.nombre).toBe("Juan Pérez");
      expect(response.body).toHaveProperty("id_cliente");
      expect(response.body).toHaveProperty("fecha_registro");
    });

    it('Debería devolver error 400 si falta el nombre', async () => {
      const response = await request(app)
        .post('/clientes')
        .send({ email: `juan_${Date.now()}@ejemplo.com` });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El nombre es obligatorio');
    });

    it('Debería devolver error 400 si falta el email', async () => {
      const response = await request(app)
        .post('/clientes')
        .send({ nombre: "Juan Pérez" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El email es obligatorio');
    });

  });

  describe('GET /clientes', () => {
      it('Debería devolver estado 200 y un arreglo de clientes', async () => {
        // 1. Hacemos la petición GET
        const response = await request(app).get('/clientes');
    
        // 2. Exigimos que el estado sea 200 OK
        expect(response.status).toBe(200);
    
        // 3. Exigimos que la respuesta sea un arreglo
        expect(Array.isArray(response.body)).toBe(true);
      });
    });
    
    // Endpoint para ver el detalle de un solo cliente
    describe('GET /clientes/:id', () => {
      // Happy Path: Búsqueda exitosa
      it('Debería devolver estado 200 y el cliente solicitado', async () => {
        // 1. PREPARACIÓN: Creamos un cliente real temporal
        const creacion = await request(app)
          .post('/clientes')
          .send({ nombre: "Cliente Prueba", email: `prueba_${Date.now()}@test.com` });
        
        // Capturamos el UUID real que generó la base de datos
        const idReal = creacion.body.id_cliente;
    
        // 2. ACTUAR: Buscamos ese ID específico
        const response = await request(app).get(`/clientes/${idReal}`);
    
        // 3. AFIRMAR
        expect(response.status).toBe(200);
        expect(response.body.id_cliente).toBe(idReal);
      });
    
      // Sad Path: ID no existe
      it('Debería devolver estado 404 si el ID no existe en la base de datos', async () => {
        // 1. Enviamos un ID que sabemos que no existe 
        const response = await request(app).get('/clientes/11111111-1111-1111-1111-111111111111');
    
        // 2. Exigimos el rechazo
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Cliente no encontrado');
      });
    
      // Sad Path: ID con formato inválido
      it('Debería devolver estado 400 si el formato del ID es inválido', async () => {
        // 1. Enviamos texto en lugar de un UUID válido
        const response = await request(app).get('/clientes/hola');
    
        // 2. Exigimos el rechazo
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Formato de ID inválido');
      }); 
    });
    
    // Endpoint para modificar datos específicos
    describe('PATCH /clientes/:id', () => {
      // Happy Path: Actualización exitosa
      it('Debería actualizar exitosamente y devolver estado 200', async () => {
        // 1. PREPARACIÓN
        const creacion = await request(app)
          .post('/clientes')
          .send({ nombre: "Cliente Patch", email: `patch_${Date.now()}@test.com` });
        const idReal = creacion.body.id_cliente;
    
        // 2. ACTUAR: Actualizamos solo el email de ese cliente
        const correoModificado = `nuevo_${Date.now()}@test.com`;
        const response = await request(app)
          .patch(`/clientes/${idReal}`)
          .send({ email: correoModificado });
          
        // 3. AFIRMAR
        expect(response.status).toBe(200);
        expect(response.body.email).toBe(correoModificado);
      });
    
      // Sad Path: Actualizar ID inexistente
      it('Debería devolver estado 404 si el ID a actualizar no existe', async () => {
        // Envía: ID que no existe
        const response = await request(app)
          .patch('/clientes/11111111-1111-1111-1111-111111111111')
          .send({
            email: "fallo@test.com"
          });
    
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Cliente no encontrado');
      });
    
      // Sad Path: ID con formato inválido
      it('Debería devolver estado 400 si el formato del ID es inválido', async () => {
        // Envía: ID inválido
        const response = await request(app)
          .patch('/clientes/hola')
          .send({
            email: "fallo@test.com"
          });
    
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Formato de ID inválido');
      });
    });
    
    // Endpoint para borrar un cliente
    describe('DELETE /clientes/:id', () => {
      // Happy Path: Eliminación exitosa
      it('Debería eliminar un cliente exitosamente y devolver estado 204', async () => {
        // 1. PREPARACIÓN
        const creacion = await request(app)
          .post('/clientes')
          .send({ nombre: "Cliente Delete", email: `delete_${Date.now()}@test.com` });
        const idReal = creacion.body.id_cliente;
    
        // 2. ACTUAR: Lo eliminamos
        const response = await request(app).delete(`/clientes/${idReal}`);
    
        // 3. AFIRMAR
        expect(response.status).toBe(204);
      });
    
      // Sad Path: Eliminar ID inexistente
      it('Debería devolver estado 404 si se intenta eliminar un ID inexistente', async () => {
        // Envía: Un ID que ya fue borrado o no existe
        const response = await request(app).delete('/clientes/11111111-1111-1111-1111-111111111111');
    
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error', 'Cliente no encontrado');
      });
    
      // Sad Path: ID con formato inválido
      it('Debería devolver estado 400 si el formato del ID es inválido', async () => {
        // Envía: Letras en lugar de un UUID
        const response = await request(app).delete('/clientes/hola');
    
        // Espera: Estado 400 (Bad Request)
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Formato de ID inválido');
      });
    
      });

});