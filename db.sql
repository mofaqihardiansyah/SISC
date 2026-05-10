--
-- PostgreSQL database dump
--

\restrict zclS18xvn0d0o12at8Hmcbgfjx0QsqskfDrxmlMFk8QhejitSkVz94NseKkSU3w

-- Dumped from database version 16.13
-- Dumped by pg_dump version 18.3

-- Started on 2026-05-10 11:52:13

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
-- TOC entry 6 (class 2615 OID 49187)
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- TOC entry 913 (class 1247 OID 65572)
-- Name: event_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.event_status AS ENUM (
    'pending',
    'published',
    'rejected'
);


--
-- TOC entry 916 (class 1247 OID 65580)
-- Name: jenis_event; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.jenis_event AS ENUM (
    'seminar',
    'conference'
);


--
-- TOC entry 919 (class 1247 OID 65586)
-- Name: tipe_harga; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipe_harga AS ENUM (
    'free',
    'paid'
);


--
-- TOC entry 922 (class 1247 OID 65592)
-- Name: tipe_platform; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipe_platform AS ENUM (
    'online',
    'offline',
    'hybrid'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 24579)
-- Name: bookmark; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmark (
    id integer NOT NULL,
    user_id integer,
    event_id integer,
    dibuat_pada timestamp without time zone DEFAULT now()
);


--
-- TOC entry 216 (class 1259 OID 24578)
-- Name: bookmark_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookmark_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 216
-- Name: bookmark_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookmark_id_seq OWNED BY public.bookmark.id;


--
-- TOC entry 219 (class 1259 OID 24587)
-- Name: event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event (
    id integer NOT NULL,
    organizer_id integer,
    kategori_id integer,
    kota_id integer,
    judul character varying(255) NOT NULL,
    slug character varying(255),
    deskripsi text,
    syarat_dan_ketentuan text,
    banner_url character varying(512),
    tanggal_mulai timestamp without time zone NOT NULL,
    tanggal_selesai timestamp without time zone,
    batas_registrasi timestamp without time zone,
    is_event_polines boolean DEFAULT false,
    tipe_platform public.tipe_platform,
    tipe_harga public.tipe_harga,
    detail_lokasi text,
    link_eksternal character varying(512),
    nama_kontak character varying(255),
    email_kontak character varying(255),
    telepon_kontak character varying(20),
    maks_tiket_per_transaksi integer,
    satu_akun_satu_transaksi boolean DEFAULT false,
    status public.event_status DEFAULT 'pending'::public.event_status,
    hasil_scraping boolean DEFAULT false,
    website_sumber character varying(255),
    jumlah_tayangan integer DEFAULT 0,
    alasan_penolakan text,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone,
    jenis_event public.jenis_event,
    harga integer DEFAULT 0,
    kuota integer,
    dihapus_pada timestamp without time zone,
    penyelenggara character varying(255),
    nama_pembicara character varying(255),
    peran_pembicara character varying(100),
    foto_pembicara_url character varying(512)
);


--
-- TOC entry 218 (class 1259 OID 24586)
-- Name: event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3604 (class 0 OID 0)
-- Dependencies: 218
-- Name: event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.event_id_seq OWNED BY public.event.id;


--
-- TOC entry 220 (class 1259 OID 24603)
-- Name: event_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_tag (
    event_id integer NOT NULL,
    tag_id integer NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 24609)
-- Name: jadwal_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jadwal_event (
    id integer NOT NULL,
    event_id integer,
    waktu_mulai timestamp without time zone,
    waktu_selesai timestamp without time zone,
    deskripsi text
);


--
-- TOC entry 221 (class 1259 OID 24608)
-- Name: jadwal_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jadwal_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3605 (class 0 OID 0)
-- Dependencies: 221
-- Name: jadwal_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jadwal_event_id_seq OWNED BY public.jadwal_event.id;


--
-- TOC entry 224 (class 1259 OID 24618)
-- Name: kategori; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kategori (
    id integer NOT NULL,
    nama character varying(100),
    slug character varying(100),
    icon_url character varying(512)
);


