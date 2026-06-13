--
-- PostgreSQL database dump
--

\restrict fYI9VT3G7QkhJ3Aa0812tb2jqe5jLmW5PTxP99weQN1SXfyINyQ4Ow3maNYgNAP

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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

--
-- Name: merma_motivo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.merma_motivo_enum AS ENUM (
    'vencimiento',
    'derrame',
    'error_preparacion',
    'otro'
);


ALTER TYPE public.merma_motivo_enum OWNER TO postgres;

--
-- Name: mesa_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.mesa_estado_enum AS ENUM (
    'disponible',
    'ocupada',
    'reservada',
    'inactiva'
);


ALTER TYPE public.mesa_estado_enum OWNER TO postgres;

--
-- Name: pago_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.pago_estado_enum AS ENUM (
    'pendiente',
    'pagado',
    'anulado'
);


ALTER TYPE public.pago_estado_enum OWNER TO postgres;

--
-- Name: pago_metodo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.pago_metodo_enum AS ENUM (
    'efectivo',
    'tarjeta',
    'transferencia'
);


ALTER TYPE public.pago_metodo_enum OWNER TO postgres;

--
-- Name: pedido_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.pedido_estado_enum AS ENUM (
    'pendiente',
    'en_preparacion',
    'listo',
    'entregado',
    'cancelado'
);


ALTER TYPE public.pedido_estado_enum OWNER TO postgres;

--
-- Name: rol_nombre_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rol_nombre_enum AS ENUM (
    'admin',
    'mesero',
    'cocina',
    'caja'
);


ALTER TYPE public.rol_nombre_enum OWNER TO postgres;

--
-- Name: unidad_medida_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.unidad_medida_enum AS ENUM (
    'kg',
    'g',
    'litro',
    'ml',
    'unidad'
);


ALTER TYPE public.unidad_medida_enum OWNER TO postgres;

--
-- Name: usuario_estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.usuario_estado_enum AS ENUM (
    'activo',
    'inactivo'
);


ALTER TYPE public.usuario_estado_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: arqueo_caja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.arqueo_caja (
    arqueo_caja_id integer NOT NULL,
    arqueo_caja_fecha_cierre timestamp without time zone DEFAULT now() NOT NULL,
    arqueo_caja_monto_esperado numeric(10,2) NOT NULL,
    arqueo_caja_monto_declarado numeric(10,2) NOT NULL,
    arqueo_caja_discrepancia_porcentual numeric(5,2),
    registro_pago_id integer
);


ALTER TABLE public.arqueo_caja OWNER TO postgres;

--
-- Name: arqueo_caja_arqueo_caja_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.arqueo_caja_arqueo_caja_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.arqueo_caja_arqueo_caja_id_seq OWNER TO postgres;

--
-- Name: arqueo_caja_arqueo_caja_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.arqueo_caja_arqueo_caja_id_seq OWNED BY public.arqueo_caja.arqueo_caja_id;


--
-- Name: detalle_pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_pedido (
    pedido_id integer NOT NULL,
    pedido_fecha_hora timestamp without time zone DEFAULT now() NOT NULL,
    pedido_estado public.pedido_estado_enum DEFAULT 'pendiente'::public.pedido_estado_enum,
    pedido_total_neto numeric(10,2) DEFAULT 0,
    insumo_id integer
);


ALTER TABLE public.detalle_pedido OWNER TO postgres;

--
-- Name: insumo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insumo (
    insumo_id integer NOT NULL,
    insumo_nombre character varying(100) NOT NULL,
    insumo_stock_actual integer DEFAULT 0 NOT NULL,
    insumo_stock_critico integer DEFAULT 0 NOT NULL,
    insumo_unidad_medida public.unidad_medida_enum NOT NULL,
    producto_id integer
);


ALTER TABLE public.insumo OWNER TO postgres;

--
-- Name: insumo_insumo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insumo_insumo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insumo_insumo_id_seq OWNER TO postgres;

--
-- Name: insumo_insumo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insumo_insumo_id_seq OWNED BY public.insumo.insumo_id;


