import request from 'supertest';
import { app } from '../app';

describe('API de Características de Servicio', () => {

  describe('POST /caracteristicas', () => {
    it('Debería crear una característica vinculada a un servicio', async () => {
      // 1. PREPARACIÓN: Crear el servicio padre
      const resServicio = await request(app)
        .post('/servicios')
        .send({ nombre_comercial: "Servicio para Características", descripcion: "Desc", precio: 100, modelo_cobro: "Fijo" });
      const idServicio = resServicio.body.id_servicio;

      // 2. ACTUAR
      const response = await request(app)
        .post('/caracteristicas')
        .send({
          descripcion: "Incluye integración con base de datos",
          orden_visual: 1,
          id_servicio: idServicio
        });

      // 3. AFIRMAR
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id_caracteristica");
      expect(response.body.descripcion).toBe("Incluye integración con base de datos");
      expect(response.body.id_servicio).toBe(idServicio);
    });

    it('Debería devolver error 400 si falta un campo obligatorio', async () => {
      const response = await request(app)
        .post('/caracteristicas')
        .send({
          // Enviamos solo el ID, falta la descripción
          id_servicio: "22222222-2222-2222-2222-222222222222"
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Faltan campos obligatorios');
    });
  });

  describe('GET /caracteristicas', () => {
    it('Debería devolver estado 200 y un arreglo', async () => {
      const response = await request(app).get('/caracteristicas');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /caracteristicas/:id', () => {
    it('Debería devolver estado 200 y la característica solicitada', async () => {
      // 1. PREPARACIÓN
      const resServicio = await request(app).post('/servicios').send({ nombre_comercial: "Servicio GET", descripcion: "Desc", precio: 100, modelo_cobro: "Fijo" });
      const creacion = await request(app).post('/caracteristicas').send({ descripcion: "Item 1", id_servicio: resServicio.body.id_servicio });
      const idReal = creacion.body.id_caracteristica;

      // 2. ACTUAR
      const response = await request(app).get(`/caracteristicas/${idReal}`);

      // 3. AFIRMAR
      expect(response.status).toBe(200);
      expect(response.body.id_caracteristica).toBe(idReal);
    });

    it('Debería devolver estado 404 si el ID no existe', async () => {
      const response = await request(app).get('/caracteristicas/11111111-1111-1111-1111-111111111111');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Característica no encontrada');
    });

    it('Debería devolver estado 400 si el formato del ID es inválido', async () => {
      const response = await request(app).get('/caracteristicas/hola');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Formato de ID inválido');
    });
  });

  describe('PATCH /caracteristicas/:id', () => {
    it('Debería actualizar exitosamente y devolver estado 200', async () => {
      // 1. PREPARACIÓN
      const resServicio = await request(app).post('/servicios').send({ nombre_comercial: "Servicio PATCH", descripcion: "Desc", precio: 200, modelo_cobro: "Fijo" });
      const creacion = await request(app).post('/caracteristicas').send({ descripcion: "Vieja desc", id_servicio: resServicio.body.id_servicio });
      const idReal = creacion.body.id_caracteristica;

      // 2. ACTUAR: Cambiamos la descripción
      const response = await request(app)
        .patch(`/caracteristicas/${idReal}`)
        .send({ descripcion: "Nueva desc actualizada", orden_visual: 2 });
        
      // 3. AFIRMAR
      expect(response.status).toBe(200);
      expect(response.body.descripcion).toBe("Nueva desc actualizada");
      expect(response.body.orden_visual).toBe(2);
    });
  });

  describe('DELETE /caracteristicas/:id', () => {
    it('Debería eliminar exitosamente y devolver estado 204', async () => {
      // 1. PREPARACIÓN
      const resServicio = await request(app).post('/servicios').send({ nombre_comercial: "Servicio DEL", descripcion: "Desc", precio: 300, modelo_cobro: "Fijo" });
      const creacion = await request(app).post('/caracteristicas').send({ descripcion: "A borrar", id_servicio: resServicio.body.id_servicio });
      const idReal = creacion.body.id_caracteristica;

      // 2. ACTUAR
      const response = await request(app).delete(`/caracteristicas/${idReal}`);

      // 3. AFIRMAR
      expect(response.status).toBe(204);
    });
  });

});