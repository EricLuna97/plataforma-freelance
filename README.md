# Plataforma Freelance - Eric Luna

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-BC52EE?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)

Plataforma web profesional y portfolio de servicios de desarrollo de software para clientes particulares y empresas. Desarrollada bajo una arquitectura desacoplada full-stack (Frontend Jamstack de alto rendimiento + API REST robusta + PostgreSQL), enfocada en velocidad, diseño moderno, seguridad y calidad de código respaldada por pruebas automatizadas.

---

## 🏛️ Arquitectura del Sistema

El proyecto está organizado en un monorepo desacoplado:

```
plataforma-freelance/
├── client/          # Frontend Jamstack (Astro 5 + React 19 + Tailwind CSS)
└── server/          # Backend API REST (Node.js + Express + Prisma + PostgreSQL)
```

```
[ Visitante Web ]
       │
       ▼
[ Frontend (Astro / React) ]  ── (POST /api/solicitudes) ──►  [ Backend (Express REST API) ]
                                                                       │
                                               ┌───────────────────────┴───────────────────────┐
                                               ▼                                               ▼
                                    [ PostgreSQL (Prisma) ]                          [ Resend Email API ]
                                     (Almacena cliente y solicitud)              (Notifica al desarrollador)
```

---

## ✨ Características Principales

