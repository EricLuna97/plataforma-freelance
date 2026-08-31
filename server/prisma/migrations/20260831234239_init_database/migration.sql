-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id_servicio" TEXT NOT NULL,
    "nombre_comercial" TEXT NOT NULL,
    "precio" DECIMAL(65,30),
    "modelo_cobro" TEXT NOT NULL,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "caracteristicas_servicio" (
    "id_caracteristica" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "orden_visual" INTEGER,
    "id_servicio" TEXT NOT NULL,

    CONSTRAINT "caracteristicas_servicio_pkey" PRIMARY KEY ("id_caracteristica")
);

-- CreateTable
CREATE TABLE "solicitudes" (
    "id_solicitud" TEXT NOT NULL,
    "fecha_solicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mensaje_adicional" TEXT,
    "estado" TEXT NOT NULL,
    "id_cliente" TEXT NOT NULL,
    "id_servicio" TEXT NOT NULL,

    CONSTRAINT "solicitudes_pkey" PRIMARY KEY ("id_solicitud")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- AddForeignKey
ALTER TABLE "caracteristicas_servicio" ADD CONSTRAINT "caracteristicas_servicio_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitudes" ADD CONSTRAINT "solicitudes_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;
