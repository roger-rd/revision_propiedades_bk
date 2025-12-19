--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2025-12-18 21:27:41 -03

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

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

--CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3701 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 229 (class 1259 OID 20909)
-- Name: agenda; Type: TABLE; Schema: public; Owner: postgres
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
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_usuario integer
);


ALTER TABLE public.agenda OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 20908)
-- Name: agenda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agenda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.agenda_id_seq OWNER TO postgres;

--
-- TOC entry 3702 (class 0 OID 0)
-- Dependencies: 228
-- Name: agenda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agenda_id_seq OWNED BY public.agenda.id;


--
-- TOC entry 231 (class 1259 OID 20937)
-- Name: agenda_recordatorios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agenda_recordatorios (
    id integer NOT NULL,
    agenda_id integer NOT NULL,
    tipo character varying(32) NOT NULL,
    enviado_en timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.agenda_recordatorios OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 20936)
-- Name: agenda_recordatorios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agenda_recordatorios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.agenda_recordatorios_id_seq OWNER TO postgres;

--
-- TOC entry 3703 (class 0 OID 0)
-- Dependencies: 230
-- Name: agenda_recordatorios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agenda_recordatorios_id_seq OWNED BY public.agenda_recordatorios.id;


--
-- TOC entry 219 (class 1259 OID 20830)
-- Name: clientes; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.clientes OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 20829)
-- Name: clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clientes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.clientes_id_seq OWNER TO postgres;

--
-- TOC entry 3704 (class 0 OID 0)
-- Dependencies: 218
-- Name: clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clientes_id_seq OWNED BY public.clientes.id;


--
-- TOC entry 215 (class 1259 OID 20809)
-- Name: empresas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresas (
    id integer NOT NULL,
    nombre character varying(100),
    logo_url text,
    color_primario character varying(20),
    color_segundario character varying(20),
    correo text
);


ALTER TABLE public.empresas OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 20808)
-- Name: empresas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.empresas_id_seq OWNER TO postgres;

--
-- TOC entry 3705 (class 0 OID 0)
-- Dependencies: 214
-- Name: empresas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_id_seq OWNED BY public.empresas.id;


--
-- TOC entry 223 (class 1259 OID 20864)
-- Name: espacios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.espacios (
    id integer NOT NULL,
    id_solicitud integer,
    nombre character varying(100)
);


ALTER TABLE public.espacios OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 20863)
-- Name: espacios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.espacios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.espacios_id_seq OWNER TO postgres;

--
-- TOC entry 3706 (class 0 OID 0)
-- Dependencies: 222
-- Name: espacios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.espacios_id_seq OWNED BY public.espacios.id;


--
-- TOC entry 227 (class 1259 OID 20890)
-- Name: fotos_observacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fotos_observacion (
    id integer NOT NULL,
    id_observacion integer,
    url_foto text,
    id_public text,
    id_empresa integer
);


ALTER TABLE public.fotos_observacion OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 20889)
-- Name: fotos_observacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fotos_observacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.fotos_observacion_id_seq OWNER TO postgres;

--
-- TOC entry 3707 (class 0 OID 0)
-- Dependencies: 226
-- Name: fotos_observacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fotos_observacion_id_seq OWNED BY public.fotos_observacion.id;


--
-- TOC entry 233 (class 1259 OID 21001)
-- Name: google_api_usage; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.google_api_usage OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 21000)
-- Name: google_api_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.google_api_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.google_api_usage_id_seq OWNER TO postgres;

--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 232
-- Name: google_api_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.google_api_usage_id_seq OWNED BY public.google_api_usage.id;


--
-- TOC entry 225 (class 1259 OID 20876)
-- Name: observaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones (
    id integer NOT NULL,
    id_espacio integer,
    descripcion text,
    estado character varying(20),
    elemento character varying(100)
);


ALTER TABLE public.observaciones OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 20875)
-- Name: observaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.observaciones_id_seq OWNER TO postgres;

--
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 224
-- Name: observaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observaciones_id_seq OWNED BY public.observaciones.id;


--
-- TOC entry 235 (class 1259 OID 21018)
-- Name: password_resets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_resets (
    id integer NOT NULL,
    id_usuario integer NOT NULL,
    token character varying(128) NOT NULL,
    requested_at timestamp without time zone DEFAULT now() NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL
);


