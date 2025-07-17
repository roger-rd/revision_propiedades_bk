-- ⚠️ Desactiva temporalmente las restricciones de clave externa
SET session_replication_role = replica;

-- 🧹 Borra todas las tablas en orden adecuado (dependencias primero)
DROP TABLE IF EXISTS fotos_observacion CASCADE;
DROP TABLE IF EXISTS observaciones CASCADE;
DROP TABLE IF EXISTS espacios CASCADE;
DROP TABLE IF EXISTS solicitudes CASCADE;
DROP TABLE IF EXISTS agenda CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS empresas CASCADE;


-- ✅ Vuelve a activar las restricciones
SET session_replication_role = DEFAULT;

CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  logo_url TEXT,
  color_primario VARCHAR(20),
  color_segundario VARCHAR(20)
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  correo VARCHAR(100),
  password VARCHAR(100),
  rol VARCHAR(20),
  id_empresa INTEGER REFERENCES empresas(id)
);

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  rut VARCHAR(20),
  correo VARCHAR(100),
  telefono VARCHAR(20),
  direccion TEXT,
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  place_id TEXT,
  id_empresa INTEGER REFERENCES empresas(id)
);

CREATE TABLE solicitudes (
  id SERIAL PRIMARY KEY,
  id_cliente INTEGER REFERENCES clientes(id),
  direccion TEXT,
  tamano VARCHAR(50),
  inmobiliaria VARCHAR(100),
  tipo_propiedad VARCHAR(50),
  tipo_inspeccion VARCHAR(50),
  estado VARCHAR(20),
  fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_empresa INTEGER REFERENCES empresas(id)
);

CREATE TABLE espacios (
  id SERIAL PRIMARY KEY,
  id_solicitud INTEGER REFERENCES solicitudes(id),
  nombre VARCHAR(100)
);

CREATE TABLE observaciones (
  id SERIAL PRIMARY KEY,
  id_espacio INTEGER REFERENCES espacios(id),
  descripcion TEXT,
  estado VARCHAR(20),
  elemento VARCHAR(100)
);

CREATE TABLE fotos_observacion (
  id SERIAL PRIMARY KEY,
  id_observacion INTEGER REFERENCES observaciones(id),
  url_foto TEXT,
  id_public TEXT,
  id_empresa INTEGER REFERENCES empresas(id)
);

CREATE TABLE agenda (
	id SERIAL PRIMARY KEY,
	id_empresa INTEGER REFERENCES empresas(id),
	id_cliente INTEGER REFERENCES clientes(id),
	direccion TEXT NOT NULL,
	fecha DATE NOT NULL,
	hora TIME NOT NULL,
	observacion TEXT,
	estado VARCHAR DEFAULT 'pendiente',
	creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO empresas (nombre) VALUES ('RDRP S.A.');
INSERT INTO empresas (nombre) VALUES ('MRPR S.A.');
SELECT * FROM empresas;

INSERT INTO usuarios (nombre, correo, password, rol, id_empresa)
VALUES ('Admin', 'admin@rdrp.cl', '1234', 'admin', 1);

INSERT INTO usuarios (nombre, correo, password, rol, id_empresa)
VALUES ('Mariant', 'admin@MRPR.cl', '1234', 'admin', 2);

SELECT * FROM usuarios;
SELECT * FROM clientes;


ALTER TABLE solicitudes
DROP CONSTRAINT solicitudes_id_cliente_fkey;

ALTER TABLE solicitudes
ADD CONSTRAINT solicitudes_id_cliente_fkey
FOREIGN KEY (id_cliente)
REFERENCES clientes(id)
ON DELETE CASCADE;

ALTER TABLE clientes ADD COLUMN numero_vivienda VARCHAR(15);