--
-- Name: lote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lote (
    lote_id integer NOT NULL,
    lote_cantidad_ingresada integer NOT NULL,
    lote_cantidad_disponible integer NOT NULL,
    lote_fecha_recepcion date DEFAULT CURRENT_DATE NOT NULL,
    lote_fecha_vencimiento date,
    insumo_id integer NOT NULL
);


ALTER TABLE public.lote OWNER TO postgres;

--
-- Name: lote_lote_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lote_lote_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lote_lote_id_seq OWNER TO postgres;

--
-- Name: lote_lote_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lote_lote_id_seq OWNED BY public.lote.lote_id;


--
-- Name: merma; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.merma (
    merma_id integer NOT NULL,
    merma_cantidad integer NOT NULL,
    merma_fecha date DEFAULT CURRENT_DATE NOT NULL,
    merma_motivo public.merma_motivo_enum NOT NULL,
    merma_observacion character varying(255),
    insumo_id integer NOT NULL
);


ALTER TABLE public.merma OWNER TO postgres;

--
-- Name: merma_merma_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.merma_merma_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.merma_merma_id_seq OWNER TO postgres;

--
-- Name: merma_merma_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.merma_merma_id_seq OWNED BY public.merma.merma_id;


--
-- Name: mesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesa (
    mesa_id integer NOT NULL,
    mesa_numero integer NOT NULL,
    mesa_estado public.mesa_estado_enum DEFAULT 'disponible'::public.mesa_estado_enum,
    mesa_capacidad integer NOT NULL,
    usuario_id integer
);


ALTER TABLE public.mesa OWNER TO postgres;

--
-- Name: mesa_mesa_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mesa_mesa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mesa_mesa_id_seq OWNER TO postgres;

--
-- Name: mesa_mesa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mesa_mesa_id_seq OWNED BY public.mesa.mesa_id;


--
-- Name: pedido; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pedido (
    pedido_id integer NOT NULL,
    pedido_fecha_hora timestamp without time zone DEFAULT now() NOT NULL,
    pedido_estado public.pedido_estado_enum DEFAULT 'pendiente'::public.pedido_estado_enum,
    pedido_total_neto numeric(10,2) DEFAULT 0,
    mesa_id integer NOT NULL
);


ALTER TABLE public.pedido OWNER TO postgres;

--
-- Name: pedido_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pedido_pedido_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_pedido_id_seq OWNER TO postgres;

--
-- Name: pedido_pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pedido_pedido_id_seq OWNED BY public.pedido.pedido_id;


--
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    producto_id integer NOT NULL,
    producto_nombre character varying(100) NOT NULL,
    producto_precio numeric(10,2) NOT NULL,
    producto_categoria character varying(100)
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- Name: producto_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_producto_id_seq OWNER TO postgres;

--
-- Name: producto_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_producto_id_seq OWNED BY public.producto.producto_id;


--
-- Name: proveedor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proveedor (
    proveedor_id integer NOT NULL,
    proveedor_rut character varying(20) NOT NULL,
    proveedor_nombre character varying(100) NOT NULL,
    proveedor_nombre_contacto character varying(100),
    proveedor_telefono_contacto character varying(20),
    proveedor_correo_contacto character varying(150),
    lote_id integer
);


ALTER TABLE public.proveedor OWNER TO postgres;

--
-- Name: proveedor_proveedor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.proveedor_proveedor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.proveedor_proveedor_id_seq OWNER TO postgres;

--
-- Name: proveedor_proveedor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.proveedor_proveedor_id_seq OWNED BY public.proveedor.proveedor_id;


--
-- Name: receta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.receta (
    receta_id integer NOT NULL,
    receta_cantidad numeric(10,2) NOT NULL,
    producto_id integer NOT NULL
);


ALTER TABLE public.receta OWNER TO postgres;

--
-- Name: receta_receta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.receta_receta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.receta_receta_id_seq OWNER TO postgres;

--
-- Name: receta_receta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.receta_receta_id_seq OWNED BY public.receta.receta_id;


