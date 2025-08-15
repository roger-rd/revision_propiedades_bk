CREATE TABLE observaciones (
    id SERIAL PRIMARY KEY,
    id_espacio INTEGER REFERENCES espacios(id),
    texto TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM fotos_observacion;
SELECT * FROM clientes;
SELECT * FROM espacios;
SELECT * FROM solicitudes;
SELECT * FROM empresas;
SELECT * FROM usuarios;
SELECT * FROM observaciones;

SELECT * FROM observaciones WHERE id = 65;
ALTER TABLE fotos_observacion RENAME COLUMN public_id TO id_public;


SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'observaciones';

ALTER TABLE observaciones
add column estado VARCHAR (20),
ADD column elemento VARCHAR (20);

CREATE TABLE fotos_observacion (
    id SERIAL PRIMARY KEY,
    id_observacion INTEGER REFERENCES observaciones(id),
    url_foto TEXT NOT NULL
);

ALTER TABLE usuarios
ADD COLUMN password VARCHAR(50)

CREATE TABLE empresas (
	id SERIAL PRIMARY KEY,
	nombre VARCHAR (20),
	rut VARCHAR (12),
	correo_contacto VARCHAR (50),
	telefono VARCHAR (20),
	logo_url TEXT,
	color_primario VARCHAR (20),
	color_segundario VARCHAR (20),
	estado  BOOLEAN DEFAULT true,
	creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios(
	id SERIAL PRIMARY KEY,
	nombre VARCHAR(20),
	correo VARCHAR(50),
	password TEXT NOT NULL,
	rol VARCHAR(20) DEFAULT 'admi', 
	id_empresa INTEGER REFERENCES empresas(id),
	creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre,correo,password,rol,id_empresa)
VALUES ('Mariant ','mariant@test.test','741258','admin',2);

INSERT INTO empresas (nombre,rut, correo_contacto, telefono, logo_url,color_primario,color_segundario)
VALUES ('mariantORG','19712458-3','mariant@testt.test','45678','rinoscopio','blue','red');



ALTER TABLE clientes
ADD COLUMN 	id_empresa INTEGER REFERENCES empresas(id);

INSERT INTO clientes( nombre,rut, correo, telefono, direccion, id_empresa)
VALUES ('marianrtd','19458-3','mariant@test.test','4567822','las brisas 123',1);
 
 select * from clientes;
 
 ALTER TABLE solicitudes
 ADD COLUMN id_empresa INTEGER REFERENCES empresas(id)

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

 select * from usuarios;
 
 ALTER TABLE clientes
 ADD COLUMN latitud DECIMAL(10,7),
 ADD COLUMN longitud DECIMAL(10,7)

SELECT * FROM solicitudes WHERE ID = 13;

select * from empresas
SELECT id, correo, password FROM usuarios LIMIT 5;

ALTER TABLE usuarios ADD COLUMN actualizado_en TIMESTAMP;

-- Empresa (¿existe id=1?)
SELECT id, nombre, logo_url, color_primario, color_segundario
FROM empresas
WHERE id = 1;

-- Usuario + empresa (¿rompe el JOIN o solo no hay usuario?)
SELECT 
  u.id, u.nombre, u.correo, u.rol, u.id_empresa, u.actualizado_en,
  e.nombre AS empresa_nombre, e.logo_url, e.color_primario, e.color_segundario
FROM usuarios u
JOIN empresas e ON u.id_empresa = e.id
WHERE u.id = 1;


-- Evitar citas solapadas por empresa + cliente + fecha + hora
CREATE UNIQUE INDEX IF NOT EXISTS uq_agenda_empresa_cliente_fecha_hora
ON agenda (id_empresa, id_cliente, fecha, hora);

-- Tabla para controlar envíos de recordatorios y no duplicarlos
CREATE TABLE IF NOT EXISTS agenda_recordatorios (
  id SERIAL PRIMARY KEY,
  agenda_id INTEGER NOT NULL REFERENCES agenda(id) ON DELETE CASCADE,
  tipo VARCHAR(32) NOT NULL,              -- 'hoy_8am' | 'previo_1h'
  enviado_en TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (agenda_id, tipo)
);

-- Índice útil para filtros por fecha
CREATE INDEX IF NOT EXISTS idx_agenda_fecha ON agenda (fecha);

ALTER TABLE empresas ADD COLUMN correo TEXT;

SELECT * FROM agenda;

-- tokens para reset (un solo uso, expira en 1h)
CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_password_resets_usuario ON password_resets(id_usuario);
CREATE INDEX IF NOT EXISTS ix_password_resets_expires ON password_resets(expires_at);

-- Tabla de uso por llamada (simple)
CREATE TABLE IF NOT EXISTS google_api_usage (
  id SERIAL PRIMARY KEY,
  api_name TEXT NOT NULL,                     -- 'places_autocomplete', 'place_details', 'geocoding', 'maps_js'
  endpoint TEXT,
  units INTEGER NOT NULL DEFAULT 1,           -- 1 llamada (o sesiones p/ Maps JS)
  date_used DATE NOT NULL DEFAULT CURRENT_DATE,
  meta JSONB,                                 -- opcional (ip, empresa, requestId, etc.)
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_google_api_usage_date_api ON google_api_usage(date_used, api_name);

SELECT * FROM google_api_usage
INSERT INTO google_api_usage (api_name, endpoint, units, meta)
VALUES ('maps_js', '/maps/api/js', 1, '{"empresa": "Test"}');

SELECT * FROM google_api_usage ORDER BY id DESC LIMIT 20;

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_expires TIMESTAMP;