ALTER TABLE public.password_resets OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 21017)
-- Name: password_resets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_resets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.password_resets_id_seq OWNER TO postgres;

--
-- TOC entry 3710 (class 0 OID 0)
-- Dependencies: 234
-- Name: password_resets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_resets_id_seq OWNED BY public.password_resets.id;


--
-- TOC entry 221 (class 1259 OID 20844)
-- Name: solicitudes; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.solicitudes OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 20843)
-- Name: solicitudes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitudes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.solicitudes_id_seq OWNER TO postgres;

--
-- TOC entry 3711 (class 0 OID 0)
-- Dependencies: 220
-- Name: solicitudes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitudes_id_seq OWNED BY public.solicitudes.id;


--
-- TOC entry 217 (class 1259 OID 20818)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 20817)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 3712 (class 0 OID 0)
-- Dependencies: 216
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 3497 (class 2604 OID 20912)
-- Name: agenda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda ALTER COLUMN id SET DEFAULT nextval('public.agenda_id_seq'::regclass);


--
-- TOC entry 3500 (class 2604 OID 20940)
-- Name: agenda_recordatorios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda_recordatorios ALTER COLUMN id SET DEFAULT nextval('public.agenda_recordatorios_id_seq'::regclass);


--
-- TOC entry 3491 (class 2604 OID 20833)
-- Name: clientes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes ALTER COLUMN id SET DEFAULT nextval('public.clientes_id_seq'::regclass);


--
-- TOC entry 3489 (class 2604 OID 20812)
-- Name: empresas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas ALTER COLUMN id SET DEFAULT nextval('public.empresas_id_seq'::regclass);


--
-- TOC entry 3494 (class 2604 OID 20867)
-- Name: espacios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios ALTER COLUMN id SET DEFAULT nextval('public.espacios_id_seq'::regclass);


--
-- TOC entry 3496 (class 2604 OID 20893)
-- Name: fotos_observacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_observacion ALTER COLUMN id SET DEFAULT nextval('public.fotos_observacion_id_seq'::regclass);


--
-- TOC entry 3502 (class 2604 OID 21004)
-- Name: google_api_usage id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.google_api_usage ALTER COLUMN id SET DEFAULT nextval('public.google_api_usage_id_seq'::regclass);


--
-- TOC entry 3495 (class 2604 OID 20879)
-- Name: observaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones ALTER COLUMN id SET DEFAULT nextval('public.observaciones_id_seq'::regclass);


--
-- TOC entry 3506 (class 2604 OID 21021)
-- Name: password_resets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets ALTER COLUMN id SET DEFAULT nextval('public.password_resets_id_seq'::regclass);


--
-- TOC entry 3492 (class 2604 OID 20847)
-- Name: solicitudes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes ALTER COLUMN id SET DEFAULT nextval('public.solicitudes_id_seq'::regclass);


--
-- TOC entry 3490 (class 2604 OID 20821)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 3524 (class 2606 OID 20918)
-- Name: agenda agenda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_pkey PRIMARY KEY (id);


--
-- TOC entry 3529 (class 2606 OID 20945)
-- Name: agenda_recordatorios agenda_recordatorios_agenda_id_tipo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda_recordatorios
    ADD CONSTRAINT agenda_recordatorios_agenda_id_tipo_key UNIQUE (agenda_id, tipo);


--
-- TOC entry 3531 (class 2606 OID 20943)
-- Name: agenda_recordatorios agenda_recordatorios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda_recordatorios
    ADD CONSTRAINT agenda_recordatorios_pkey PRIMARY KEY (id);


--
-- TOC entry 3514 (class 2606 OID 20837)
-- Name: clientes clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_pkey PRIMARY KEY (id);


--
-- TOC entry 3510 (class 2606 OID 20816)
-- Name: empresas empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresas
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id);


--
-- TOC entry 3518 (class 2606 OID 20869)
-- Name: espacios espacios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios
    ADD CONSTRAINT espacios_pkey PRIMARY KEY (id);


--
-- TOC entry 3522 (class 2606 OID 20897)
-- Name: fotos_observacion fotos_observacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_observacion
    ADD CONSTRAINT fotos_observacion_pkey PRIMARY KEY (id);


--
-- TOC entry 3533 (class 2606 OID 21011)
-- Name: google_api_usage google_api_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.google_api_usage
    ADD CONSTRAINT google_api_usage_pkey PRIMARY KEY (id);