--
-- Name: registro_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registro_pago (
    registro_pago_id integer NOT NULL,
    registro_pago_monto numeric(10,2) NOT NULL,
    registro_pago_metodo character varying(50),
    registro_pago_estado_dte public.pago_estado_enum DEFAULT 'pendiente'::public.pago_estado_enum,
    pedido_id integer NOT NULL
);


ALTER TABLE public.registro_pago OWNER TO postgres;

--
-- Name: registro_pago_registro_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registro_pago_registro_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registro_pago_registro_pago_id_seq OWNER TO postgres;

--
-- Name: registro_pago_registro_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registro_pago_registro_pago_id_seq OWNED BY public.registro_pago.registro_pago_id;


--
-- Name: rol; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rol (
    rol_id integer NOT NULL,
    rol_nombre public.rol_nombre_enum NOT NULL
);


ALTER TABLE public.rol OWNER TO postgres;

--
-- Name: rol_rol_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rol_rol_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rol_rol_id_seq OWNER TO postgres;

--
-- Name: rol_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rol_rol_id_seq OWNED BY public.rol.rol_id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    usuario_id integer NOT NULL,
    usuario_run character varying(20) NOT NULL,
    usuario_apellido_paterno character varying(100) NOT NULL,
    usuario_apellido_materno character varying(100),
    usuario_nombres character varying(100) NOT NULL,
    usuario_correo character varying(150) NOT NULL,
    usuario_estado_cuenta public.usuario_estado_enum DEFAULT 'activo'::public.usuario_estado_enum,
    "usuario_contrase¤a" character varying(255) NOT NULL,
    rol_id integer NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_usuario_id_seq OWNED BY public.usuario.usuario_id;


--
-- Name: arqueo_caja arqueo_caja_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arqueo_caja ALTER COLUMN arqueo_caja_id SET DEFAULT nextval('public.arqueo_caja_arqueo_caja_id_seq'::regclass);


--
-- Name: insumo insumo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo ALTER COLUMN insumo_id SET DEFAULT nextval('public.insumo_insumo_id_seq'::regclass);


--
-- Name: lote lote_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lote ALTER COLUMN lote_id SET DEFAULT nextval('public.lote_lote_id_seq'::regclass);


--
-- Name: merma merma_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merma ALTER COLUMN merma_id SET DEFAULT nextval('public.merma_merma_id_seq'::regclass);


--
-- Name: mesa mesa_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa ALTER COLUMN mesa_id SET DEFAULT nextval('public.mesa_mesa_id_seq'::regclass);


--
-- Name: pedido pedido_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido ALTER COLUMN pedido_id SET DEFAULT nextval('public.pedido_pedido_id_seq'::regclass);


--
-- Name: producto producto_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN producto_id SET DEFAULT nextval('public.producto_producto_id_seq'::regclass);


--
-- Name: proveedor proveedor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor ALTER COLUMN proveedor_id SET DEFAULT nextval('public.proveedor_proveedor_id_seq'::regclass);


--
-- Name: receta receta_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta ALTER COLUMN receta_id SET DEFAULT nextval('public.receta_receta_id_seq'::regclass);


--
-- Name: registro_pago registro_pago_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_pago ALTER COLUMN registro_pago_id SET DEFAULT nextval('public.registro_pago_registro_pago_id_seq'::regclass);


--
-- Name: rol rol_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol ALTER COLUMN rol_id SET DEFAULT nextval('public.rol_rol_id_seq'::regclass);


--
-- Name: usuario usuario_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN usuario_id SET DEFAULT nextval('public.usuario_usuario_id_seq'::regclass);


--
-- Data for Name: arqueo_caja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.arqueo_caja (arqueo_caja_id, arqueo_caja_fecha_cierre, arqueo_caja_monto_esperado, arqueo_caja_monto_declarado, arqueo_caja_discrepancia_porcentual, registro_pago_id) FROM stdin;
1	2026-06-02 16:00:20.971853	22300.00	22300.00	0.00	1
\.


--
-- Data for Name: detalle_pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detalle_pedido (pedido_id, pedido_fecha_hora, pedido_estado, pedido_total_neto, insumo_id) FROM stdin;
\.


