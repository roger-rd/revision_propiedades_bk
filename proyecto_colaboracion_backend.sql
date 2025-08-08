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

 select * from agenda;
 
 ALTER TABLE clientes
 ADD COLUMN latitud DECIMAL(10,7),
 ADD COLUMN longitud DECIMAL(10,7)

SELECT * FROM solicitudes WHERE ID = 13;

select * from observaciones