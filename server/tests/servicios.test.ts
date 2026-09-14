import request from 'supertest';
import { app } from '../app';

describe('API de Servicios', () => {

  // Endpoint encargado de recibir los datos del cliente y registrarlos en la base de datos
  describe('POST /servicios', () => {
    
    // Happy Path: Creación exitosa
    it('Debería crear un nuevo servicio al recibir los datos obligatorios', async () => {
      
      // 1. ACTUAR: Hacemos la petición POST al servidor
      const response = await request(app)
        .post('/servicios')
        .send({
          "nombre_comercial": "e-commerce lite", "modelo_cobro": "suscripción"
          });

      // 2. AFIRMAR: Comprobamos que el servidor respondió lo correcto
      expect(response.status).toBe(201);
      
      // Comprobamos que el servidor nos devuelve el dato que enviamos
      expect(response.body.nombre_comercial).toBe("e-commerce lite");
      
      // Comprobamos que el servidor generó un ID automáticamente
      expect(response.body).toHaveProperty("id_servicio");
    });

    // Sad Path: Falta nombre comercial
    it('Debería devolver error 400 si falta el nombre_comercial', async () => {
    // 1. Enviamos un JSON incompleto (falta el nombre comercial)
    const response = await request(app)
      .post('/servicios')
      .send({
        modelo_cobro: "Fijo",
        precio: 500
      });

    // 2. Exigimos que el servidor nos rechace con un 400 Bad Request
    expect(response.status).toBe(400);

    // 3. Exigimos que nos envíe un mensaje de error claro
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('El nombre comercial es obligatorio');
  });

    // Sad Path: Falta modelo de cobro
    it('Debería devolver error 400 si falta el modelo_cobro', async () => {
    // 1. Enviamos un JSON donde SÍ está el nombre, pero FALTA el modelo_cobro
    const response = await request(app)
      .post('/servicios')
      .send({
        nombre_comercial: "Desarrollo Web",
        precio: 500
      });

    // 2. Exigimos el rechazo
    expect(response.status).toBe(400);

    // 3. Exigimos el mensaje exacto
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('El modelo de cobro es obligatorio');
  });

  });

  // Endpoint para listar el catálogo completo
  describe('GET /servicios', () => {
  
  it('Debería devolver estado 200 y un arreglo de servicios', async () => {
    // 1. Hacemos la petición GET
    const response = await request(app).get('/servicios');

    // 2. Exigimos que el estado sea 200 OK
    expect(response.status).toBe(200);

    // 3. Exigimos que la respuesta sea un arreglo
    expect(Array.isArray(response.body)).toBe(true);
  });

  });

  //Endpoint para ver el detalle de un solo trabajo
  describe('GET /servicios/:id', () => {

    // Happy Path: Búsqueda exitosa
    it('Debería devolver estado 200 y el servicio solicitado', async () => {
    // 1. Hacemos la petición enviando un ID específico en la URL
    const response = await request(app).get('/servicios/1');

    expect(response.status).toBe(200);

    // 3. Exigimos que nos devuelva un objeto que tenga ese mismo ID
    expect(response.body).toHaveProperty('id_servicio', '1');
    // Verificamos que tenga la estructura correcta
    expect(response.body).toHaveProperty('nombre_comercial');
  });

    // Sad Path: ID no existe
    it('Debería devolver estado 404 si el ID no existe en la base de datos', async () => {
    // 1. Enviamos un ID que sabemos que no existe 
    const response = await request(app).get('/servicios/9999');

    // 2. Exigimos el rechazo
    expect(response.status).toBe(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Servicio no encontrado');
  });

    // Sad Path: ID con formato inválido
    it('Debería devolver estado 400 si el formato del ID es inválido', async () => {
    // 1. Enviamos texto en lugar de un número 
    const response = await request(app).get('/servicios/hola');

    // 2. Exigimos el rechazo
    expect(response.status).toBe(400);
    
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Formato de ID inválido');
  }); 

  });

});