--
-- Data for Name: insumo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insumo (insumo_id, insumo_nombre, insumo_stock_actual, insumo_stock_critico, insumo_unidad_medida, producto_id) FROM stdin;
1	L£pulo	50	10	kg	1
2	Malta	100	20	kg	1
3	Carne	30	5	kg	3
4	Papa	40	8	kg	4
\.


--
-- Data for Name: lote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lote (lote_id, lote_cantidad_ingresada, lote_cantidad_disponible, lote_fecha_recepcion, lote_fecha_vencimiento, insumo_id) FROM stdin;
1	100	50	2026-06-02	2025-12-31	1
2	200	100	2026-06-02	2025-12-31	2
\.


--
-- Data for Name: merma; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.merma (merma_id, merma_cantidad, merma_fecha, merma_motivo, merma_observacion, insumo_id) FROM stdin;
1	5	2026-06-02	vencimiento	L£pulo vencido	1
2	2	2026-06-02	derrame	Derrame en bodega	2
\.


--
-- Data for Name: mesa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mesa (mesa_id, mesa_numero, mesa_estado, mesa_capacidad, usuario_id) FROM stdin;
1	1	disponible	4	\N
2	2	disponible	4	\N
3	3	disponible	6	\N
4	4	disponible	2	\N
5	5	disponible	8	\N
\.


--
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pedido (pedido_id, pedido_fecha_hora, pedido_estado, pedido_total_neto, mesa_id) FROM stdin;
1	2026-06-02 15:59:34.009769	pendiente	13400.00	1
2	2026-06-02 15:59:34.009769	entregado	8900.00	2
\.


--
-- Data for Name: producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.producto (producto_id, producto_nombre, producto_precio, producto_categoria) FROM stdin;
1	Cerveza Artesanal IPA	4500.00	Cerveza
2	Cerveza Stout	4200.00	Cerveza
3	Hamburguesa Cl sica	8900.00	Comida
4	Papas Fritas	3500.00	Comida
\.


--
-- Data for Name: proveedor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.proveedor (proveedor_id, proveedor_rut, proveedor_nombre, proveedor_nombre_contacto, proveedor_telefono_contacto, proveedor_correo_contacto, lote_id) FROM stdin;
1	76543210-1	Insumos del Sur	Juan Mora	+56911111111	juan@insumos.cl	1
2	76543210-2	Malter¡a Central	Rosa Vega	+56922222222	rosa@malteria.cl	2
\.


--
-- Data for Name: receta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.receta (receta_id, receta_cantidad, producto_id) FROM stdin;
\.


--
-- Data for Name: registro_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registro_pago (registro_pago_id, registro_pago_monto, registro_pago_metodo, registro_pago_estado_dte, pedido_id) FROM stdin;
1	13400.00	tarjeta	pagado	1
2	8900.00	efectivo	pagado	2
\.


--
-- Data for Name: rol; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rol (rol_id, rol_nombre) FROM stdin;
1	admin
2	mesero
3	cocina
4	caja
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (usuario_id, usuario_run, usuario_apellido_paterno, usuario_apellido_materno, usuario_nombres, usuario_correo, usuario_estado_cuenta, "usuario_contrase¤a", rol_id) FROM stdin;
3	12345678-9	Gonz lez	L¢pez	Carlos	carlos@brewflow.cl	activo	1234	1
4	98765432-1	P‚rez	Soto	Ana	ana@brewflow.cl	activo	1234	2
5	11111111-1	Ram¡rez	D¡az	Pedro	pedro@brewflow.cl	activo	1234	3
\.


--
-- Name: arqueo_caja_arqueo_caja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.arqueo_caja_arqueo_caja_id_seq', 1, true);


--
-- Name: insumo_insumo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insumo_insumo_id_seq', 4, true);


--
-- Name: lote_lote_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lote_lote_id_seq', 2, true);


--
-- Name: merma_merma_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.merma_merma_id_seq', 2, true);


--
-- Name: mesa_mesa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mesa_mesa_id_seq', 6, true);


