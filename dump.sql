
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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