--
-- TOC entry 223 (class 1259 OID 24617)
-- Name: kategori_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kategori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 223
-- Name: kategori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kategori_id_seq OWNED BY public.kategori.id;


--
-- TOC entry 226 (class 1259 OID 24639)
-- Name: kota; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kota (
    id integer NOT NULL,
    provinsi_id integer,
    nama character varying(100)
);


--
-- TOC entry 225 (class 1259 OID 24638)
-- Name: kota_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 225
-- Name: kota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kota_id_seq OWNED BY public.kota.id;


--
-- TOC entry 228 (class 1259 OID 24648)
-- Name: lampiran_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lampiran_event (
    id integer NOT NULL,
    event_id integer,
    file_url character varying(512),
    tipe_file character varying(50)
);


--
-- TOC entry 227 (class 1259 OID 24647)
-- Name: lampiran_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.lampiran_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 227
-- Name: lampiran_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.lampiran_event_id_seq OWNED BY public.lampiran_event.id;


--
-- TOC entry 230 (class 1259 OID 24657)
-- Name: log_admin; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log_admin (
    id integer NOT NULL,
    admin_id integer,
    event_id integer,
    aksi character varying(100),
    data_sebelumnya jsonb,
    dibuat_pada timestamp without time zone DEFAULT now()
);


--
-- TOC entry 229 (class 1259 OID 24656)
-- Name: log_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.log_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 229
-- Name: log_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.log_admin_id_seq OWNED BY public.log_admin.id;


--
-- TOC entry 242 (class 1259 OID 40962)
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_codes (
    id integer NOT NULL,
    email character varying NOT NULL,
    code character varying(6) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    dibuat_pada timestamp without time zone DEFAULT now()
);


--
-- TOC entry 241 (class 1259 OID 40961)
-- Name: otp_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.otp_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 241
-- Name: otp_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.otp_codes_id_seq OWNED BY public.otp_codes.id;


--
-- TOC entry 244 (class 1259 OID 74998)
-- Name: paper_submission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.paper_submission (
    id integer NOT NULL,
    event_id integer NOT NULL,
    user_id integer NOT NULL,
    judul character varying(255) NOT NULL,
    penulis text NOT NULL,
    file_url character varying(512) NOT NULL,
    status character varying(50) DEFAULT 'review'::character varying,
    komentar_penolakan text,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone
);


--
-- TOC entry 243 (class 1259 OID 74997)
-- Name: paper_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.paper_submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 243
-- Name: paper_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.paper_submission_id_seq OWNED BY public.paper_submission.id;


--
-- TOC entry 246 (class 1259 OID 75009)
-- Name: pendaftaran; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pendaftaran (
    id integer NOT NULL,
    event_id integer,
    user_id integer,
    kode_pendaftaran character varying(50),
    status character varying(50) DEFAULT 'terdaftar'::character varying,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone,
    dihapus_pada timestamp without time zone
);


--
-- TOC entry 245 (class 1259 OID 75008)
-- Name: pendaftaran_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pendaftaran_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 245
-- Name: pendaftaran_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pendaftaran_id_seq OWNED BY public.pendaftaran.id;


--
-- TOC entry 232 (class 1259 OID 24687)
-- Name: peserta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.peserta (
    id integer NOT NULL,
    pendaftaran_id integer,
    kode_peserta character varying(50),
    nama_lengkap character varying(255),
    email character varying(255),
    nomor_telepon character varying(20),
    sudah_check_in boolean DEFAULT false,
    waktu_check_in timestamp without time zone,
    jenis_kelamin character varying(20)
);


--
-- TOC entry 231 (class 1259 OID 24686)
-- Name: peserta_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.peserta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 231
-- Name: peserta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.peserta_id_seq OWNED BY public.peserta.id;


--
-- TOC entry 238 (class 1259 OID 24739)
-- Name: profil_penyelenggara; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profil_penyelenggara (
    id integer NOT NULL,
    user_id integer,
    nama_instansi character varying(255),
    deskripsi_instansi text,
    dokumen_legalitas_url character varying(512),
    website_url character varying(255),
    diperbarui_pada timestamp without time zone,
    dibuat_pada timestamp without time zone DEFAULT now()
);


