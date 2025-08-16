--
-- PostgreSQL database dump
--

\restrict iv6eRLx6j1Zug3zAodMeG2LnQkb6hcYv0ngf0ouht3nkzwsNKOU5MhIroCmTvVe

-- Dumped from database version 15.3
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agenda; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agenda (
    id integer NOT NULL,
    id_empresa integer,
    id_cliente integer,
    direccion text NOT NULL,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    observacion text,
    estado character varying DEFAULT 'pendiente'::character varying,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: agenda_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agenda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agenda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agenda_id_seq OWNED BY public.agenda.id;


--
-- Name: agenda_recordatorios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.agenda_recordatorios (
    id integer NOT NULL,
    agenda_id integer NOT NULL,
    tipo character varying(32) NOT NULL,
    enviado_en timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: agenda_recordatorios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.agenda_recordatorios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: agenda_recordatorios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.agenda_recordatorios_id_seq OWNED BY public.agenda_recordatorios.id;


--
-- Name: clientes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clientes (
    id integer NOT NULL,
    nombre character varying(100),
    rut character varying(20),
    correo character varying(100),
    telefono character varying(20),
    direccion text,
    latitud double precision,
    longitud double precision,
    id_empresa integer,
    place_id text,
    numero_vivienda character varying(15)
);


--
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- Name: empresas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.empresas (
    id integer NOT NULL,
    nombre character varying(100),
    logo_url text,
    color_primario character varying(20),
    color_segundario character varying(20),
    correo text
);


--
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.empresas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.empresas_id_seq OWNED BY public.empresas.id;


--
-- Name: espacios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.espacios (
    id integer NOT NULL,
    id_solicitud integer,
    nombre character varying(100)
);


--
-- Name: espacios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.espacios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: espacios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.espacios_id_seq OWNED BY public.espacios.id;


--
-- Name: fotos_observacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fotos_observacion (
    id integer NOT NULL,
    id_observacion integer,
    url_foto text,
    id_public text,
    id_empresa integer
);


--
-- Name: fotos_observacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fotos_observacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fotos_observacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fotos_observacion_id_seq OWNED BY public.fotos_observacion.id;


--
-- Name: google_api_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.google_api_usage (
    id integer NOT NULL,
    api_name text NOT NULL,
    endpoint text,
    units integer DEFAULT 1 NOT NULL,
    date_used date DEFAULT CURRENT_DATE NOT NULL,
    meta jsonb,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: google_api_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.google_api_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: google_api_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.google_api_usage_id_seq OWNED BY public.google_api_usage.id;


--
-- Name: observaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.observaciones (
    id integer NOT NULL,
    id_espacio integer,
    descripcion text,
    estado character varying(20),
    elemento character varying(100)
);


--
-- Name: observaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.observaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: observaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.observaciones_id_seq OWNED BY public.observaciones.id;


--
-- Name: password_resets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_resets (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    token character varying(128) NOT NULL,
    requested_at timestamp without time zone DEFAULT now() NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL
);


--
-- Name: password_resets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.password_resets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: password_resets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.password_resets_id_seq OWNED BY public.password_resets.id;


--
-- Name: solicitudes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.solicitudes (
    id integer NOT NULL,
    id_cliente integer,
    direccion text,
    tamano character varying(50),
    inmobiliaria character varying(100),
    tipo_propiedad character varying(50),
    tipo_inspeccion character varying(50),
    estado character varying(20),
    fecha_solicitud timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_empresa integer
);


--
-- Name: solicitudes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.solicitudes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: solicitudes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.solicitudes_id_seq OWNED BY public.solicitudes.id;


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100),
    correo character varying(100),
    password character varying(100),
    rol character varying(20),
    id_empresa integer,
    actualizado_en timestamp without time zone,
    reset_token text,
    reset_expires timestamp without time zone
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: agenda id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda ALTER COLUMN id SET DEFAULT nextval('public.agenda_id_seq'::regclass);


--
-- Name: agenda_recordatorios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_recordatorios ALTER COLUMN id SET DEFAULT nextval('public.agenda_recordatorios_id_seq'::regclass);


--
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- Name: empresas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id SET DEFAULT nextval('public.empresas_id_seq'::regclass);


--
-- Name: espacios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.espacios ALTER COLUMN id SET DEFAULT nextval('public.espacios_id_seq'::regclass);


--
-- Name: fotos_observacion id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fotos_observacion ALTER COLUMN id SET DEFAULT nextval('public.fotos_observacion_id_seq'::regclass);


--
-- Name: google_api_usage id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_api_usage ALTER COLUMN id SET DEFAULT nextval('public.google_api_usage_id_seq'::regclass);


--
-- Name: observaciones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observaciones ALTER COLUMN id SET DEFAULT nextval('public.observaciones_id_seq'::regclass);


--
-- Name: password_resets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_resets ALTER COLUMN id SET DEFAULT nextval('public.password_resets_id_seq'::regclass);


--
-- Name: solicitudes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes ALTER COLUMN id SET DEFAULT nextval('public.solicitudes_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: agenda; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agenda (id, id_empresa, id_cliente, direccion, fecha, hora, observacion, estado, creado_en) FROM stdin;
14	1	26	San Isidro 234, Santiago, Región Metropolitana, Chile	2025-08-14	15:00:00		pendiente	2025-08-13 20:17:47.61057
\.


--
-- Data for Name: agenda_recordatorios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.agenda_recordatorios (id, agenda_id, tipo, enviado_en) FROM stdin;
\.


--
-- Data for Name: clientes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clientes (id, nombre, rut, correo, telefono, direccion, latitud, longitud, id_empresa, place_id, numero_vivienda) FROM stdin;
13	edgar torres	26712147-8	ede@toore.cl	923734506	Campeche 196, Santa Cruz, O'Higgins, Chile	-34.6438117	-71.36726050000001	1	ChIJhYmPeU9lZJYRLop6AbEN_AM	196
26	Roger Rodriguez	26712419-1	rogerdavid.rd@gmail.com	977979094	San Isidro 234, Santiago, Región Metropolitana, Chile	-33.446388299999995	-70.6433468	1	ChIJX2KpFnXFYpYRkDzYPO6onOg	casa 8
\.


--
-- Data for Name: empresas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.empresas (id, nombre, logo_url, color_primario, color_segundario, correo) FROM stdin;
2	MRPR S.A.	\N	\N	\N	\N
1	RDRP S.A	https://res.cloudinary.com/revisioncasa/image/upload/v1755042032/revision-casa/logos/empresa_1/logo_empresa_1.png	#065074	#21b575	\N
3	ajrojas	\N	#16bb1e	#425238	\N
\.


--
-- Data for Name: espacios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.espacios (id, id_solicitud, nombre) FROM stdin;
5	13	entrada
7	13	Baño
9	15	Cocina
10	15	Baño
12	13	cuarto
6	13	sala
18	15	Sala
\.


--
-- Data for Name: fotos_observacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fotos_observacion (id, id_observacion, url_foto, id_public, id_empresa) FROM stdin;
6	7	https://res.cloudinary.com/revisioncasa/image/upload/v1754537790/revision-casa/observaciones/empresa_sin_empresa/za2dwhm48wk3s52gh9xq.png	revision-casa/observaciones/empresa_sin_empresa/za2dwhm48wk3s52gh9xq	\N
7	7	https://res.cloudinary.com/revisioncasa/image/upload/v1754537802/revision-casa/observaciones/empresa_sin_empresa/ayb5wpd4nhn7ebyivezo.png	revision-casa/observaciones/empresa_sin_empresa/ayb5wpd4nhn7ebyivezo	\N
11	10	https://res.cloudinary.com/revisioncasa/image/upload/v1754687783/revision-casa/observaciones/empresa_sin_empresa/ikwlofq0jubqdqlaiknn.png	revision-casa/observaciones/empresa_sin_empresa/ikwlofq0jubqdqlaiknn	\N
12	11	https://res.cloudinary.com/revisioncasa/image/upload/v1754687823/revision-casa/observaciones/empresa_sin_empresa/spqrtuhfxtre5stuhh7k.png	revision-casa/observaciones/empresa_sin_empresa/spqrtuhfxtre5stuhh7k	\N
15	20	https://res.cloudinary.com/revisioncasa/image/upload/v1755368388/revision-casa/observaciones/empresa_sin_empresa/bqzj2yenqjkaxsfgrohy.png	revision-casa/observaciones/empresa_sin_empresa/bqzj2yenqjkaxsfgrohy	\N
16	20	https://res.cloudinary.com/revisioncasa/image/upload/v1755368410/revision-casa/observaciones/empresa_sin_empresa/qazkfd4qvstoluwjaqt6.png	revision-casa/observaciones/empresa_sin_empresa/qazkfd4qvstoluwjaqt6	\N
17	21	https://res.cloudinary.com/revisioncasa/image/upload/v1755368455/revision-casa/observaciones/empresa_sin_empresa/tadzhrtt2vq3hm3udyft.png	revision-casa/observaciones/empresa_sin_empresa/tadzhrtt2vq3hm3udyft	\N
18	21	https://res.cloudinary.com/revisioncasa/image/upload/v1755368469/revision-casa/observaciones/empresa_sin_empresa/s2smlv8a0vtn0xbek25t.png	revision-casa/observaciones/empresa_sin_empresa/s2smlv8a0vtn0xbek25t	\N
\.


--
-- Data for Name: google_api_usage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.google_api_usage (id, api_name, endpoint, units, date_used, meta, created_at) FROM stdin;
1	maps_js	/maps/api/js	1	2025-08-14	{"empresa": "Test"}	2025-08-14 22:48:40.849068
2	maps_js	/maps/api/js	1	2025-08-14	{"empresa": "Demo"}	2025-08-14 23:03:30.743397
3	maps_js	/maps/api/js	1	2025-08-14	{"empresa": "Demo"}	2025-08-14 23:03:48.23429
4	places_autocomplete	/places:autocomplete	1	2025-08-14	{"ip": "::1", "sessionToken": "st_hki6jobmrmeca1ye5"}	2025-08-14 23:37:27.370323
5	places_autocomplete	/places:autocomplete	1	2025-08-14	{"ip": "::1", "sessionToken": "st_hki6jobmrmeca1ye5"}	2025-08-14 23:37:27.544859
6	places_autocomplete	/places:autocomplete	1	2025-08-14	{"ip": "::1", "sessionToken": "st_hki6jobmrmeca1ye5"}	2025-08-14 23:37:29.309979
7	place_details	/places/{placeId}	1	2025-08-14	{"ip": "::1", "sessionToken": "st_hki6jobmrmeca1ye5"}	2025-08-14 23:37:30.479541
8	places_autocomplete	/places:autocomplete	1	2025-08-14	{"ip": "::1", "sessionToken": "st_y90ewcx0sp9meca235o"}	2025-08-14 23:37:31.32143
9	places_autocomplete	/places:autocomplete	1	2025-08-15	{"ip": "::1", "sessionToken": "st_n148x84en2mecb407k"}	2025-08-15 00:07:01.279152
10	places_autocomplete	/places:autocomplete	1	2025-08-15	{"ip": "::1", "sessionToken": "st_n148x84en2mecb407k"}	2025-08-15 00:07:02.792753
11	places_autocomplete	/places:autocomplete	1	2025-08-15	{"ip": "::1", "sessionToken": "st_n148x84en2mecb407k"}	2025-08-15 00:07:04.377876
12	places_autocomplete	/places:autocomplete	1	2025-08-15	{"ip": "::1", "sessionToken": "st_n148x84en2mecb407k"}	2025-08-15 00:07:13.106271
13	places_autocomplete	/places:autocomplete	1	2025-08-15	{"ip": "::1", "sessionToken": "st_n148x84en2mecb407k"}	2025-08-15 00:07:16.381955
14	place_details	/places/{placeId}	1	2025-08-15	{"ip": "::1", "sessionToken": "st_n148x84en2mecb407k"}	2025-08-15 00:07:17.542827
15	places_autocomplete	/places:autocomplete	1	2025-08-15	{"ip": "::1", "sessionToken": "st_zbkrxueqtgmecb4e2n"}	2025-08-15 00:07:18.397129
16	places_autocomplete	/api/autocomplete	1	2025-08-15	{"ip": "::1", "input_len": 7}	2025-08-15 00:16:15.880639
17	places_autocomplete	/api/autocomplete	1	2025-08-15	{"ip": "::1", "input_len": 14}	2025-08-15 00:16:23.092773
18	place_details	/places/{placeId}	1	2025-08-15	{"ip": "::1", "sessionToken": "st_h3yulmt3mwwmecbfw11"}	2025-08-15 00:16:24.591133
19	places_autocomplete	/api/autocomplete	1	2025-08-15	{"ip": "::1", "input_len": 53}	2025-08-15 00:16:25.448573
20	places_autocomplete	/api/autocomplete	1	2025-08-15	{"ip": "::1", "input_len": 10}	2025-08-15 00:17:49.894592
21	place_details	/api/place-details	1	2025-08-15	{"ip": "::1", "placeId": "ChIJX2KpFnXFYpYRkDzYPO6onOg"}	2025-08-15 00:17:52.126022
\.


--
-- Data for Name: observaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.observaciones (id, id_espacio, descripcion, estado, elemento) FROM stdin;
7	7	quebrado	pendiente	Inodoro
10	9	rayadura	pendiente	la campana
11	10	quebrado	realizado	lavamano
16	6	e3e3e3e3	realizado	e333e3e
20	9	fuga de agua	pendiente	lavaplatos
21	18	baldosas levantadas	pendiente	piso
\.


--
-- Data for Name: password_resets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_resets (id, id_usuario, token, requested_at, expires_at, used) FROM stdin;
1	1	8b3b7a910b44a0e44eb98f526e6ea560926c0df23e4fa74ae5e9f21235dc921e	2025-08-16 09:27:14.182439	2025-08-16 10:27:14.182	t
2	1	89d295d599441f8588945d901c89509b10795e7aba5333fcdc9058bf32576a3f	2025-08-16 09:49:20.076714	2025-08-16 10:19:20.076	t
\.


--
-- Data for Name: solicitudes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.solicitudes (id, id_cliente, direccion, tamano, inmobiliaria, tipo_propiedad, tipo_inspeccion, estado, fecha_solicitud, id_empresa) FROM stdin;
15	26	San Isidro 234, Santiago, Región Metropolitana, Chile	365 mt2	pj	Casa	Entrega	Pendiente	2025-08-08 17:15:23.038174	1
13	13	Campeche 196, Santa Cruz, O'Higgins, Chile	250	Inmobiliaria X	Casa	Entrega	persiste	2025-07-05 20:06:12.296759	1
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, nombre, correo, password, rol, id_empresa, actualizado_en, reset_token, reset_expires) FROM stdin;
2	Mariant	admin@MRPR.cl	$2b$10$OvQCX410L.7h6v2MHWEheO5BRSu7rHkmwNJAvAFKuXNZ/Fk563HA.	admin	2	\N	\N	\N
1	Admin	rogerdavid.rd@gmail.com	$2b$10$GOBHAg7PfhCuB9o0ZiB8reGjTTNEXg5wp/fYyLS6.683kAVVCieom	admin	1	2025-08-16 12:37:09.540092	\N	\N
4	jose david	rokipire@gmail.com	$2b$10$BP7uD7yzUb/XINjJaGZ/9ufj.JWHq5hHqre7DZJewsKPa/RzGeuJm	admin	3	2025-08-16 12:48:26.11209	\N	\N
\.


--
-- Name: agenda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agenda_id_seq', 14, true);


--
-- Name: agenda_recordatorios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agenda_recordatorios_id_seq', 1, false);


--
-- Name: clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clientes_id_seq', 29, true);


--
-- Name: empresas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.empresas_id_seq', 3, true);


--
-- Name: espacios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.espacios_id_seq', 18, true);


--
-- Name: fotos_observacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fotos_observacion_id_seq', 18, true);


--
-- Name: google_api_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.google_api_usage_id_seq', 21, true);


--
-- Name: observaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.observaciones_id_seq', 21, true);


--
-- Name: password_resets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.password_resets_id_seq', 3, true);


--
-- Name: solicitudes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.solicitudes_id_seq', 20, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 4, true);


--
-- Name: agenda agenda_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_pkey PRIMARY KEY (id);


--
-- Name: agenda_recordatorios agenda_recordatorios_agenda_id_tipo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_recordatorios
    ADD CONSTRAINT agenda_recordatorios_agenda_id_tipo_key UNIQUE (agenda_id, tipo);


--
-- Name: agenda_recordatorios agenda_recordatorios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_recordatorios
    ADD CONSTRAINT agenda_recordatorios_pkey PRIMARY KEY (id);


--
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- Name: espacios espacios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.espacios
    ADD CONSTRAINT espacios_pkey PRIMARY KEY (id);


--
-- Name: fotos_observacion fotos_observacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fotos_observacion
    ADD CONSTRAINT fotos_observacion_pkey PRIMARY KEY (id);


--
-- Name: google_api_usage google_api_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.google_api_usage
    ADD CONSTRAINT google_api_usage_pkey PRIMARY KEY (id);


--
-- Name: observaciones observaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observaciones
    ADD CONSTRAINT observaciones_pkey PRIMARY KEY (id);


--
-- Name: password_resets password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- Name: password_resets password_resets_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_token_key UNIQUE (token);


--
-- Name: solicitudes solicitudes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_agenda_fecha; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_agenda_fecha ON public.agenda USING btree (fecha);


--
-- Name: idx_password_resets_token; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_resets_token ON public.password_resets USING btree (token);


--
-- Name: idx_password_resets_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_resets_user ON public.password_resets USING btree (id_usuario);


--
-- Name: ix_google_api_usage_date_api; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_google_api_usage_date_api ON public.google_api_usage USING btree (date_used, api_name);


--
-- Name: uq_agenda_empresa_cliente_fecha_hora; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_agenda_empresa_cliente_fecha_hora ON public.agenda USING btree (id_empresa, id_cliente, fecha, hora);


--
-- Name: agenda agenda_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);


--
-- Name: agenda agenda_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- Name: agenda_recordatorios agenda_recordatorios_agenda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.agenda_recordatorios
    ADD CONSTRAINT agenda_recordatorios_agenda_id_fkey FOREIGN KEY (agenda_id) REFERENCES public.agenda(id) ON DELETE CASCADE;


--
-- Name: clientes clientes_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- Name: espacios espacios_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.espacios
    ADD CONSTRAINT espacios_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES public.solicitudes(id);


--
-- Name: fotos_observacion fotos_observacion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fotos_observacion
    ADD CONSTRAINT fotos_observacion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- Name: fotos_observacion fotos_observacion_id_observacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fotos_observacion
    ADD CONSTRAINT fotos_observacion_id_observacion_fkey FOREIGN KEY (id_observacion) REFERENCES public.observaciones(id);


--
-- Name: observaciones observaciones_id_espacio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.observaciones
    ADD CONSTRAINT observaciones_id_espacio_fkey FOREIGN KEY (id_espacio) REFERENCES public.espacios(id);


--
-- Name: password_resets password_resets_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: solicitudes solicitudes_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- Name: solicitudes solicitudes_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- Name: usuarios usuarios_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- PostgreSQL database dump complete
--

\unrestrict iv6eRLx6j1Zug3zAodMeG2LnQkb6hcYv0ngf0ouht3nkzwsNKOU5MhIroCmTvVe