--
-- Name: pedido_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pedido_pedido_id_seq', 2, true);


--
-- Name: producto_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.producto_producto_id_seq', 4, true);


--
-- Name: proveedor_proveedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.proveedor_proveedor_id_seq', 2, true);


--
-- Name: receta_receta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.receta_receta_id_seq', 1, false);


--
-- Name: registro_pago_registro_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registro_pago_registro_pago_id_seq', 2, true);


--
-- Name: rol_rol_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rol_rol_id_seq', 4, true);


--
-- Name: usuario_usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_usuario_id_seq', 5, true);


--
-- Name: arqueo_caja arqueo_caja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arqueo_caja
    ADD CONSTRAINT arqueo_caja_pkey PRIMARY KEY (arqueo_caja_id);


--
-- Name: detalle_pedido detalle_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_pkey PRIMARY KEY (pedido_id);


--
-- Name: insumo insumo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT insumo_pkey PRIMARY KEY (insumo_id);


--
-- Name: lote lote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lote
    ADD CONSTRAINT lote_pkey PRIMARY KEY (lote_id);


--
-- Name: merma merma_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merma
    ADD CONSTRAINT merma_pkey PRIMARY KEY (merma_id);


--
-- Name: mesa mesa_mesa_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_mesa_numero_key UNIQUE (mesa_numero);


--
-- Name: mesa mesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_pkey PRIMARY KEY (mesa_id);


--
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (pedido_id);


--
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (producto_id);


--
-- Name: proveedor proveedor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_pkey PRIMARY KEY (proveedor_id);


--
-- Name: proveedor proveedor_proveedor_rut_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_proveedor_rut_key UNIQUE (proveedor_rut);


--
-- Name: receta receta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_pkey PRIMARY KEY (receta_id);


--
-- Name: registro_pago registro_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_pago
    ADD CONSTRAINT registro_pago_pkey PRIMARY KEY (registro_pago_id);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (rol_id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (usuario_id);


--
-- Name: usuario usuario_usuario_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_usuario_correo_key UNIQUE (usuario_correo);


--
-- Name: usuario usuario_usuario_run_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_usuario_run_key UNIQUE (usuario_run);


--
-- Name: arqueo_caja arqueo_caja_registro_pago_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.arqueo_caja
    ADD CONSTRAINT arqueo_caja_registro_pago_id_fkey FOREIGN KEY (registro_pago_id) REFERENCES public.registro_pago(registro_pago_id);


--
-- Name: detalle_pedido detalle_pedido_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumo(insumo_id);


--
-- Name: detalle_pedido detalle_pedido_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedido(pedido_id);


--
-- Name: insumo insumo_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insumo
    ADD CONSTRAINT insumo_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.producto(producto_id);


--
-- Name: lote lote_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lote
    ADD CONSTRAINT lote_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumo(insumo_id);


--
-- Name: merma merma_insumo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.merma
    ADD CONSTRAINT merma_insumo_id_fkey FOREIGN KEY (insumo_id) REFERENCES public.insumo(insumo_id);


--
-- Name: mesa mesa_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesa
    ADD CONSTRAINT mesa_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(usuario_id);


--
-- Name: pedido pedido_mesa_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_mesa_id_fkey FOREIGN KEY (mesa_id) REFERENCES public.mesa(mesa_id);


--
-- Name: proveedor proveedor_lote_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proveedor
    ADD CONSTRAINT proveedor_lote_id_fkey FOREIGN KEY (lote_id) REFERENCES public.lote(lote_id);


--
-- Name: receta receta_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.receta
    ADD CONSTRAINT receta_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.producto(producto_id);


--
-- Name: registro_pago registro_pago_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registro_pago
    ADD CONSTRAINT registro_pago_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedido(pedido_id);


--
-- Name: usuario usuario_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.rol(rol_id);


--
-- PostgreSQL database dump complete
--

\unrestrict fYI9VT3G7QkhJ3Aa0812tb2jqe5jLmW5PTxP99weQN1SXfyINyQ4Ow3maNYgNAP