--
-- TOC entry 234 (class 1259 OID 24699)
-- Name: provinsi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provinsi (
    id integer NOT NULL,
    nama character varying(100)
);


--
-- TOC entry 233 (class 1259 OID 24698)
-- Name: provinsi_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.provinsi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 233
-- Name: provinsi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.provinsi_id_seq OWNED BY public.provinsi.id;


--
-- TOC entry 236 (class 1259 OID 24728)
-- Name: tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    nama character varying(100)
);


--
-- TOC entry 235 (class 1259 OID 24727)
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 235
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- TOC entry 237 (class 1259 OID 24738)
-- Name: tiket_event_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tiket_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 237
-- Name: tiket_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tiket_event_id_seq OWNED BY public.profil_penyelenggara.id;


--
-- TOC entry 240 (class 1259 OID 24763)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nama_lengkap character varying(255),
    email character varying(255),
    password character varying(255),
    nomor_telepon character varying(20),
    tanggal_lahir timestamp without time zone,
    jenis_kelamin character varying(20),
    nik character varying(16),
    role character varying(50),
    avatar_url character varying(512) DEFAULT '/uploads/avatars/fotodummy.jpg'::character varying,
    is_terverifikasi boolean DEFAULT false,
    dibuat_pada timestamp without time zone DEFAULT now(),
    dihapus_pada timestamp without time zone,
    email_verified timestamp without time zone,
    institution character varying(255),
    diperbarui_pada timestamp without time zone
);


--
-- TOC entry 239 (class 1259 OID 24762)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 239
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3351 (class 2604 OID 24582)
-- Name: bookmark id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark ALTER COLUMN id SET DEFAULT nextval('public.bookmark_id_seq'::regclass);


--
-- TOC entry 3353 (class 2604 OID 24590)
-- Name: event id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event ALTER COLUMN id SET DEFAULT nextval('public.event_id_seq'::regclass);


--
-- TOC entry 3361 (class 2604 OID 24612)
-- Name: jadwal_event id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jadwal_event ALTER COLUMN id SET DEFAULT nextval('public.jadwal_event_id_seq'::regclass);


--
-- TOC entry 3362 (class 2604 OID 24621)
-- Name: kategori id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kategori ALTER COLUMN id SET DEFAULT nextval('public.kategori_id_seq'::regclass);


--
-- TOC entry 3363 (class 2604 OID 24642)
-- Name: kota id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kota ALTER COLUMN id SET DEFAULT nextval('public.kota_id_seq'::regclass);


--
-- TOC entry 3364 (class 2604 OID 24651)
-- Name: lampiran_event id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lampiran_event ALTER COLUMN id SET DEFAULT nextval('public.lampiran_event_id_seq'::regclass);


--
-- TOC entry 3365 (class 2604 OID 24660)
-- Name: log_admin id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_admin ALTER COLUMN id SET DEFAULT nextval('public.log_admin_id_seq'::regclass);


--
-- TOC entry 3377 (class 2604 OID 40965)
-- Name: otp_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes ALTER COLUMN id SET DEFAULT nextval('public.otp_codes_id_seq'::regclass);


--
-- TOC entry 3379 (class 2604 OID 75001)
-- Name: paper_submission id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paper_submission ALTER COLUMN id SET DEFAULT nextval('public.paper_submission_id_seq'::regclass);


--
-- TOC entry 3382 (class 2604 OID 75012)
-- Name: pendaftaran id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pendaftaran ALTER COLUMN id SET DEFAULT nextval('public.pendaftaran_id_seq'::regclass);


--
-- TOC entry 3367 (class 2604 OID 24690)
-- Name: peserta id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peserta ALTER COLUMN id SET DEFAULT nextval('public.peserta_id_seq'::regclass);


--
-- TOC entry 3371 (class 2604 OID 24742)
-- Name: profil_penyelenggara id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profil_penyelenggara ALTER COLUMN id SET DEFAULT nextval('public.tiket_event_id_seq'::regclass);