- **Catálogo de Servicios:** Presentación clara de soluciones especializadas (E-commerce Lite, Desarrollo a medida, Testing y Refactorización).
- **Formulario de Contacto Interactivo:** Componente dinámico de React con validación de entradas, límites de longitud y respuestas en tiempo real.
- **Notificaciones Inmediatas por Email:** Integración con la API de [Resend](https://resend.com) para recibir alertas directas en Gmail con cada nueva solicitud de trabajo.
- **Base de Datos Relacional:** Gestión integral mediante Prisma ORM para clientes, servicios, características y solicitudes.
- **Entorno de Contenedores:** Docker Compose preconfigurado para levantar la base de datos PostgreSQL en desarrollo local con un solo comando.
- **Cobertura de Pruebas Automatizadas:** 
  - Pruebas unitarias y de integración para la API con **Jest** y **Supertest** (50 tests implementados).
  - Pruebas End-to-End (E2E) con **Playwright** para la navegación y el envío del formulario.

---

## 🛡️ Medidas de Seguridad Implementadas

El sistema cuenta con un blindaje multicapa implementado para producción:

1. **Protección de Rutas Administrativas:** Endpoints sensibles (`GET /api/solicitudes`, CRUD de clientes, etc.) asegurados mediante middleware con autenticación de clave secreta (`ADMIN_API_KEY`).
2. **Escudo Anti-Bots (Honeypot):** Trampa oculta en el formulario que neutraliza spambots automáticamente sin alterar la experiencia del usuario.
3. **Control de Tasa (Rate Limiting):**
   - Límite global: 150 peticiones cada 15 minutos por IP.
   - Límite específico en solicitudes: Máximo 10 consultas cada 15 minutos por IP para proteger el servicio de email y la base de datos.
4. **Cabeceras de Seguridad HTTP (Helmet):** Ocultación del header `X-Powered-By` y mitigación de ataques de tipo Clickjacking (`X-Frame-Options`) y MIME sniffing (`X-Content-Type-Options`).
5. **CORS Estricto:** Lista blanca configurable mediante variable de entorno (`FRONTEND_URL` / `ALLOWED_ORIGINS`).
6. **Saneamiento y Validación de Entradas:**
   - Verificación de formato real de correo electrónico mediante Regex.
   - Restricción de longitud de campos (nombre, email y mensaje).
   - Escapado de caracteres especiales HTML para prevenir inyecciones en clientes de correo.
   - Límite estricto en el tamaño del payload JSON (`10kb`).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | Astro 5 | Renderizado estático y arquitectura de islas de alto rendimiento |
| **UI Components** | React 19 | Interactividad dinámica en componentes clave |
| **Estilos** | Tailwind CSS v4 | Diseño responsive minimalista con estética moderna |
| **Backend** | Node.js + Express | API REST estructurada con TypeScript |
| **ORM** | Prisma | Modelado y migraciones de base de datos tipo-seguras |
| **Base de Datos** | PostgreSQL 15 | Almacenamiento relacional de clientes y solicitudes |
| **Mailing** | Resend | Envíos transaccionales y alertas en tiempo real |
| **Testing** | Jest + Supertest + Playwright | Pruebas unitarias, de integración y E2E |

---

## 🚀 Puesta en Marcha en Local

### 1. Prerrequisitos
- [Node.js](https://nodejs.org/) (versión 22.x o superior)
- [Docker](https://www.docker.com/) y Docker Compose (para la base de datos)
- Git

### 2. Clonar el repositorio
```bash
git clone https://github.com/EricLuna97/plataforma-freelance.git
cd plataforma-freelance
```

### 3. Configurar el Backend (`/server`)

1. Navegar a la carpeta del servidor:
   ```bash
   cd server
   npm install
   ```

2. Crear el archivo `.env` basado en las variables necesarias:
   ```env
   PORT=3000
   DATABASE_URL="postgresql://admin:admin123@localhost:5432/freelance_dev?schema=public"
   RESEND_API_KEY="re_tu_clave_aqui"
   EMAIL_USER="tu-correo@gmail.com"
   FRONTEND_URL="http://localhost:4321"
   ADMIN_API_KEY="tu_clave_secreta_local"
   ```

3. Levantar la base de datos local con Docker:
   ```bash
   docker-compose up -d
   ```

4. Ejecutar las migraciones de Prisma:
   ```bash
   npx prisma migrate dev
   ```

5. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
   *El servidor quedará corriendo en `http://localhost:3000`.*

---

### 4. Configurar el Frontend (`/client`)

1. En una nueva terminal, navegar a la carpeta del cliente:
   ```bash
   cd client
   npm install
   ```

2. Crear el archivo `.env`:
   ```env
   PUBLIC_API_URL="http://localhost:3000"
   PUBLIC_WHATSAPP_NUMERO="tu_numero_aqui"
   ```

3. Iniciar el servidor de desarrollo de Astro:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:4321`.*

---

## 🧪 Ejecución de Pruebas

### Pruebas de Backend (Jest & Supertest)
Desde la carpeta `/server`:
```bash
# Ejecutar todas las pruebas (seguridad, servicios, clientes, solicitudes)
npm test

# Ejecutar únicamente las pruebas de escudos de seguridad
npm test -- tests/seguridad.test.ts
```

### Pruebas de Frontend E2E (Playwright)
Desde la carpeta `/client`:
```bash
npm run test:e2e
```

---

## 📡 Endpoints de la API

| Método | Endpoint | Acceso | Descripción |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/solicitudes` | **Público** | Crea una nueva solicitud desde la web y envía email de alerta |
| `GET` | `/api/servicios` | **Público** | Lista los servicios activos |
| `GET` | `/api/solicitudes` | 🔒 **Admin** | Lista todas las solicitudes registradas (`x-api-key`) |
| `GET` | `/api/solicitudes/:id` | 🔒 **Admin** | Obtiene el detalle de una solicitud |
| `PATCH` | `/api/solicitudes/:id` | 🔒 **Admin** | Actualiza el estado de una solicitud |
| `DELETE`| `/api/solicitudes/:id` | 🔒 **Admin** | Elimina una solicitud |
| `GET` | `/api/clientes` | 🔒 **Admin** | Lista todos los clientes registrados |
| `POST` | `/api/servicios` | 🔒 **Admin** | Crea un nuevo servicio en el catálogo |

---

## 👨‍💻 Autor

**Eric Luna**  
Desarrollador de Software  

- **GitHub:** [@EricLuna97](https://github.com/EricLuna97)  
- **LinkedIn:** [linkedin.com/in/ericluna-dev](https://www.linkedin.com/in/ericluna-dev)  

---

## 📄 Licencia

Este proyecto se encuentra bajo la licencia [ISC](LICENSE).

