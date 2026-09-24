import request from 'supertest';
import { app } from '../app';

describe('API de Solicitudes', () => {
  
  describe('POST /solicitudes', () => {
    
    it('Debería crear una nueva solicitud vinculando un cliente y un servicio', async () => {
      // 1. PREPARACIÓN: Crear dependencias primero
      const resServicio = await request(app)
        .post('/servicios')
        .send({ nombre_comercial: "API Personalizada", descripcion: "Desarrollo", precio: 500, modelo_cobro: "Fijo" });
      const idServicio = resServicio.body.id_servicio;

      const resCliente = await request(app)
        .post('/clientes')
        .send({ nombre: "Empresa X", email: `empresax_${Date.now()}@test.com` });
      const idCliente = resCliente.body.id_cliente;

      // 2. ACTUAR: Crear la solicitud
      const response = await request(app)
        .post('/solicitudes')
        .send({
          id_cliente: idCliente,
          id_servicio: idServicio,
          estado: "Pendiente",
          mensaje_adicional: "Quiero arrancar lo antes posible"
        });
        
      // 3. AFIRMAR
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id_solicitud");
      expect(response.body.estado).toBe("Pendiente");
      expect(response.body.id_cliente).toBe(idCliente);
      expect(response.body.id_servicio).toBe(idServicio);
    });

    it('Debería devolver error 400 si falta un campo obligatorio', async () => {
      const response = await request(app)
        .post('/solicitudes')
        .send({
          // Falta estado namás para probar el escudo
          id_cliente: "11111111-1111-1111-1111-111111111111",
          id_servicio: "22222222-2222-2222-2222-222222222222"
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Faltan campos obligatorios');
    });

  });

  describe('GET /solicitudes', () => {
      it('Debería devolver estado 200 y un arreglo de solicitudes', async () => {
        const response = await request(app).get('/solicitudes');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
      });
    });
    
    describe('GET /solicitudes/:id', () => {
      it('Debería devolver estado 200 y la solicitud solicitada', async () => {
        // 1. PREPARACIÓN
        const resServicio = await request(app).post('/servicios').send({ nombre_comercial: "Servicio GET", descripcion: "Desc", precio: 100, modelo_cobro: "Fijo" });
        const resCliente = await request(app).post('/clientes').send({ nombre: "Cliente GET", email: `get_${Date.now()}@test.com` });
        const creacion = await request(app).post('/solicitudes').send({ id_cliente: resCliente.body.id_cliente, id_servicio: resServicio.body.id_servicio, estado: "Pendiente" });
        const idReal = creacion.body.id_solicitud;
    
        // 2. ACTUAR
        const response = await request(app).get(`/solicitudes/${idReal}`);
    
        // 3. AFIRMAR
        expect(response.status).toBe(200);
        expect(response.body.id_solicitud).toBe(idReal);
      });
    
      it('Debería devolver estado 404 si el ID no existe', async () => {
        const response = await request(app).get('/solicitudes/11111111-1111-1111-1111-111111111111');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Solicitud no encontrada');
      });
    
      it('Debería devolver estado 400 si el formato del ID es inválido', async () => {
        const response = await request(app).get('/solicitudes/hola');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Formato de ID inválido');
      }); 
    });
    
    describe('PATCH /solicitudes/:id', () => {
      it('Debería actualizar exitosamente y devolver estado 200', async () => {
        // 1. PREPARACIÓN
        const resServicio = await request(app).post('/servicios').send({ nombre_comercial: "Servicio PATCH", descripcion: "Desc", precio: 200, modelo_cobro: "Fijo" });
        const resCliente = await request(app).post('/clientes').send({ nombre: "Cliente PATCH", email: `patch_${Date.now()}@test.com` });
        const creacion = await request(app).post('/solicitudes').send({ id_cliente: resCliente.body.id_cliente, id_servicio: resServicio.body.id_servicio, estado: "Pendiente" });
        const idReal = creacion.body.id_solicitud;
    
        // 2. ACTUAR: Cambiamos el estado a Completado
        const response = await request(app)
          .patch(`/solicitudes/${idReal}`)
          .send({ estado: "Completado" });
          
        // 3. AFIRMAR
        expect(response.status).toBe(200);
        expect(response.body.estado).toBe("Completado");
      });
    
      it('Debería devolver estado 404 si el ID a actualizar no existe', async () => {
        const response = await request(app).patch('/solicitudes/11111111-1111-1111-1111-111111111111').send({ estado: "Completado" });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Solicitud no encontrada');
      });
    
      it('Debería devolver estado 400 si el formato del ID es inválido', async () => {
        const response = await request(app).patch('/solicitudes/hola').send({ estado: "Completado" });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Formato de ID inválido');
      });
    });
    
    describe('DELETE /solicitudes/:id', () => {
      it('Debería eliminar una solicitud exitosamente y devolver estado 204', async () => {
        // 1. PREPARACIÓN
        const resServicio = await request(app).post('/servicios').send({ nombre_comercial: "Servicio DEL", descripcion: "Desc", precio: 300, modelo_cobro: "Fijo" });
        const resCliente = await request(app).post('/clientes').send({ nombre: "Cliente DEL", email: `del_${Date.now()}@test.com` });
        const creacion = await request(app).post('/solicitudes').send({ id_cliente: resCliente.body.id_cliente, id_servicio: resServicio.body.id_servicio, estado: "Pendiente" });
        const idReal = creacion.body.id_solicitud;
    
        // 2. ACTUAR
        const response = await request(app).delete(`/solicitudes/${idReal}`);
    
        // 3. AFIRMAR
        expect(response.status).toBe(204);
      });
    
      it('Debería devolver estado 404 si se intenta eliminar un ID inexistente', async () => {
        const response = await request(app).delete('/solicitudes/11111111-1111-1111-1111-111111111111');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Solicitud no encontrada');
      });
    
      it('Debería devolver estado 400 si el formato del ID es inválido', async () => {
        const response = await request(app).delete('/solicitudes/hola');
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Formato de ID inválido');
      });
    });
});