--
-- TOC entry 3369 (class 2604 OID 24702)
-- Name: provinsi id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinsi ALTER COLUMN id SET DEFAULT nextval('public.provinsi_id_seq'::regclass);


--
-- TOC entry 3370 (class 2604 OID 24731)
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- TOC entry 3373 (class 2604 OID 24766)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3386 (class 2606 OID 24585)
-- Name: bookmark bookmark_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT bookmark_pkey PRIMARY KEY (id);


--
-- TOC entry 3389 (class 2606 OID 24600)
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- TOC entry 3391 (class 2606 OID 73829)
-- Name: event event_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_slug_unique UNIQUE (slug);


--
-- TOC entry 3396 (class 2606 OID 24607)
-- Name: event_tag event_tag_event_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_tag
    ADD CONSTRAINT event_tag_event_id_tag_id_pk PRIMARY KEY (event_id, tag_id);


--
-- TOC entry 3398 (class 2606 OID 24616)
-- Name: jadwal_event jadwal_event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jadwal_event
    ADD CONSTRAINT jadwal_event_pkey PRIMARY KEY (id);


--
-- TOC entry 3400 (class 2606 OID 24625)
-- Name: kategori kategori_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kategori
    ADD CONSTRAINT kategori_pkey PRIMARY KEY (id);


--
-- TOC entry 3402 (class 2606 OID 73803)
-- Name: kategori kategori_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kategori
    ADD CONSTRAINT kategori_slug_unique UNIQUE (slug);


--
-- TOC entry 3404 (class 2606 OID 24646)
-- Name: kota kota_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kota
    ADD CONSTRAINT kota_pkey PRIMARY KEY (id);


--
-- TOC entry 3406 (class 2606 OID 24655)
-- Name: lampiran_event lampiran_event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lampiran_event
    ADD CONSTRAINT lampiran_event_pkey PRIMARY KEY (id);


--
-- TOC entry 3408 (class 2606 OID 24665)
-- Name: log_admin log_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_admin
    ADD CONSTRAINT log_admin_pkey PRIMARY KEY (id);


--
-- TOC entry 3430 (class 2606 OID 40970)
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 3432 (class 2606 OID 75007)
-- Name: paper_submission paper_submission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paper_submission
    ADD CONSTRAINT paper_submission_pkey PRIMARY KEY (id);


--
-- TOC entry 3434 (class 2606 OID 75018)
-- Name: pendaftaran pendaftaran_kode_pendaftaran_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_kode_pendaftaran_unique UNIQUE (kode_pendaftaran);


--
-- TOC entry 3436 (class 2606 OID 75016)
-- Name: pendaftaran pendaftaran_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_pkey PRIMARY KEY (id);


--
-- TOC entry 3410 (class 2606 OID 74057)
-- Name: peserta peserta_kode_peserta_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peserta
    ADD CONSTRAINT peserta_kode_peserta_unique UNIQUE (kode_peserta);


--
-- TOC entry 3412 (class 2606 OID 24695)
-- Name: peserta peserta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peserta
    ADD CONSTRAINT peserta_pkey PRIMARY KEY (id);


--
-- TOC entry 3422 (class 2606 OID 32803)
-- Name: profil_penyelenggara profil_penyelenggara_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profil_penyelenggara
    ADD CONSTRAINT profil_penyelenggara_user_id_unique UNIQUE (user_id);


--
-- TOC entry 3414 (class 2606 OID 73764)
-- Name: provinsi provinsi_nama_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinsi
    ADD CONSTRAINT provinsi_nama_unique UNIQUE (nama);


--
-- TOC entry 3416 (class 2606 OID 24706)
-- Name: provinsi provinsi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinsi
    ADD CONSTRAINT provinsi_pkey PRIMARY KEY (id);


--
-- TOC entry 3418 (class 2606 OID 73771)
-- Name: tag tag_nama_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_nama_unique UNIQUE (nama);


--
-- TOC entry 3420 (class 2606 OID 24735)
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- TOC entry 3424 (class 2606 OID 24748)
-- Name: profil_penyelenggara tiket_event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profil_penyelenggara
    ADD CONSTRAINT tiket_event_pkey PRIMARY KEY (id);