--
-- TOC entry 3520 (class 2606 OID 20883)
-- Name: observaciones observaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones
    ADD CONSTRAINT observaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 3538 (class 2606 OID 21025)
-- Name: password_resets password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- TOC entry 3540 (class 2606 OID 21027)
-- Name: password_resets password_resets_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_token_key UNIQUE (token);


--
-- TOC entry 3516 (class 2606 OID 20852)
-- Name: solicitudes solicitudes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_pkey PRIMARY KEY (id);


--
-- TOC entry 3512 (class 2606 OID 20823)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 3525 (class 1259 OID 20951)
-- Name: idx_agenda_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agenda_fecha ON public.agenda USING btree (fecha);


--
-- TOC entry 3526 (class 1259 OID 21040)
-- Name: idx_agenda_id_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_agenda_id_usuario ON public.agenda USING btree (id_usuario);


--
-- TOC entry 3535 (class 1259 OID 21033)
-- Name: idx_password_resets_token; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_resets_token ON public.password_resets USING btree (token);


--
-- TOC entry 3536 (class 1259 OID 21034)
-- Name: idx_password_resets_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_password_resets_user ON public.password_resets USING btree (id_usuario);


--
-- TOC entry 3534 (class 1259 OID 21012)
-- Name: ix_google_api_usage_date_api; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_google_api_usage_date_api ON public.google_api_usage USING btree (date_used, api_name);


--
-- TOC entry 3527 (class 1259 OID 20935)
-- Name: uq_agenda_empresa_cliente_fecha_hora; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_agenda_empresa_cliente_fecha_hora ON public.agenda USING btree (id_empresa, id_cliente, fecha, hora);


--
-- TOC entry 3549 (class 2606 OID 20924)
-- Name: agenda agenda_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.clientes(id);


--
-- TOC entry 3550 (class 2606 OID 20919)
-- Name: agenda agenda_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT agenda_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- TOC entry 3552 (class 2606 OID 20946)
-- Name: agenda_recordatorios agenda_recordatorios_agenda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda_recordatorios
    ADD CONSTRAINT agenda_recordatorios_agenda_id_fkey FOREIGN KEY (agenda_id) REFERENCES public.agenda(id) ON DELETE CASCADE;


--
-- TOC entry 3542 (class 2606 OID 20838)
-- Name: clientes clientes_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clientes
    ADD CONSTRAINT clientes_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- TOC entry 3545 (class 2606 OID 20870)
-- Name: espacios espacios_id_solicitud_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.espacios
    ADD CONSTRAINT espacios_id_solicitud_fkey FOREIGN KEY (id_solicitud) REFERENCES public.solicitudes(id);


--
-- TOC entry 3551 (class 2606 OID 21035)
-- Name: agenda fk_agenda_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agenda
    ADD CONSTRAINT fk_agenda_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 3547 (class 2606 OID 20903)
-- Name: fotos_observacion fotos_observacion_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_observacion
    ADD CONSTRAINT fotos_observacion_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- TOC entry 3548 (class 2606 OID 20898)
-- Name: fotos_observacion fotos_observacion_id_observacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotos_observacion
    ADD CONSTRAINT fotos_observacion_id_observacion_fkey FOREIGN KEY (id_observacion) REFERENCES public.observaciones(id);


--
-- TOC entry 3546 (class 2606 OID 20884)
-- Name: observaciones observaciones_id_espacio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones
    ADD CONSTRAINT observaciones_id_espacio_fkey FOREIGN KEY (id_espacio) REFERENCES public.espacios(id);


--
-- TOC entry 3553 (class 2606 OID 21028)
-- Name: password_resets password_resets_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 3543 (class 2606 OID 20930)
-- Name: solicitudes solicitudes_id_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_id_cliente_fkey FOREIGN KEY (id_cliente) REFERENCES public.clientes(id) ON DELETE CASCADE;


--
-- TOC entry 3544 (class 2606 OID 20858)
-- Name: solicitudes solicitudes_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


--
-- TOC entry 3541 (class 2606 OID 20824)
-- Name: usuarios usuarios_id_empresa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_empresa_fkey FOREIGN KEY (id_empresa) REFERENCES public.empresas(id);


-- Completed on 2025-12-18 21:27:41 -03

--
-- PostgreSQL database dump complete
--