--
-- TOC entry 3426 (class 2606 OID 73934)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 3428 (class 2606 OID 24772)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3387 (class 1259 OID 83743)
-- Name: bookmark_user_event_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX bookmark_user_event_idx ON public.bookmark USING btree (user_id, event_id);


--
-- TOC entry 3392 (class 1259 OID 65631)
-- Name: kategori_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kategori_idx ON public.event USING btree (kategori_id);


--
-- TOC entry 3393 (class 1259 OID 65630)
-- Name: organizer_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX organizer_idx ON public.event USING btree (organizer_id);


--
-- TOC entry 3394 (class 1259 OID 65632)
-- Name: status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX status_idx ON public.event USING btree (status);


--
-- TOC entry 3437 (class 2606 OID 24780)
-- Name: bookmark bookmark_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT bookmark_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 3438 (class 2606 OID 24775)
-- Name: bookmark bookmark_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark
    ADD CONSTRAINT bookmark_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3439 (class 2606 OID 24790)
-- Name: event event_kategori_id_kategori_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_kategori_id_kategori_id_fk FOREIGN KEY (kategori_id) REFERENCES public.kategori(id);


--
-- TOC entry 3440 (class 2606 OID 24795)
-- Name: event event_kota_id_kota_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_kota_id_kota_id_fk FOREIGN KEY (kota_id) REFERENCES public.kota(id);


--
-- TOC entry 3441 (class 2606 OID 24785)
-- Name: event event_organizer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_organizer_id_users_id_fk FOREIGN KEY (organizer_id) REFERENCES public.users(id);


--
-- TOC entry 3442 (class 2606 OID 24800)
-- Name: event_tag event_tag_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_tag
    ADD CONSTRAINT event_tag_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 3443 (class 2606 OID 24805)
-- Name: event_tag event_tag_tag_id_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_tag
    ADD CONSTRAINT event_tag_tag_id_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.tag(id);


--
-- TOC entry 3444 (class 2606 OID 24810)
-- Name: jadwal_event jadwal_event_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jadwal_event
    ADD CONSTRAINT jadwal_event_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 3445 (class 2606 OID 24825)
-- Name: kota kota_provinsi_id_provinsi_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kota
    ADD CONSTRAINT kota_provinsi_id_provinsi_id_fk FOREIGN KEY (provinsi_id) REFERENCES public.provinsi(id);


--
-- TOC entry 3446 (class 2606 OID 24830)
-- Name: lampiran_event lampiran_event_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lampiran_event
    ADD CONSTRAINT lampiran_event_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 3447 (class 2606 OID 24835)
-- Name: log_admin log_admin_admin_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_admin
    ADD CONSTRAINT log_admin_admin_id_users_id_fk FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- TOC entry 3448 (class 2606 OID 24840)
-- Name: log_admin log_admin_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_admin
    ADD CONSTRAINT log_admin_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 3451 (class 2606 OID 75024)
-- Name: paper_submission paper_submission_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paper_submission
    ADD CONSTRAINT paper_submission_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 3452 (class 2606 OID 75029)
-- Name: paper_submission paper_submission_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.paper_submission
    ADD CONSTRAINT paper_submission_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3453 (class 2606 OID 75034)
-- Name: pendaftaran pendaftaran_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 3454 (class 2606 OID 75039)
-- Name: pendaftaran pendaftaran_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3449 (class 2606 OID 75044)
-- Name: peserta peserta_pendaftaran_id_pendaftaran_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.peserta
    ADD CONSTRAINT peserta_pendaftaran_id_pendaftaran_id_fk FOREIGN KEY (pendaftaran_id) REFERENCES public.pendaftaran(id);


--
-- TOC entry 3450 (class 2606 OID 32795)
-- Name: profil_penyelenggara profil_penyelenggara_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profil_penyelenggara
    ADD CONSTRAINT profil_penyelenggara_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-05-10 11:52:15

--
-- PostgreSQL database dump complete
--

\unrestrict zclS18xvn0d0o12at8Hmcbgfjx0QsqskfDrxmlMFk8QhejitSkVz94NseKkSU3w

