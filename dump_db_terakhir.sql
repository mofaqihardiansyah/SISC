--
-- PostgreSQL database dump
--

\restrict dbCisCNr2xi2TfVPqpqhCMIJfJQMBUaaTRct9KfplKsxj5AlzeeXpBYIsOCcwXq

-- Dumped from database version 17.10
-- Dumped by pg_dump version 17.10

-- Started on 2026-07-15 19:31:12

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
-- TOC entry 6 (class 2615 OID 22040)
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA drizzle;


ALTER SCHEMA drizzle OWNER TO postgres;

--
-- TOC entry 894 (class 1247 OID 16389)
-- Name: event_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.event_status AS ENUM (
    'draft',
    'pending',
    'published',
    'rejected'
);


ALTER TYPE public.event_status OWNER TO postgres;

--
-- TOC entry 897 (class 1247 OID 16396)
-- Name: jenis_event; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.jenis_event AS ENUM (
    'seminar',
    'conference'
);


ALTER TYPE public.jenis_event OWNER TO postgres;

--
-- TOC entry 900 (class 1247 OID 16402)
-- Name: jenis_kelamin; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.jenis_kelamin AS ENUM (
    'Laki-laki',
    'Perempuan'
);


ALTER TYPE public.jenis_kelamin OWNER TO postgres;

--
-- TOC entry 981 (class 1247 OID 23276)
-- Name: log_scraping_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.log_scraping_status AS ENUM (
    'pending',
    'processing',
    'success',
    'failed'
);


ALTER TYPE public.log_scraping_status OWNER TO postgres;

--
-- TOC entry 903 (class 1247 OID 16408)
-- Name: paper_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.paper_status AS ENUM (
    'review',
    'accepted',
    'rejected'
);


ALTER TYPE public.paper_status OWNER TO postgres;

--
-- TOC entry 906 (class 1247 OID 16416)
-- Name: pendaftaran_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.pendaftaran_status AS ENUM (
    'terdaftar',
    'menunggu_verifikasi',
    'lunas',
    'dibatalkan',
    'hadir'
);


ALTER TYPE public.pendaftaran_status OWNER TO postgres;

--
-- TOC entry 990 (class 1247 OID 23706)
-- Name: scraper_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.scraper_type AS ENUM (
    'cheerio',
    'crawlee_playwright'
);


ALTER TYPE public.scraper_type OWNER TO postgres;

--
-- TOC entry 909 (class 1247 OID 16424)
-- Name: tipe_harga; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipe_harga AS ENUM (
    'free',
    'paid'
);


ALTER TYPE public.tipe_harga OWNER TO postgres;

--
-- TOC entry 969 (class 1247 OID 22779)
-- Name: tipe_pembayaran; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipe_pembayaran AS ENUM (
    'bank_transfer',
    'qris'
);


ALTER TYPE public.tipe_pembayaran OWNER TO postgres;

--
-- TOC entry 912 (class 1247 OID 16430)
-- Name: tipe_platform; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipe_platform AS ENUM (
    'online',
    'offline',
    'hybrid'
);


ALTER TYPE public.tipe_platform OWNER TO postgres;

--
-- TOC entry 915 (class 1247 OID 16438)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'organizer',
    'visitor'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 249 (class 1259 OID 22042)
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: postgres
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


ALTER TABLE drizzle.__drizzle_migrations OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 22041)
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: postgres
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNER TO postgres;

--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 248
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: postgres
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- TOC entry 219 (class 1259 OID 16454)
-- Name: event; Type: TABLE; Schema: public; Owner: postgres
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
    url_banner character varying(512),
    penyelenggara character varying(255),
    tanggal_mulai timestamp without time zone NOT NULL,
    tanggal_selesai timestamp without time zone,
    batas_registrasi timestamp without time zone,
    event_polines boolean DEFAULT false,
    jenis_event public.jenis_event,
    tipe_platform public.tipe_platform,
    tipe_harga public.tipe_harga,
    harga integer DEFAULT 0,
    detail_lokasi text,
    link_eksternal character varying(512),
    kuota integer,
    status public.event_status DEFAULT 'pending'::public.event_status,
    hasil_scraping boolean DEFAULT false,
    website_sumber character varying(255),
    jumlah_tayangan integer DEFAULT 0,
    alasan_penolakan text,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone,
    dihapus_pada timestamp without time zone,
    metode_pembayaran jsonb
);


ALTER TABLE public.event OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16453)
-- Name: event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_id_seq OWNER TO postgres;

--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 218
-- Name: event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_id_seq OWNED BY public.event.id;


--
-- TOC entry 220 (class 1259 OID 16471)
-- Name: event_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_tag (
    event_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.event_tag OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 20522)
-- Name: favorit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorit (
    user_id integer NOT NULL,
    event_id integer NOT NULL,
    dibuat_pada timestamp without time zone DEFAULT now()
);


ALTER TABLE public.favorit OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 22787)
-- Name: info_pembayaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.info_pembayaran (
    id integer NOT NULL,
    tipe public.tipe_pembayaran NOT NULL,
    nama_bank character varying(100),
    nomor_rekening character varying(50),
    pemilik_rekening character varying(255),
    url_gambar_qris character varying(512),
    aktif boolean DEFAULT true,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone
);


ALTER TABLE public.info_pembayaran OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 22786)
-- Name: info_pembayaran_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.info_pembayaran_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.info_pembayaran_id_seq OWNER TO postgres;

--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 250
-- Name: info_pembayaran_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.info_pembayaran_id_seq OWNED BY public.info_pembayaran.id;


--
-- TOC entry 222 (class 1259 OID 16477)
-- Name: jadwal_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jadwal_event (
    id integer NOT NULL,
    event_id integer,
    waktu_mulai timestamp without time zone,
    waktu_selesai timestamp without time zone,
    deskripsi text,
    dibuat_pada timestamp without time zone DEFAULT now()
);


ALTER TABLE public.jadwal_event OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16476)
-- Name: jadwal_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jadwal_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jadwal_event_id_seq OWNER TO postgres;

--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 221
-- Name: jadwal_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jadwal_event_id_seq OWNED BY public.jadwal_event.id;


--
-- TOC entry 224 (class 1259 OID 16486)
-- Name: kategori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kategori (
    id integer NOT NULL,
    nama character varying(100),
    slug character varying(100),
    url_ikon character varying(512)
);


ALTER TABLE public.kategori OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16485)
-- Name: kategori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kategori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kategori_id_seq OWNER TO postgres;

--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 223
-- Name: kategori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kategori_id_seq OWNED BY public.kategori.id;


--
-- TOC entry 226 (class 1259 OID 16497)
-- Name: kota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kota (
    id integer NOT NULL,
    provinsi_id integer,
    nama character varying(100)
);


ALTER TABLE public.kota OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16496)
-- Name: kota_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kota_id_seq OWNER TO postgres;

--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 225
-- Name: kota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kota_id_seq OWNED BY public.kota.id;


--
-- TOC entry 228 (class 1259 OID 16504)
-- Name: lampiran_event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lampiran_event (
    id integer NOT NULL,
    event_id integer,
    url_file character varying(512),
    tipe_file character varying(50),
    urutan integer DEFAULT 0,
    dibuat_pada timestamp without time zone DEFAULT now()
);


ALTER TABLE public.lampiran_event OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16503)
-- Name: lampiran_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lampiran_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lampiran_event_id_seq OWNER TO postgres;

--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 227
-- Name: lampiran_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lampiran_event_id_seq OWNED BY public.lampiran_event.id;


--
-- TOC entry 230 (class 1259 OID 16513)
-- Name: log_admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_admin (
    id integer NOT NULL,
    admin_id integer,
    event_id integer,
    aksi character varying(100),
    data_sebelumnya jsonb,
    dibuat_pada timestamp without time zone DEFAULT now()
);


ALTER TABLE public.log_admin OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16512)
-- Name: log_admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_admin_id_seq OWNER TO postgres;

--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 229
-- Name: log_admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_admin_id_seq OWNED BY public.log_admin.id;


--
-- TOC entry 257 (class 1259 OID 23286)
-- Name: log_scraping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.log_scraping (
    id integer NOT NULL,
    target_url character varying(512),
    sumber character varying(255),
    status public.log_scraping_status DEFAULT 'pending'::public.log_scraping_status,
    jumlah_data integer DEFAULT 0,
    error_message text,
    mulai_pada timestamp without time zone DEFAULT now(),
    selesai_pada timestamp without time zone
);


ALTER TABLE public.log_scraping OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 23285)
-- Name: log_scraping_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.log_scraping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.log_scraping_id_seq OWNER TO postgres;

--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 256
-- Name: log_scraping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.log_scraping_id_seq OWNED BY public.log_scraping.id;


--
-- TOC entry 232 (class 1259 OID 16523)
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.otp_codes (
    id integer NOT NULL,
    email character varying NOT NULL,
    code character varying(6) NOT NULL,
    kedaluwarsa_pada timestamp without time zone NOT NULL,
    dibuat_pada timestamp without time zone DEFAULT now()
);


ALTER TABLE public.otp_codes OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16522)
-- Name: otp_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.otp_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.otp_codes_id_seq OWNER TO postgres;

--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 231
-- Name: otp_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.otp_codes_id_seq OWNED BY public.otp_codes.id;


--
-- TOC entry 234 (class 1259 OID 16533)
-- Name: paper_submission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paper_submission (
    id integer NOT NULL,
    event_id integer NOT NULL,
    user_id integer NOT NULL,
    judul character varying(255) NOT NULL,
    url_file character varying(512) NOT NULL,
    status public.paper_status DEFAULT 'review'::public.paper_status,
    komentar_penolakan text,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone,
    kata_kunci character varying(255),
    track character varying(255),
    abstrak text
);


ALTER TABLE public.paper_submission OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16532)
-- Name: paper_submission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paper_submission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.paper_submission_id_seq OWNER TO postgres;

--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 233
-- Name: paper_submission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paper_submission_id_seq OWNED BY public.paper_submission.id;


--
-- TOC entry 253 (class 1259 OID 22798)
-- Name: pembicara; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pembicara (
    id integer NOT NULL,
    event_id integer NOT NULL,
    nama character varying(255) NOT NULL,
    peran character varying(100),
    url_foto character varying(512),
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone
);


ALTER TABLE public.pembicara OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 22797)
-- Name: pembicara_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pembicara_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pembicara_id_seq OWNER TO postgres;

--
-- TOC entry 5270 (class 0 OID 0)
-- Dependencies: 252
-- Name: pembicara_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pembicara_id_seq OWNED BY public.pembicara.id;


--
-- TOC entry 236 (class 1259 OID 16544)
-- Name: pendaftaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pendaftaran (
    id integer NOT NULL,
    event_id integer,
    user_id integer,
    kode_pendaftaran character varying(50),
    status public.pendaftaran_status DEFAULT 'terdaftar'::public.pendaftaran_status,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone,
    dihapus_pada timestamp without time zone,
    bukti_pembayaran text,
    metode_pembayaran_id integer,
    total_harga integer DEFAULT 0,
    alasan_penolakan text
);


ALTER TABLE public.pendaftaran OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16543)
-- Name: pendaftaran_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pendaftaran_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pendaftaran_id_seq OWNER TO postgres;

--
-- TOC entry 5271 (class 0 OID 0)
-- Dependencies: 235
-- Name: pendaftaran_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pendaftaran_id_seq OWNED BY public.pendaftaran.id;


--
-- TOC entry 255 (class 1259 OID 22808)
-- Name: penulis_paper; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.penulis_paper (
    id integer NOT NULL,
    paper_submission_id integer NOT NULL,
    nama character varying(255) NOT NULL,
    email character varying(255),
    institusi character varying(255),
    urutan integer DEFAULT 0,
    dibuat_pada timestamp without time zone DEFAULT now(),
    is_corresponding boolean DEFAULT false
);


ALTER TABLE public.penulis_paper OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 22807)
-- Name: penulis_paper_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.penulis_paper_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.penulis_paper_id_seq OWNER TO postgres;

--
-- TOC entry 5272 (class 0 OID 0)
-- Dependencies: 254
-- Name: penulis_paper_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.penulis_paper_id_seq OWNED BY public.penulis_paper.id;


--
-- TOC entry 238 (class 1259 OID 16555)
-- Name: peserta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.peserta (
    id integer NOT NULL,
    pendaftaran_id integer,
    kode_peserta character varying(50),
    nama_lengkap character varying(255),
    email character varying(255),
    nomor_telepon character varying(20),
    jenis_kelamin public.jenis_kelamin,
    user_id integer,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone
);


ALTER TABLE public.peserta OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16554)
-- Name: peserta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.peserta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.peserta_id_seq OWNER TO postgres;

--
-- TOC entry 5273 (class 0 OID 0)
-- Dependencies: 237
-- Name: peserta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.peserta_id_seq OWNED BY public.peserta.id;


--
-- TOC entry 240 (class 1259 OID 16567)
-- Name: profil_penyelenggara; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.profil_penyelenggara (
    id integer NOT NULL,
    user_id integer,
    nama_instansi character varying(255),
    deskripsi_instansi text,
    url_dokumen_legalitas character varying(512),
    url_website character varying(255),
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone,
    alasan_penolakan text
);


ALTER TABLE public.profil_penyelenggara OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16566)
-- Name: profil_penyelenggara_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.profil_penyelenggara_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profil_penyelenggara_id_seq OWNER TO postgres;

--
-- TOC entry 5274 (class 0 OID 0)
-- Dependencies: 239
-- Name: profil_penyelenggara_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.profil_penyelenggara_id_seq OWNED BY public.profil_penyelenggara.id;


--
-- TOC entry 242 (class 1259 OID 16579)
-- Name: provinsi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinsi (
    id integer NOT NULL,
    nama character varying(100)
);


ALTER TABLE public.provinsi OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16578)
-- Name: provinsi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.provinsi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provinsi_id_seq OWNER TO postgres;

--
-- TOC entry 5275 (class 0 OID 0)
-- Dependencies: 241
-- Name: provinsi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provinsi_id_seq OWNED BY public.provinsi.id;


--
-- TOC entry 259 (class 1259 OID 23298)
-- Name: raw_scraped_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.raw_scraped_data (
    id integer NOT NULL,
    sumber character varying(255) NOT NULL,
    url_target character varying(512),
    data jsonb NOT NULL,
    status_integrasi boolean DEFAULT false,
    dibuat_pada timestamp without time zone DEFAULT now(),
    status character varying(20) DEFAULT 'pending'::character varying
);


ALTER TABLE public.raw_scraped_data OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 23297)
-- Name: raw_scraped_data_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.raw_scraped_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.raw_scraped_data_id_seq OWNER TO postgres;

--
-- TOC entry 5276 (class 0 OID 0)
-- Dependencies: 258
-- Name: raw_scraped_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.raw_scraped_data_id_seq OWNED BY public.raw_scraped_data.id;


--
-- TOC entry 261 (class 1259 OID 23712)
-- Name: scraping_auto_approval_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scraping_auto_approval_rules (
    id integer NOT NULL,
    rule_name character varying(255) NOT NULL,
    condition_type character varying(50) NOT NULL,
    threshold_value integer DEFAULT 85,
    auto_publish boolean DEFAULT true,
    enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.scraping_auto_approval_rules OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 23711)
-- Name: scraping_auto_approval_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scraping_auto_approval_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scraping_auto_approval_rules_id_seq OWNER TO postgres;

--
-- TOC entry 5277 (class 0 OID 0)
-- Dependencies: 260
-- Name: scraping_auto_approval_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scraping_auto_approval_rules_id_seq OWNED BY public.scraping_auto_approval_rules.id;


--
-- TOC entry 263 (class 1259 OID 23723)
-- Name: scraping_sources; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scraping_sources (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    base_url character varying(500) NOT NULL,
    url_pattern character varying(500),
    scraper_type public.scraper_type DEFAULT 'cheerio'::public.scraper_type,
    cron_schedule character varying(100),
    max_results_per_run integer DEFAULT 100,
    rate_limit_delay_ms integer DEFAULT 1000,
    max_concurrent_requests integer DEFAULT 5,
    is_active boolean DEFAULT true,
    last_scraped_at timestamp without time zone,
    last_successful_count integer,
    last_error_message text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.scraping_sources OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 23722)
-- Name: scraping_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scraping_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scraping_sources_id_seq OWNER TO postgres;

--
-- TOC entry 5278 (class 0 OID 0)
-- Dependencies: 262
-- Name: scraping_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scraping_sources_id_seq OWNED BY public.scraping_sources.id;


--
-- TOC entry 265 (class 1259 OID 23739)
-- Name: scraping_validation_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scraping_validation_rules (
    id integer NOT NULL,
    field_name character varying(100) NOT NULL,
    is_required boolean DEFAULT true,
    min_length integer,
    max_length integer,
    regex_pattern character varying(500),
    confidence_threshold integer DEFAULT 75,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.scraping_validation_rules OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 23738)
-- Name: scraping_validation_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scraping_validation_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scraping_validation_rules_id_seq OWNER TO postgres;

--
-- TOC entry 5279 (class 0 OID 0)
-- Dependencies: 264
-- Name: scraping_validation_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scraping_validation_rules_id_seq OWNED BY public.scraping_validation_rules.id;


--
-- TOC entry 244 (class 1259 OID 16588)
-- Name: tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tag (
    id integer NOT NULL,
    nama character varying(100)
);


ALTER TABLE public.tag OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16587)
-- Name: tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tag_id_seq OWNER TO postgres;

--
-- TOC entry 5280 (class 0 OID 0)
-- Dependencies: 243
-- Name: tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;


--
-- TOC entry 246 (class 1259 OID 16597)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nama_lengkap character varying(255),
    email character varying(255),
    nomor_telepon character varying(20),
    institusi character varying(255),
    password character varying(255),
    email_terverifikasi timestamp without time zone,
    tanggal_lahir timestamp without time zone,
    jenis_kelamin public.jenis_kelamin,
    role public.user_role DEFAULT 'visitor'::public.user_role,
    url_avatar character varying(512) DEFAULT '/uploads/avatars/fotodummy.jpg'::character varying,
    dibuat_pada timestamp without time zone DEFAULT now(),
    diperbarui_pada timestamp without time zone,
    dihapus_pada timestamp without time zone,
    pekerjaan character varying(255),
    disetujui boolean DEFAULT false,
    diblokir boolean DEFAULT false,
    terakhir_aktif_pada timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16596)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5281 (class 0 OID 0)
-- Dependencies: 245
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4932 (class 2604 OID 22045)
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 16457)
-- Name: event id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event ALTER COLUMN id SET DEFAULT nextval('public.event_id_seq'::regclass);


--
-- TOC entry 4933 (class 2604 OID 22790)
-- Name: info_pembayaran id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_pembayaran ALTER COLUMN id SET DEFAULT nextval('public.info_pembayaran_id_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16480)
-- Name: jadwal_event id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jadwal_event ALTER COLUMN id SET DEFAULT nextval('public.jadwal_event_id_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 16489)
-- Name: kategori id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kategori ALTER COLUMN id SET DEFAULT nextval('public.kategori_id_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 16500)
-- Name: kota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kota ALTER COLUMN id SET DEFAULT nextval('public.kota_id_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 16507)
-- Name: lampiran_event id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lampiran_event ALTER COLUMN id SET DEFAULT nextval('public.lampiran_event_id_seq'::regclass);


--
-- TOC entry 4908 (class 2604 OID 16516)
-- Name: log_admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_admin ALTER COLUMN id SET DEFAULT nextval('public.log_admin_id_seq'::regclass);


--
-- TOC entry 4942 (class 2604 OID 23289)
-- Name: log_scraping id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_scraping ALTER COLUMN id SET DEFAULT nextval('public.log_scraping_id_seq'::regclass);


--
-- TOC entry 4910 (class 2604 OID 16526)
-- Name: otp_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_codes ALTER COLUMN id SET DEFAULT nextval('public.otp_codes_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 16536)
-- Name: paper_submission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paper_submission ALTER COLUMN id SET DEFAULT nextval('public.paper_submission_id_seq'::regclass);


--
-- TOC entry 4936 (class 2604 OID 22801)
-- Name: pembicara id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pembicara ALTER COLUMN id SET DEFAULT nextval('public.pembicara_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 16547)
-- Name: pendaftaran id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pendaftaran ALTER COLUMN id SET DEFAULT nextval('public.pendaftaran_id_seq'::regclass);


--
-- TOC entry 4938 (class 2604 OID 22811)
-- Name: penulis_paper id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penulis_paper ALTER COLUMN id SET DEFAULT nextval('public.penulis_paper_id_seq'::regclass);


--
-- TOC entry 4919 (class 2604 OID 16558)
-- Name: peserta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peserta ALTER COLUMN id SET DEFAULT nextval('public.peserta_id_seq'::regclass);


--
-- TOC entry 4921 (class 2604 OID 16570)
-- Name: profil_penyelenggara id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profil_penyelenggara ALTER COLUMN id SET DEFAULT nextval('public.profil_penyelenggara_id_seq'::regclass);


--
-- TOC entry 4923 (class 2604 OID 16582)
-- Name: provinsi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinsi ALTER COLUMN id SET DEFAULT nextval('public.provinsi_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 23301)
-- Name: raw_scraped_data id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_scraped_data ALTER COLUMN id SET DEFAULT nextval('public.raw_scraped_data_id_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 23715)
-- Name: scraping_auto_approval_rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scraping_auto_approval_rules ALTER COLUMN id SET DEFAULT nextval('public.scraping_auto_approval_rules_id_seq'::regclass);


--
-- TOC entry 4955 (class 2604 OID 23726)
-- Name: scraping_sources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scraping_sources ALTER COLUMN id SET DEFAULT nextval('public.scraping_sources_id_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 23742)
-- Name: scraping_validation_rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scraping_validation_rules ALTER COLUMN id SET DEFAULT nextval('public.scraping_validation_rules_id_seq'::regclass);


--
-- TOC entry 4924 (class 2604 OID 16591)
-- Name: tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);


--
-- TOC entry 4925 (class 2604 OID 16600)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5237 (class 0 OID 22042)
-- Dependencies: 249
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- TOC entry 5207 (class 0 OID 16454)
-- Dependencies: 219
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event (id, organizer_id, kategori_id, kota_id, judul, slug, deskripsi, syarat_dan_ketentuan, url_banner, penyelenggara, tanggal_mulai, tanggal_selesai, batas_registrasi, event_polines, jenis_event, tipe_platform, tipe_harga, harga, detail_lokasi, link_eksternal, kuota, status, hasil_scraping, website_sumber, jumlah_tayangan, alasan_penolakan, dibuat_pada, diperbarui_pada, dihapus_pada, metode_pembayaran) FROM stdin;
1	2	1	2	Seminar Nasional Transformasi Digital di Era Industri 5.0	seminar-nasional-transformasi-digital-di-era-industri-5-0	Seminar nasional membahas strategi adaptasi industri dalam menyongsong revolusi industri 5.0 yang berfokus pada kolaborasi manusia-mesin.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event1/1200/600	Politeknik Negeri Semarang	2026-07-29 06:38:52.619	2026-07-29 06:38:52.619	2026-07-27 06:38:52.619	t	seminar	offline	free	0	Auditorium Utama, Polines, Semarang	\N	300	published	f	\N	1250	\N	2026-06-29 06:38:55.095	\N	\N	\N
2	2	4	11	Seminar Strategi Pemasaran Digital untuk UMKM Berdaya Saing	seminar-strategi-pemasaran-digital-untuk-umkm-berdaya-saing	Seminar mendalam mengenai teknik pemasaran digital, optimasi media sosial, dan branding untuk meningkatkan skala bisnis UMKM.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event2/1200/600	Politeknik Negeri Semarang	2026-08-13 06:38:52.619	2026-08-13 06:38:52.619	2026-08-08 06:38:52.619	f	seminar	hybrid	paid	150000	Grand Ballroom, Jakarta	\N	200	published	f	\N	2800	\N	2026-06-29 06:38:55.114	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Seminar Strateg", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Seminar Strateg", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
3	2	5	3	Seminar Global Health Summit: Health Tech Innovation	seminar-global-health-summit-health-tech-innovation	Membahas inovasi teknologi kesehatan terkini, mulai dari telemedicine hingga pemanfaatan AI dalam diagnosis medis.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event3/1200/600	Politeknik Negeri Semarang	2026-08-28 06:38:52.619	2026-08-28 06:38:52.619	2026-08-26 06:38:52.619	f	seminar	online	free	0	Zoom Virtual Event	\N	1000	published	f	\N	4500	\N	2026-06-29 06:38:55.121	\N	\N	\N
4	2	1	2	International Conference on Artificial Intelligence and Robotics 2026	international-conference-on-artificial-intelligence-and-robotics-2026	Konferensi internasional tahunan yang mengundang peneliti, akademisi, dan praktisi AI serta robotika dari seluruh dunia.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event4/1200/600	Politeknik Negeri Semarang	2026-09-27 06:38:52.619	2026-09-29 06:38:52.619	2026-09-17 06:38:52.619	t	conference	offline	paid	500000	Gedung Pusat Informasi, Polines	\N	500	published	f	\N	3200	\N	2026-06-29 06:38:55.128	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia International C", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia International C", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
5	2	4	3	World Economic Forum: Future of Sustainable Finance	world-economic-forum-future-of-sustainable-finance	Membahas masa depan keuangan berkelanjutan dan peran ESG (Environmental, Social, and Governance) dalam ekonomi global.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event5/1200/600	Politeknik Negeri Semarang	2026-10-27 06:38:52.619	2026-10-29 06:38:52.619	2026-10-17 06:38:52.619	f	conference	offline	paid	750000	Shangri-La Hotel, Surabaya	\N	300	published	f	\N	5000	\N	2026-06-29 06:38:55.134	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia World Economic ", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia World Economic ", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
7	2	4	2	Workshop Nasional Cybersecurity: Ethical Hacking for Beginners	workshop-nasional-cybersecurity-ethical-hacking-for-beginners	Workshop intensif selama satu hari tentang dasar-dasar ethical hacking, penetration testing, dan cara mengamankan sistem.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event7/1200/600	Politeknik Negeri Semarang	2026-07-14 06:38:52.619	2026-07-14 06:38:52.619	2026-07-12 06:38:52.619	t	seminar	offline	paid	75000	Laboratorium Komputer, Gedung MST Polines	\N	100	published	f	\N	850	\N	2026-06-29 06:38:55.146	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Workshop Nasion", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Workshop Nasion", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
8	2	1	2	Pelatihan UI/UX Design: From Wireframe to Prototype	pelatihan-ui-ux-design-from-wireframe-to-prototype	Pelatihan praktis desain UI/UX menggunakan Figma. Peserta akan diajarkan mulai dari research, wireframing, hingga interaktif prototype.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event8/1200/600	Politeknik Negeri Semarang	2026-07-19 06:38:52.619	2026-07-20 06:38:52.619	2026-07-17 06:38:52.619	t	seminar	offline	paid	50000	Ruang Serbaguna, Polines	\N	150	published	f	\N	1120	\N	2026-06-29 06:38:55.155	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Pelatihan UI/UX", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Pelatihan UI/UX", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
9	2	11	2	Seminar Technopreneurship: Membangun Startup dari Kampus	seminar-technopreneurship-membangun-startup-dari-kampus	Menggali potensi mahasiswa dalam membangun startup berbasis teknologi. Dibahas cara mencari ide, validasi, dan pitching ke investor.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event9/1200/600	Politeknik Negeri Semarang	2026-08-08 06:38:52.619	2026-08-08 06:38:52.619	2026-08-03 06:38:52.619	t	seminar	hybrid	paid	35000	Auditorium Tata Niaga, Polines	\N	250	published	f	\N	940	\N	2026-06-29 06:38:55.159	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Seminar Technop", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Seminar Technop", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
10	2	4	2	Polines Career Fest 2026: Siap Kerja di Era Digital	polines-career-fest-2026-siap-kerja-di-era-digital	Festival karir terbesar di Polines yang menghadirkan puluhan perusahaan multinasional dan seminar persiapan karir.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event10/1200/600	Politeknik Negeri Semarang	2026-08-28 06:38:52.619	2026-08-30 06:38:52.619	2026-08-23 06:38:52.619	t	seminar	offline	free	0	Lapangan Utama, Polines	\N	1000	published	f	\N	5200	\N	2026-06-29 06:38:55.163	\N	\N	\N
11	2	3	229	Lomba Inovasi Alat Kontrol Berbasis IoT untuk Pertanian Cerdas	lomba-inovasi-alat-kontrol-berbasis-iot-untuk-pertanian-cerdas	Konferensi dan lomba inovasi alat kontrol berbasis IoT yang dirancang khusus untuk mendukung pertanian cerdas di Indonesia.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event11/1200/600	Politeknik Negeri Semarang	2026-08-03 06:38:52.619	2026-08-04 06:38:52.619	2026-07-29 06:38:52.619	t	conference	offline	paid	100000	Gedung M-01, Jurusan Teknik Elektro, Polines	\N	80	published	f	\N	1600	\N	2026-06-29 06:38:55.168	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Lomba Inovasi A", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Lomba Inovasi A", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
12	2	2	229	Seminar Matematika Terapan: Pemodelan Data untuk Industri 4.0	seminar-matematika-terapan-pemodelan-data-untuk-industri-4-0	Seminar yang membahas penerapan matematika terapan dan pemodelan data dalam mendukung transformasi industri 4.0.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event12/1200/600	Politeknik Negeri Semarang	2026-08-18 06:38:52.619	2026-08-18 06:38:52.619	2026-08-13 06:38:52.619	t	seminar	hybrid	free	0	Aula Jurusan Teknik Sipil, Polines & Zoom	\N	200	published	f	\N	720	\N	2026-06-29 06:38:55.172	\N	\N	\N
13	2	4	229	Pelatihan Akuntansi Digital dan Perpajakan untuk Mahasiswa	pelatihan-akuntansi-digital-dan-perpajakan-untuk-mahasiswa	Pelatihan akuntansi digital menggunakan software akuntansi terkini dan pemahaman perpajakan bagi mahasiswa akuntansi.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event13/1200/600	Politeknik Negeri Semarang	2026-07-21 06:38:52.619	2026-07-22 06:38:52.619	2026-07-17 06:38:52.619	t	seminar	offline	paid	45000	Lab Komputer Jurusan Akuntansi, Polines	\N	120	published	f	\N	930	\N	2026-06-29 06:38:55.181	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Pelatihan Akunt", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Pelatihan Akunt", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
14	2	7	229	Pameran Seni Mahasiswa: Ekspresi Budaya Nusantara	pameran-seni-mahasiswa-ekspresi-budaya-nusantara	Pameran seni yang menampilkan karya-karya mahasiswa Polines dalam berbagai bentuk ekspresi budaya Nusantara.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event14/1200/600	Politeknik Negeri Semarang	2026-09-07 06:38:52.619	2026-09-10 06:38:52.619	2026-09-05 06:38:52.619	t	seminar	offline	free	0	Gedung Serbaguna, Polines	\N	500	published	f	\N	2100	\N	2026-06-29 06:38:55.189	\N	\N	\N
15	2	8	229	Seminar Hukum dan Sosial: Perlindungan Data Pribadi di Era Digital	seminar-hukum-dan-sosial-perlindungan-data-pribadi-di-era-digital	Seminar yang mengupas aspek hukum dan sosial terkait perlindungan data pribadi di tengah pesatnya transformasi digital.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event15/1200/600	Politeknik Negeri Semarang	2026-08-23 06:38:52.619	2026-08-23 06:38:52.619	2026-08-18 06:38:52.619	t	seminar	hybrid	free	0	Auditorium Teknik Kimia, Polines & Zoom	\N	300	published	f	\N	1340	\N	2026-06-29 06:38:55.2	\N	\N	\N
16	2	9	229	Workshop Pertanian Vertikal: Solusi Pangan Perkotaan	workshop-pertanian-vertikal-solusi-pangan-perkotaan	Workshop praktik pertanian vertikal (vertical farming) sebagai solusi ketahanan pangan di wilayah perkotaan.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event16/1200/600	Politeknik Negeri Semarang	2026-07-17 06:38:52.619	2026-07-17 06:38:52.619	2026-07-14 06:38:52.619	t	seminar	offline	paid	30000	Lahan Praktik Terpadu, Polines	\N	60	published	f	\N	580	\N	2026-06-29 06:38:55.209	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Workshop Pertan", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Workshop Pertan", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
17	2	10	229	Conference Inovasi Pembelajaran Vokasi Berbasis Teknologi	conference-inovasi-pembelajaran-vokasi-berbasis-teknologi	Konferensi nasional yang menghadirkan praktisi pendidikan vokasi untuk berbagi inovasi pembelajaran berbasis teknologi.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event17/1200/600	Politeknik Negeri Semarang	2026-10-02 06:38:52.619	2026-10-04 06:38:52.619	2026-09-22 06:38:52.619	t	conference	hybrid	paid	200000	Gedung Pusat Pembelajaran, Polines & Zoom	\N	250	published	f	\N	3800	\N	2026-06-29 06:38:55.217	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Conference Inov", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Conference Inov", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
18	2	3	229	Lomba Rancang Bangun Robot Line Follower Polines 2026	lomba-rancang-bangun-robot-line-follower-polines-2026	Kompetisi rancang bangun robot line follower antar mahasiswa se-Jawa Tengah sebagai ajang pengembangan talenta robotika.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event18/1200/600	Politeknik Negeri Semarang	2026-10-17 06:38:52.619	2026-10-18 06:38:52.619	2026-10-07 06:38:52.619	t	conference	offline	paid	75000	GOR Polines	\N	40	published	f	\N	2600	\N	2026-06-29 06:38:55.22	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Lomba Rancang B", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Lomba Rancang B", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
19	2	12	229	Seminar Kesehatan Mental untuk Mahasiswa: Stres Akademik dan Solusinya	seminar-kesehatan-mental-untuk-mahasiswa-stres-akademik-dan-solusinya	Seminar online tentang manajemen stres akademik dan pentingnya menjaga kesehatan mental bagi mahasiswa di perkuliahan.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event19/1200/600	Politeknik Negeri Semarang	2026-07-13 06:38:52.619	2026-07-13 06:38:52.619	2026-07-11 06:38:52.619	t	seminar	online	free	0	Zoom Webinar	\N	500	published	f	\N	1900	\N	2026-06-29 06:38:55.225	\N	\N	\N
20	2	1	229	Hackathon Pengembangan Aplikasi Smart Campus	hackathon-pengembangan-aplikasi-smart-campus	Hackathon 24 jam mengembangkan aplikasi smart campus berbasis mobile untuk meningkatkan layanan akademik dan non-akademik.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event20/1200/600	Politeknik Negeri Semarang	2026-09-17 06:38:52.619	2026-09-18 06:38:52.619	2026-09-12 06:38:52.619	t	conference	offline	paid	50000	Lab Coding Terpadu, Polines	\N	100	published	f	\N	3100	\N	2026-06-29 06:38:55.229	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Hackathon Penge", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Hackathon Penge", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
21	2	13	229	Seminar Filsafat Sains: Antara Rasionalisme dan Empirisme	seminar-filsafat-sains-antara-rasionalisme-dan-empirisme	Seminar yang mengajak peserta merenungkan landasan filosofis sains melalui perdebatan antara rasionalisme dan empirisme.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event21/1200/600	Politeknik Negeri Semarang	2026-08-10 06:38:52.619	2026-08-10 06:38:52.619	2026-08-08 06:38:52.619	t	seminar	online	free	0	Google Meet	\N	150	published	f	\N	440	\N	2026-06-29 06:38:55.233	\N	\N	\N
22	2	6	229	Workshop Penulisan Karya Ilmiah Berbahasa Inggris	workshop-penulisan-karya-ilmiah-berbahasa-inggris	Workshop teknik penulisan karya ilmiah dalam bahasa Inggris untuk publikasi jurnal internasional dan konferensi.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event22/1200/600	Politeknik Negeri Semarang	2026-08-01 06:38:52.619	2026-08-01 06:38:52.619	2026-07-29 06:38:52.619	t	seminar	offline	paid	25000	Ruang Seminar Jurusan Bahasa Inggris, Polines	\N	100	published	f	\N	680	\N	2026-06-29 06:38:55.237	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Workshop Penuli", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Workshop Penuli", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
23	2	5	229	Seminar Kesehatan Reproduksi Remaja untuk Mahasiswa Baru	seminar-kesehatan-reproduksi-remaja-untuk-mahasiswa-baru	Seminar edukasi kesehatan reproduksi remaja yang ditujukan bagi mahasiswa baru sebagai bekal menjalani kehidupan kampus.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event23/1200/600	Politeknik Negeri Semarang	2026-07-04 06:38:52.619	2026-07-04 06:38:52.619	2026-07-01 06:38:52.619	t	seminar	offline	free	0	Auditorium Utama, Polines	\N	350	published	f	\N	1200	\N	2026-06-29 06:38:55.241	\N	\N	\N
24	2	11	229	Call for Paper: Riset Terapan Bidang Teknik dan Vokasi	call-for-paper-riset-terapan-bidang-teknik-dan-vokasi	Call for paper nasional bidang riset terapan teknik dan vokasi, hasil seleksi akan dipublikasikan di jurnal terakreditasi.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event24/1200/600	Politeknik Negeri Semarang	2026-11-06 06:38:52.619	2026-11-08 06:38:52.619	2026-10-27 06:38:52.619	t	conference	hybrid	paid	350000	Gedung Pasca Sarjana, Polines & Zoom	\N	200	published	f	\N	4200	\N	2026-06-29 06:38:55.244	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Call for Paper:", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Call for Paper:", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
25	2	7	229	Festival Musik dan Budaya Mahasiswa Polines 2026	festival-musik-dan-budaya-mahasiswa-polines-2026	Festival musik dan budaya tahunan mahasiswa Polines yang menampilkan bakat seni dari berbagai jurusan.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event25/1200/600	Politeknik Negeri Semarang	2026-09-02 06:38:52.619	2026-09-03 06:38:52.619	2026-08-28 06:38:52.619	t	seminar	offline	paid	20000	Lapangan Utama, Polines	\N	1000	published	f	\N	4800	\N	2026-06-29 06:38:55.249	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Festival Musik ", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Festival Musik ", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
26	2	1	159	Jakarta AI Summit 2026: Masa Depan Kecerdasan Buatan	jakarta-ai-summit-2026-masa-depan-kecerdasan-buatan	Konferensi AI terbesar di Indonesia yang menghadirkan pembicara internasional dan lokal tentang perkembangan AI terkini.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event26/1200/600	Politeknik Negeri Semarang	2026-10-07 06:38:52.619	2026-10-09 06:38:52.619	2026-09-27 06:38:52.619	f	conference	offline	paid	500000	Jakarta Convention Center, Jakarta Selatan	\N	600	published	f	\N	8900	\N	2026-06-29 06:38:55.253	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Jakarta AI Summ", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Jakarta AI Summ", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
27	2	4	181	Bandung Creative Economy Festival 2026	bandung-creative-economy-festival-2026	Festival ekonomi kreatif Bandung yang menghadirkan workshop, talkshow, dan pameran produk kreatif dari para pelaku industri.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event27/1200/600	Politeknik Negeri Semarang	2026-08-13 06:38:52.619	2026-08-15 06:38:52.619	2026-08-08 06:38:52.619	f	seminar	hybrid	paid	150000	Gedung Merdeka, Bandung & Zoom	\N	400	published	f	\N	5600	\N	2026-06-29 06:38:55.256	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Bandung Creativ", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Bandung Creativ", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
28	2	5	183	Seminar Nasional Telemedicine dan Layanan Kesehatan Digital	seminar-nasional-telemedicine-dan-layanan-kesehatan-digital	Seminar nasional tentang perkembangan telemedicine dan transformasi layanan kesehatan digital pasca pandemi.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event28/1200/600	Politeknik Negeri Semarang	2026-07-24 06:38:52.619	2026-07-24 06:38:52.619	2026-07-21 06:38:52.619	f	seminar	online	free	0	Zoom Webinar	\N	1000	published	f	\N	3400	\N	2026-06-29 06:38:55.26	\N	\N	\N
29	2	10	216	Yogyakarta Educational Expo 2026	yogyakarta-educational-expo-2026	Pameran pendidikan terbesar di Yogyakarta yang menampilkan berbagai program studi, beasiswa, dan peluang karir.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event29/1200/600	Politeknik Negeri Semarang	2026-09-22 06:38:52.619	2026-09-24 06:38:52.619	2026-09-17 06:38:52.619	f	seminar	offline	free	0	Jogja Expo Center, Yogyakarta	\N	2000	published	f	\N	7200	\N	2026-06-29 06:38:55.263	\N	\N	\N
30	2	7	182	Festival Film Independen Indonesia 2026	festival-film-independen-indonesia-2026	Festival tahunan yang memutar film-film independen terbaik Indonesia serta diskusi dengan sineas dan kritikus film.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event30/1200/600	Politeknik Negeri Semarang	2026-09-12 06:38:52.619	2026-09-15 06:38:52.619	2026-09-07 06:38:52.619	f	seminar	offline	paid	50000	CGV Grand Indonesia, Jakarta	\N	300	published	f	\N	4500	\N	2026-06-29 06:38:55.267	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Festival Film I", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Festival Film I", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
31	2	9	188	Seminar Nasional Ketahanan Pangan dan Perubahan Iklim	seminar-nasional-ketahanan-pangan-dan-perubahan-iklim	Konferensi nasional yang membahas strategi ketahanan pangan di tengah dampak perubahan iklim global.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event31/1200/600	Politeknik Negeri Semarang	2026-10-22 06:38:52.619	2026-10-23 06:38:52.619	2026-10-12 06:38:52.619	f	conference	hybrid	paid	250000	Hotel Santika, Semarang & Zoom	\N	250	published	f	\N	2800	\N	2026-06-29 06:38:55.271	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Seminar Nasiona", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Seminar Nasiona", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
32	2	12	193	Workshop Mindfulness and Self Development for Professionals	workshop-mindfulness-and-self-development-for-professionals	Workshop pengembangan diri dan mindfulness untuk para profesional yang ingin meningkatkan produktivitas dan keseimbangan hidup.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event32/1200/600	Politeknik Negeri Semarang	2026-07-11 06:38:52.619	2026-07-11 06:38:52.619	2026-07-09 06:38:52.619	f	seminar	online	paid	99000	Google Meet	\N	100	published	f	\N	820	\N	2026-06-29 06:38:55.275	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Workshop Mindfu", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Workshop Mindfu", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
33	2	1	184	Seminar Startup Technology: Dari Ide hingga Exit Strategy	seminar-startup-technology-dari-ide-hingga-exit-strategy	Seminar yang membahas perjalanan startup teknologi dari ide awal, pendanaan, pengembangan produk, hingga strategi exit.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event33/1200/600	Politeknik Negeri Semarang	2026-08-06 06:38:52.619	2026-08-06 06:38:52.619	2026-08-03 06:38:52.619	f	seminar	offline	paid	125000	Co-Working Space, BSD City	\N	200	published	f	\N	2300	\N	2026-06-29 06:38:55.278	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Seminar Startup", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Seminar Startup", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
34	2	8	156	Simposium Nasional Anti Korupsi untuk Generasi Muda	simposium-nasional-anti-korupsi-untuk-generasi-muda	Simposium nasional yang mengajak generasi muda berperan aktif dalam gerakan anti korupsi dan transparansi publik.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event34/1200/600	Politeknik Negeri Semarang	2026-08-16 06:38:52.619	2026-08-16 06:38:52.619	2026-08-13 06:38:52.619	f	conference	offline	free	0	Gedung KPK, Jakarta Pusat	\N	400	published	f	\N	3600	\N	2026-06-29 06:38:55.283	\N	\N	\N
35	2	4	176	Financial Planning Bootcamp: Kelola Keuangan di Usia Muda	financial-planning-bootcamp-kelola-keuangan-di-usia-muda	Bootcamp perencanaan keuangan intensif untuk anak muda: investasi, budgeting, dan persiapan pensiun sejak dini.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event35/1200/600	Politeknik Negeri Semarang	2026-07-27 06:38:52.619	2026-07-28 06:38:52.619	2026-07-24 06:38:52.619	f	seminar	offline	paid	85000	Hotel Harris, Surabaya	\N	80	published	f	\N	1700	\N	2026-06-29 06:38:55.286	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Financial Plann", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Financial Plann", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
36	2	1	158	International Conference on Cybersecurity and Digital Forensics 2026	international-conference-on-cybersecurity-and-digital-forensics-2026	Konferensi internasional yang mempertemukan para ahli keamanan siber dan forensik digital dari berbagai negara.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event36/1200/600	Politeknik Negeri Semarang	2026-11-16 06:38:52.619	2026-11-19 06:38:52.619	2026-11-06 06:38:52.619	f	conference	hybrid	paid	450000	Hotel Pullman, Jakarta Barat & Zoom	\N	350	published	f	\N	6500	\N	2026-06-29 06:38:55.29	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia International C", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia International C", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
37	2	13	216	Seminar Moderasi Beragama di Era Digital	seminar-moderasi-beragama-di-era-digital	Seminar yang mengupas pentingnya moderasi beragama dan toleransi di tengah derasnya arus informasi digital.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event37/1200/600	Politeknik Negeri Semarang	2026-08-23 06:38:52.619	2026-08-23 06:38:52.619	2026-08-18 06:38:52.619	f	seminar	hybrid	free	0	Gedung UIN Sunan Kalijaga, Yogyakarta & Zoom	\N	300	published	f	\N	1500	\N	2026-06-29 06:38:55.294	\N	\N	\N
38	2	2	186	Publikasi Ilmiah Bootcamp: Dari Riset ke Jurnal Scopus	publikasi-ilmiah-bootcamp-dari-riset-ke-jurnal-scopus	Bootcamp online intensif yang membimbing peneliti dan akademisi dalam mempublikasikan riset ke jurnal bereputasi Scopus.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event38/1200/600	Politeknik Negeri Semarang	2026-07-19 06:38:52.619	2026-07-21 06:38:52.619	2026-07-14 06:38:52.619	f	seminar	online	paid	199000	Zoom Webinar	\N	150	published	f	\N	2100	\N	2026-06-29 06:38:55.298	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Publikasi Ilmia", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Publikasi Ilmia", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
39	2	3	181	Workshop Pemrograman Robot berbasis ROS untuk Pemula	workshop-pemrograman-robot-berbasis-ros-untuk-pemula	Workshop hands-on pemrograman robot menggunakan Robot Operating System (ROS) untuk pemula di bidang robotika.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event39/1200/600	Politeknik Negeri Semarang	2026-09-05 06:38:52.619	2026-09-06 06:38:52.619	2026-09-02 06:38:52.619	f	seminar	offline	paid	150000	Lab Robotika ITB, Bandung	\N	50	published	f	\N	1100	\N	2026-06-29 06:38:55.302	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia Workshop Pemrog", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia Workshop Pemrog", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
40	2	6	153	International Conference on Linguistics and Language Teaching	international-conference-on-linguistics-and-language-teaching	Konferensi internasional bidang linguistik dan pengajaran bahasa yang menghadirkan peneliti dari Asia Tenggara.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event40/1200/600	Politeknik Negeri Semarang	2026-10-12 06:38:52.619	2026-10-14 06:38:52.619	2026-10-02 06:38:52.619	f	conference	hybrid	paid	300000	Universitas Lampung, Bandar Lampung & Zoom	\N	200	published	f	\N	2400	\N	2026-06-29 06:38:55.305	\N	\N	[{"jenis": "bank_transfer", "atasNama": "Panitia International C", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia International C", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
41	2	5	176	Judul	judul-1782716974937	DEskripsi Event	syarat event	https://fciofv2srwuutfhq.public.blob.vercel-storage.com/uploads/banners/1782716968507_bmyckz.jpg	Politeknik Negeri Semarang	2026-07-14 03:00:00	2026-07-14 08:00:00	2026-07-13 16:59:00	t	conference	hybrid	paid	1000000	DEtail	\N	100	published	f	\N	2	\N	2026-06-29 14:09:34.946364	2026-06-29 07:11:15.134	\N	\N
6	2	11	12	International Symposium on Renewable Energy and Climate Change	international-symposium-on-renewable-energy-and-climate-change	Symposium riset inovasi energi terbarukan dan mitigasi perubahan iklim global.	1. Peserta wajib melakukan registrasi melalui website SISC.\n2. Peserta diharapkan hadir 15 menit sebelum acara dimulai untuk proses check-in.\n3. Wajib menunjukkan E-Ticket (QR Code) saat memasuki area acara.\n4. Menggunakan pakaian yang rapi, sopan, dan sesuai dengan tema acara.\n5. Peserta wajib menjaga ketertiban dan kebersihan selama acara berlangsung.\n6. Dilarang membawa senjata tajam, obat-obatan terlarang, atau benda berbahaya lainnya.\n7. Panitia berhak membatalkan keikutsertaan jika peserta melanggar aturan yang ditetapkan.\n8. Keputusan panitia bersifat mutlak dan tidak dapat diganggu gugat.	https://picsum.photos/seed/event6/1200/600	Politeknik Negeri Semarang	2026-11-26 06:38:52.619	2026-11-28 06:38:52.619	2026-11-16 06:38:52.619	f	conference	hybrid	paid	300000	Menara BCA Grand Indonesia, Jakarta	\N	400	published	f	\N	2100	\N	2026-06-29 06:38:55.141	\N	2026-06-29 07:15:48.123	[{"jenis": "bank_transfer", "atasNama": "Panitia International S", "nomorAkun": "8273645192", "namaPenyedia": "BCA"}, {"jenis": "e_wallet", "atasNama": "Panitia International S", "nomorAkun": "081234567890", "namaPenyedia": "Gopay"}]
\.


--
-- TOC entry 5208 (class 0 OID 16471)
-- Dependencies: 220
-- Data for Name: event_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_tag (event_id, tag_id) FROM stdin;
\.


--
-- TOC entry 5235 (class 0 OID 20522)
-- Dependencies: 247
-- Data for Name: favorit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorit (user_id, event_id, dibuat_pada) FROM stdin;
3	1	2026-06-29 13:38:55.346153
3	2	2026-06-29 13:38:55.349279
3	3	2026-06-29 13:38:55.351538
\.


--
-- TOC entry 5239 (class 0 OID 22787)
-- Dependencies: 251
-- Data for Name: info_pembayaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.info_pembayaran (id, tipe, nama_bank, nomor_rekening, pemilik_rekening, url_gambar_qris, aktif, dibuat_pada, diperbarui_pada) FROM stdin;
1	bank_transfer	Bank Mandiri	132-000-1234-567	Panitia POLIVENTS	\N	t	2026-06-29 13:38:55.314983	\N
2	qris	\N	\N	\N	https://picsum.photos/seed/qris/400/400	t	2026-06-29 13:38:55.314983	\N
\.


--
-- TOC entry 5210 (class 0 OID 16477)
-- Dependencies: 222
-- Data for Name: jadwal_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jadwal_event (id, event_id, waktu_mulai, waktu_selesai, deskripsi, dibuat_pada) FROM stdin;
\.


--
-- TOC entry 5212 (class 0 OID 16486)
-- Dependencies: 224
-- Data for Name: kategori; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kategori (id, nama, slug, url_ikon) FROM stdin;
1	Teknologi	teknologi	https://picsum.photos/seed/icon-teknologi/100/100
2	Sains & Matematika	sains-matematika	https://picsum.photos/seed/icon-sains/100/100
3	Teknik & Rekayasa	teknik-rekayasa	https://picsum.photos/seed/icon-teknologi/100/100
4	Bisnis & Ekonomi	bisnis-ekonomi	https://picsum.photos/seed/icon-bisnis/100/100
5	Kesehatan & Medis	kesehatan-medis	https://picsum.photos/seed/icon-kesehatan/100/100
6	Bahasa & Sastra	bahasa-sastra	https://picsum.photos/seed/icon-pendidikan/100/100
7	Seni & Budaya	seni-budaya	https://picsum.photos/seed/icon-seni/100/100
8	Sosial & Hukum	sosial-hukum	https://picsum.photos/seed/icon-pendidikan/100/100
9	Pertanian & Lingkungan	pertanian-lingkungan	https://picsum.photos/seed/icon-sains/100/100
10	Pendidikan	pendidikan	https://picsum.photos/seed/icon-pendidikan/100/100
11	Riset & Publikasi	riset-publikasi	https://picsum.photos/seed/icon-sains/100/100
12	Psikologi	psikologi	https://picsum.photos/seed/icon-kesehatan/100/100
13	Filsafat & Agama	filsafat-agama	https://picsum.photos/seed/icon-seni/100/100
\.


--
-- TOC entry 5214 (class 0 OID 16497)
-- Dependencies: 226
-- Data for Name: kota; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kota (id, provinsi_id, nama) FROM stdin;
1	1	Kabupaten Aceh Selatan
2	1	Kabupaten Aceh Tenggara
3	1	Kabupaten Aceh Timur
4	1	Kabupaten Aceh Tengah
5	1	Kabupaten Aceh Barat
6	1	Kabupaten Aceh Besar
7	1	Kabupaten Pidie
8	1	Kabupaten Aceh Utara
9	1	Kabupaten Simeulue
10	1	Kabupaten Aceh Singkil
11	1	Kabupaten Bireuen
12	1	Kabupaten Aceh Barat Daya
13	1	Kabupaten Gayo Lues
14	1	Kabupaten Aceh Jaya
15	1	Kabupaten Nagan Raya
16	1	Kabupaten Aceh Tamiang
17	1	Kabupaten Bener Meriah
18	1	Kabupaten Pidie Jaya
19	1	Kota Banda Aceh
20	1	Kota Sabang
21	1	Kota Lhokseumawe
22	1	Kota Langsa
23	1	Kota Subulussalam
24	2	Kabupaten Tapanuli Tengah
25	2	Kabupaten Tapanuli Utara
26	2	Kabupaten Tapanuli Selatan
27	2	Kabupaten Nias
28	2	Kabupaten Langkat
29	2	Kabupaten Karo
30	2	Kabupaten Deli Serdang
31	2	Kabupaten Simalungun
32	2	Kabupaten Asahan
33	2	Kabupaten Labuhanbatu
34	2	Kabupaten Dairi
35	2	Kabupaten Toba
36	2	Kabupaten Mandailing Natal
37	2	Kabupaten Nias Selatan
38	2	Kabupaten Pakpak Bharat
39	2	Kabupaten Humbang Hasundutan
40	2	Kabupaten Samosir
41	2	Kabupaten Serdang Bedagai
42	2	Kabupaten Batu Bara
43	2	Kabupaten Padang Lawas Utara
44	2	Kabupaten Padang Lawas
45	2	Kabupaten Labuhanbatu Selatan
46	2	Kabupaten Labuhanbatu Utara
47	2	Kabupaten Nias Utara
48	2	Kabupaten Nias Barat
49	2	Kota Medan
50	2	Kota Pematangsiantar
51	2	Kota Sibolga
52	2	Kota Tanjungbalai
53	2	Kota Binjai
54	2	Kota Tebing Tinggi
55	2	Kota Padangsidimpuan
56	2	Kota Gunungsitoli
57	3	Kabupaten Pesisir Selatan
58	3	Kabupaten Solok
59	3	Kabupaten Sijunjung
60	3	Kabupaten Tanah Datar
61	3	Kabupaten Padang Pariaman
62	3	Kabupaten Agam
63	3	Kabupaten Lima Puluh Kota
64	3	Kabupaten Pasaman
65	3	Kabupaten Kepulauan Mentawai
66	3	Kabupaten Dharmasraya
67	3	Kabupaten Solok Selatan
68	3	Kabupaten Pasaman Barat
69	3	Kota Padang
70	3	Kota Solok
71	3	Kota Sawahlunto
72	3	Kota Padang Panjang
73	3	Kota Bukittinggi
74	3	Kota Payakumbuh
75	3	Kota Pariaman
76	4	Kabupaten Kampar
77	4	Kabupaten Indragiri Hulu
78	4	Kabupaten Bengkalis
79	4	Kabupaten Indragiri Hilir
80	4	Kabupaten Pelalawan
81	4	Kabupaten Rokan Hulu
82	4	Kabupaten Rokan Hilir
83	4	Kabupaten Siak
84	4	Kabupaten Kuantan Singingi
85	4	Kabupaten Kepulauan Meranti
86	4	Kota Pekanbaru
87	4	Kota Dumai
88	5	Kabupaten Bintan
89	5	Kabupaten Karimun
90	5	Kabupaten Natuna
91	5	Kabupaten Lingga
92	5	Kabupaten Kepulauan Anambas
93	5	Kota Batam
94	5	Kota Tanjung Pinang
95	6	Kabupaten Kerinci
96	6	Kabupaten Merangin
97	6	Kabupaten Sarolangun
98	6	Kabupaten Batanghari
99	6	Kabupaten Muaro Jambi
100	6	Kabupaten Tanjung Jabung Barat
101	6	Kabupaten Tanjung Jabung Timur
102	6	Kabupaten Bungo
103	6	Kabupaten Tebo
104	6	Kota Jambi
105	6	Kota Sungai Penuh
106	7	Kabupaten Ogan Komering Ulu
107	7	Kabupaten Ogan Komering Ilir
108	7	Kabupaten Muara Enim
109	7	Kabupaten Lahat
110	7	Kabupaten Musi Rawas
111	7	Kabupaten Musi Banyuasin
112	7	Kabupaten Banyuasin
113	7	Kabupaten Ogan Komering Ulu Timur
114	7	Kabupaten Ogan Komering Ulu Selatan
115	7	Kabupaten Ogan Ilir
116	7	Kabupaten Empat Lawang
117	7	Kabupaten Penukal Abab Lematang Ilir
118	7	Kabupaten Musi Rawas Utara
119	7	Kota Palembang
120	7	Kota Pagar Alam
121	7	Kota Lubuk Linggau
122	7	Kota Prabumulih
123	8	Kabupaten Bangka
124	8	Kabupaten Belitung
125	8	Kabupaten Bangka Selatan
126	8	Kabupaten Bangka Tengah
127	8	Kabupaten Bangka Barat
128	8	Kabupaten Belitung Timur
129	8	Kota Pangkal Pinang
130	9	Kabupaten Bengkulu Selatan
131	9	Kabupaten Rejang Lebong
132	9	Kabupaten Bengkulu Utara
133	9	Kabupaten Kaur
134	9	Kabupaten Seluma
135	9	Kabupaten Mukomuko
136	9	Kabupaten Lebong
137	9	Kabupaten Kepahiang
138	9	Kabupaten Bengkulu Tengah
139	9	Kota Bengkulu
140	10	Kabupaten Lampung Selatan
141	10	Kabupaten Lampung Tengah
142	10	Kabupaten Lampung Utara
143	10	Kabupaten Lampung Barat
144	10	Kabupaten Tulang Bawang
145	10	Kabupaten Tanggamus
146	10	Kabupaten Lampung Timur
147	10	Kabupaten Way Kanan
148	10	Kabupaten Pesawaran
149	10	Kabupaten Pringsewu
150	10	Kabupaten Mesuji
151	10	Kabupaten Tulang Bawang Barat
152	10	Kabupaten Pesisir Barat
153	10	Kota Bandar Lampung
154	10	Kota Metro
155	11	Kabupaten Administrasi Kepulauan Seribu
156	11	Kota Administrasi Jakarta Pusat
157	11	Kota Administrasi Jakarta Utara
158	11	Kota Administrasi Jakarta Barat
159	11	Kota Administrasi Jakarta Selatan
160	11	Kota Administrasi Jakarta Timur
161	12	Kabupaten Bogor
162	12	Kabupaten Sukabumi
163	12	Kabupaten Cianjur
164	12	Kabupaten Bandung
165	12	Kabupaten Garut
166	12	Kabupaten Tasikmalaya
167	12	Kabupaten Ciamis
168	12	Kabupaten Kuningan
169	12	Kabupaten Cirebon
170	12	Kabupaten Majalengka
171	12	Kabupaten Sumedang
172	12	Kabupaten Indramayu
173	12	Kabupaten Subang
174	12	Kabupaten Purwakarta
175	12	Kabupaten Karawang
176	12	Kabupaten Bekasi
177	12	Kabupaten Bandung Barat
178	12	Kabupaten Pangandaran
179	12	Kota Bogor
180	12	Kota Sukabumi
181	12	Kota Bandung
182	12	Kota Cirebon
183	12	Kota Bekasi
184	12	Kota Depok
185	12	Kota Cimahi
186	12	Kota Tasikmalaya
187	12	Kota Banjar
188	13	Kabupaten Pandeglang
189	13	Kabupaten Lebak
190	13	Kabupaten Tangerang
191	13	Kabupaten Serang
192	13	Kota Tangerang
193	13	Kota Cilegon
194	13	Kota Serang
195	13	Kota Tangerang Selatan
196	14	Kabupaten Cilacap
197	14	Kabupaten Banyumas
198	14	Kabupaten Purbalingga
199	14	Kabupaten Banjarnegara
200	14	Kabupaten Kebumen
201	14	Kabupaten Purworejo
202	14	Kabupaten Wonosobo
203	14	Kabupaten Magelang
204	14	Kabupaten Boyolali
205	14	Kabupaten Klaten
206	14	Kabupaten Sukoharjo
207	14	Kabupaten Wonogiri
208	14	Kabupaten Karanganyar
209	14	Kabupaten Sragen
210	14	Kabupaten Grobogan
211	14	Kabupaten Blora
212	14	Kabupaten Rembang
213	14	Kabupaten Pati
214	14	Kabupaten Kudus
215	14	Kabupaten Jepara
216	14	Kabupaten Demak
217	14	Kabupaten Semarang
218	14	Kabupaten Temanggung
219	14	Kabupaten Kendal
220	14	Kabupaten Batang
221	14	Kabupaten Pekalongan
222	14	Kabupaten Pemalang
223	14	Kabupaten Tegal
224	14	Kabupaten Brebes
225	14	Kota Magelang
226	14	Kota Surakarta
227	14	Kota Salatiga
228	14	Kota Semarang
229	14	Kota Pekalongan
230	14	Kota Tegal
231	15	Kabupaten Kulon Progo
232	15	Kabupaten Bantul
233	15	Kabupaten Gunungkidul
234	15	Kabupaten Sleman
235	15	Kota Yogyakarta
236	16	Kabupaten Pacitan
237	16	Kabupaten Ponorogo
238	16	Kabupaten Trenggalek
239	16	Kabupaten Tulungagung
240	16	Kabupaten Blitar
241	16	Kabupaten Kediri
242	16	Kabupaten Malang
243	16	Kabupaten Lumajang
244	16	Kabupaten Jember
245	16	Kabupaten Banyuwangi
246	16	Kabupaten Bondowoso
247	16	Kabupaten Situbondo
248	16	Kabupaten Probolinggo
249	16	Kabupaten Pasuruan
250	16	Kabupaten Sidoarjo
251	16	Kabupaten Mojokerto
252	16	Kabupaten Jombang
253	16	Kabupaten Nganjuk
254	16	Kabupaten Madiun
255	16	Kabupaten Magetan
256	16	Kabupaten Ngawi
257	16	Kabupaten Bojonegoro
258	16	Kabupaten Tuban
259	16	Kabupaten Lamongan
260	16	Kabupaten Gresik
261	16	Kabupaten Bangkalan
262	16	Kabupaten Sampang
263	16	Kabupaten Pamekasan
264	16	Kabupaten Sumenep
265	16	Kota Kediri
266	16	Kota Blitar
267	16	Kota Malang
268	16	Kota Probolinggo
269	16	Kota Pasuruan
270	16	Kota Mojokerto
271	16	Kota Madiun
272	16	Kota Surabaya
273	16	Kota Batu
274	17	Kabupaten Jembrana
275	17	Kabupaten Tabanan
276	17	Kabupaten Badung
277	17	Kabupaten Gianyar
278	17	Kabupaten Klungkung
279	17	Kabupaten Bangli
280	17	Kabupaten Karangasem
281	17	Kabupaten Buleleng
282	17	Kota Denpasar
283	18	Kabupaten Lombok Barat
284	18	Kabupaten Lombok Tengah
285	18	Kabupaten Lombok Timur
286	18	Kabupaten Sumbawa
287	18	Kabupaten Dompu
288	18	Kabupaten Bima
289	18	Kabupaten Sumbawa Barat
290	18	Kabupaten Lombok Utara
291	18	Kota Mataram
292	18	Kota Bima
293	19	Kabupaten Kupang
294	19	Kabupaten Timor Tengah Selatan
295	19	Kabupaten Timor Tengah Utara
296	19	Kabupaten Belu
297	19	Kabupaten Alor
298	19	Kabupaten Flores Timur
299	19	Kabupaten Sikka
300	19	Kabupaten Ende
301	19	Kabupaten Ngada
302	19	Kabupaten Manggarai
303	19	Kabupaten Sumba Timur
304	19	Kabupaten Sumba Barat
305	19	Kabupaten Lembata
306	19	Kabupaten Rote Ndao
307	19	Kabupaten Manggarai Barat
308	19	Kabupaten Nagekeo
309	19	Kabupaten Sumba Tengah
310	19	Kabupaten Sumba Barat Daya
311	19	Kabupaten Manggarai Timur
312	19	Kabupaten Sabu Raijua
313	19	Kabupaten Malaka
314	19	Kota Kupang
315	20	Kabupaten Sambas
316	20	Kabupaten Mempawah
317	20	Kabupaten Sanggau
318	20	Kabupaten Ketapang
319	20	Kabupaten Sintang
320	20	Kabupaten Kapuas Hulu
321	20	Kabupaten Bengkayang
322	20	Kabupaten Landak
323	20	Kabupaten Sekadau
324	20	Kabupaten Melawi
325	20	Kabupaten Kayong Utara
326	20	Kabupaten Kubu Raya
327	20	Kota Pontianak
328	20	Kota Singkawang
329	21	Kabupaten Kotawaringin Barat
330	21	Kabupaten Kotawaringin Timur
331	21	Kabupaten Kapuas
332	21	Kabupaten Barito Selatan
333	21	Kabupaten Barito Utara
334	21	Kabupaten Katingan
335	21	Kabupaten Seruyan
336	21	Kabupaten Sukamara
337	21	Kabupaten Lamandau
338	21	Kabupaten Gunung Mas
339	21	Kabupaten Pulang Pisau
340	21	Kabupaten Murung Raya
341	21	Kabupaten Barito Timur
342	21	Kota Palangkaraya
343	22	Kabupaten Tanah Laut
344	22	Kabupaten Kotabaru
345	22	Kabupaten Banjar
346	22	Kabupaten Barito Kuala
347	22	Kabupaten Tapin
348	22	Kabupaten Hulu Sungai Selatan
349	22	Kabupaten Hulu Sungai Tengah
350	22	Kabupaten Hulu Sungai Utara
351	22	Kabupaten Tabalong
352	22	Kabupaten Tanah Bumbu
353	22	Kabupaten Balangan
354	22	Kota Banjarmasin
355	22	Kota Banjarbaru
356	23	Kabupaten Paser
357	23	Kabupaten Kutai Kartanegara
358	23	Kabupaten Berau
359	23	Kabupaten Kutai Barat
360	23	Kabupaten Kutai Timur
361	23	Kabupaten Penajam Paser Utara
362	23	Kabupaten Mahakam Ulu
363	23	Kota Balikpapan
364	23	Kota Samarinda
365	23	Kota Bontang
366	24	Kabupaten Bulungan
367	24	Kabupaten Malinau
368	24	Kabupaten Nunukan
369	24	Kabupaten Tana Tidung
370	24	Kota Tarakan
371	25	Kabupaten Bolaang Mongondow
372	25	Kabupaten Minahasa
373	25	Kabupaten Kepulauan Sangihe
374	25	Kabupaten Kepulauan Talaud
375	25	Kabupaten Minahasa Selatan
376	25	Kabupaten Minahasa Utara
377	25	Kabupaten Minahasa Tenggara
378	25	Kabupaten Bolaang Mongondow Utara
379	25	Kabupaten Kepulauan Siau Tagulandang Biaro
380	25	Kabupaten Bolaang Mongondow Timur
381	25	Kabupaten Bolaang Mongondow Selatan
382	25	Kota Manado
383	25	Kota Bitung
384	25	Kota Tomohon
385	25	Kota Kotamobagu
386	26	Kabupaten Banggai
387	26	Kabupaten Poso
388	26	Kabupaten Donggala
389	26	Kabupaten Toli-Toli
390	26	Kabupaten Buol
391	26	Kabupaten Morowali
392	26	Kabupaten Banggai Kepulauan
393	26	Kabupaten Parigi Moutong
394	26	Kabupaten Tojo Una Una
395	26	Kabupaten Sigi
396	26	Kabupaten Banggai Laut
397	26	Kabupaten Morowali Utara
398	26	Kota Palu
399	27	Kabupaten Kepulauan Selayar
400	27	Kabupaten Bulukumba
401	27	Kabupaten Bantaeng
402	27	Kabupaten Jeneponto
403	27	Kabupaten Takalar
404	27	Kabupaten Gowa
405	27	Kabupaten Sinjai
406	27	Kabupaten Bone
407	27	Kabupaten Maros
408	27	Kabupaten Pangkajene dan Kepulauan
409	27	Kabupaten Barru
410	27	Kabupaten Soppeng
411	27	Kabupaten Wajo
412	27	Kabupaten Sidenreng Rappang
413	27	Kabupaten Pinrang
414	27	Kabupaten Enrekang
415	27	Kabupaten Luwu
416	27	Kabupaten Tana Toraja
417	27	Kabupaten Luwu Utara
418	27	Kabupaten Luwu Timur
419	27	Kabupaten Toraja Utara
420	27	Kota Makassar
421	27	Kota Parepare
422	27	Kota Palopo
423	28	Kabupaten Kolaka
424	28	Kabupaten Konawe
425	28	Kabupaten Muna
426	28	Kabupaten Buton
427	28	Kabupaten Konawe Selatan
428	28	Kabupaten Bombana
429	28	Kabupaten Wakatobi
430	28	Kabupaten Kolaka Utara
431	28	Kabupaten Konawe Utara
432	28	Kabupaten Buton Utara
433	28	Kabupaten Kolaka Timur
434	28	Kabupaten Konawe Kepulauan
435	28	Kabupaten Muna Barat
436	28	Kabupaten Buton Tengah
437	28	Kabupaten Buton Selatan
438	28	Kota Kendari
439	28	Kota Bau Bau
440	29	Kabupaten Gorontalo
441	29	Kabupaten Boalemo
442	29	Kabupaten Bone Bolango
443	29	Kabupaten Pohuwato
444	29	Kabupaten Gorontalo Utara
445	29	Kota Gorontalo
446	30	Kabupaten Pasangkayu
447	30	Kabupaten Mamuju
448	30	Kabupaten Mamasa
449	30	Kabupaten Polewali Mandar
450	30	Kabupaten Majene
451	30	Kabupaten Mamuju Tengah
452	31	Kabupaten Maluku Tengah
453	31	Kabupaten Maluku Tenggara
454	31	Kabupaten Kepulauan Tanimbar
455	31	Kabupaten Buru
456	31	Kabupaten Seram Bagian Timur
457	31	Kabupaten Seram Bagian Barat
458	31	Kabupaten Kepulauan Aru
459	31	Kabupaten Maluku Barat Daya
460	31	Kabupaten Buru Selatan
461	31	Kota Ambon
462	31	Kota Tual
463	32	Kabupaten Halmahera Barat
464	32	Kabupaten Halmahera Tengah
465	32	Kabupaten Halmahera Utara
466	32	Kabupaten Halmahera Selatan
467	32	Kabupaten Kepulauan Sula
468	32	Kabupaten Halmahera Timur
469	32	Kabupaten Pulau Morotai
470	32	Kabupaten Pulau Taliabu
471	32	Kota Ternate
472	32	Kota Tidore Kepulauan
473	33	Kabupaten Jayapura
474	33	Kabupaten Kepulauan Yapen
475	33	Kabupaten Biak Numfor
476	33	Kabupaten Sarmi
477	33	Kabupaten Keerom
478	33	Kabupaten Waropen
479	33	Kabupaten Supiori
480	33	Kabupaten Mamberamo Raya
481	33	Kota Jayapura
482	34	Kabupaten Manokwari
483	34	Kabupaten Fak Fak
484	34	Kabupaten Teluk Bintuni
485	34	Kabupaten Teluk Wondama
486	34	Kabupaten Kaimana
487	34	Kabupaten Manokwari Selatan
488	34	Kabupaten Pegunungan Arfak
489	35	Kabupaten Merauke
490	35	Kabupaten Boven Digoel
491	35	Kabupaten Mappi
492	35	Kabupaten Asmat
493	36	Kabupaten Nabire
494	36	Kabupaten Puncak Jaya
495	36	Kabupaten Paniai
496	36	Kabupaten Mimika
497	36	Kabupaten Puncak
498	36	Kabupaten Dogiyai
499	36	Kabupaten Intan Jaya
500	36	Kabupaten Deiyai
501	37	Kabupaten Jayawijaya
502	37	Kabupaten Pegunungan Bintang
503	37	Kabupaten Yahukimo
504	37	Kabupaten Tolikara
505	37	Kabupaten Mamberamo Tengah
506	37	Kabupaten Yalimo
507	37	Kabupaten Lanny Jaya
508	37	Kabupaten Nduga
509	38	Kabupaten Sorong
510	38	Kabupaten Sorong Selatan
511	38	Kabupaten Raja Ampat
512	38	Kabupaten Tambrauw
513	38	Kabupaten Maybrat
514	38	Kota Sorong
\.


--
-- TOC entry 5216 (class 0 OID 16504)
-- Dependencies: 228
-- Data for Name: lampiran_event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lampiran_event (id, event_id, url_file, tipe_file, urutan, dibuat_pada) FROM stdin;
\.


--
-- TOC entry 5218 (class 0 OID 16513)
-- Dependencies: 230
-- Data for Name: log_admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_admin (id, admin_id, event_id, aksi, data_sebelumnya, dibuat_pada) FROM stdin;
\.


--
-- TOC entry 5245 (class 0 OID 23286)
-- Dependencies: 257
-- Data for Name: log_scraping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.log_scraping (id, target_url, sumber, status, jumlah_data, error_message, mulai_pada, selesai_pada) FROM stdin;
1	https://eventkampus.com	https://eventkampus.com	success	0	\N	2026-06-27 10:30:30.118	2026-06-27 10:30:31.247
2	https://eventkampus.com	https://eventkampus.com	success	75	\N	2026-06-27 10:30:44.998	2026-06-27 10:31:45.095
3	https://eventkampus.com	https://eventkampus.com	success	0	\N	2026-06-27 11:00:03.936	2026-06-27 11:00:04.56
4	https://infoseminar.id	https://infoseminar.id	success	0	\N	2026-06-27 11:00:21.957	2026-06-27 11:00:28.633
5	https://eventkampus.com	https://eventkampus.com	success	75	\N	2026-06-28 18:24:34.203	2026-06-28 18:25:55.524
6	https://eventkampus.com	https://eventkampus.com	success	75	\N	2026-06-28 18:37:57.778	2026-06-28 18:38:52.286
7	https://eventkampus.com	https://eventkampus.com	success	75	\N	2026-06-28 18:42:54.867	2026-06-28 18:44:44.843
8	https://eventkampus.com	https://eventkampus.com	success	75	\N	2026-06-28 18:49:35.057	2026-06-28 18:50:36.664
9	https://eventkampus.com	https://eventkampus.com	success	4	\N	2026-06-28 18:56:46.658	2026-06-28 18:58:24.745
10	https://eventkampus.com	https://eventkampus.com	success	4	\N	2026-06-28 19:04:58.134	2026-06-28 19:05:57.855
11	https://eventkampus.com	https://eventkampus.com	success	0	\N	2026-06-28 19:06:56.949	2026-06-28 19:06:57.754
12	https://eventkampus.com	https://eventkampus.com	success	0	\N	2026-06-28 19:07:05.545	2026-06-28 19:07:06.053
13	https://eventkampus.com	https://eventkampus.com	success	0	\N	2026-06-28 19:07:12.2	2026-06-28 19:07:12.462
14	https://infoseminar.id	https://infoseminar.id	success	0	\N	2026-06-28 19:07:19.454	2026-06-28 19:07:29.152
15	https://eventkampus.com	https://eventkampus.com	success	3	\N	2026-06-28 19:11:50.743	2026-06-28 19:12:52.235
16	https://eventkampus.com	https://eventkampus.com	success	0	\N	2026-06-28 19:16:51.557	2026-06-28 19:17:34.698
\.


--
-- TOC entry 5220 (class 0 OID 16523)
-- Dependencies: 232
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.otp_codes (id, email, code, kedaluwarsa_pada, dibuat_pada) FROM stdin;
\.


--
-- TOC entry 5222 (class 0 OID 16533)
-- Dependencies: 234
-- Data for Name: paper_submission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paper_submission (id, event_id, user_id, judul, url_file, status, komentar_penolakan, dibuat_pada, diperbarui_pada, kata_kunci, track, abstrak) FROM stdin;
1	4	3	Implementasi Edge Computing untuk Deteksi Kepadatan Parkir Real-time di Kampus	https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf	accepted	\N	2026-06-29 13:38:55.400099	\N	\N	\N	Penelitian ini mengimplementasikan edge computing untuk mendeteksi kepadatan parkir secara real-time di lingkungan kampus. Sistem menggunakan sensor kamera yang terintegrasi dengan perangkat edge untuk memproses data secara lokal, mengurangi latensi, dan meningkatkan efisiensi bandwidth.
2	5	3	Analisis Forensik Digital pada Serangan Ransomware di Infrastruktur Cloud	https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf	review	\N	2026-06-29 13:38:55.412408	\N	\N	\N	Penelitian ini menganalisis teknik forensik digital untuk mengidentifikasi dan melacak serangan ransomware pada infrastruktur cloud. Metode yang digunakan mencakup analisis log, memory forensics, dan network traffic analysis untuk mengungkap vektor serangan.
3	6	3	Pemanfaatan Blockchain untuk Keamanan Data Rekam Medis di Puskesmas	https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf	rejected	Metodologi penelitian pada bagian konsensus blockchain kurang mendalam untuk skala Puskesmas. Mohon perbaiki landasan teori.	2026-06-29 13:38:55.416985	\N	\N	\N	Penelitian ini mengeksplorasi penggunaan teknologi blockchain untuk mengamankan data rekam medis di Puskesmas. Sistem yang diusulkan menggunakan smart contract untuk mengontrol akses dan memastikan integritas data pasien.
4	41	9	Judul Paper	https://fciofv2srwuutfhq.public.blob.vercel-storage.com/uploads/papers/9_1782717256936.pdf	rejected	Alsan penolakan	2026-06-29 14:14:21.105093	2026-06-29 07:15:05.494	Teknik, Informastika	Data Science	Abstraskkkk
\.


--
-- TOC entry 5241 (class 0 OID 22798)
-- Dependencies: 253
-- Data for Name: pembicara; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pembicara (id, event_id, nama, peran, url_foto, dibuat_pada, diperbarui_pada) FROM stdin;
1	1	Dr. Eng. Ahmad Zaki	Industry 5.0 Specialist	https://picsum.photos/seed/speaker1/400/400	2026-06-29 13:38:55.114723	\N
2	2	Denny Santoso	Digital Marketing Mentor	https://picsum.photos/seed/speaker2/400/400	2026-06-29 13:38:55.1236	\N
3	3	dr. Tirta	Health Influencer & Doctor	https://picsum.photos/seed/speaker3/400/400	2026-06-29 13:38:55.129785	\N
4	4	Prof. Andrew Ng	AI Professor at Stanford	https://picsum.photos/seed/speaker4/400/400	2026-06-29 13:38:55.13656	\N
5	5	Sri Mulyani Indrawati	Minister of Finance RI	https://picsum.photos/seed/speaker5/400/400	2026-06-29 13:38:55.142529	\N
6	6	Dr. Eng. Masribah	Renewable Energy Researcher	https://picsum.photos/seed/speaker6/400/400	2026-06-29 13:38:55.148617	\N
7	7	Budi Santoso, CEH	Cybersecurity Analyst	https://picsum.photos/seed/speaker7/400/400	2026-06-29 13:38:55.157336	\N
8	8	Siti Aminah	Senior Product Designer	https://picsum.photos/seed/speaker8/400/400	2026-06-29 13:38:55.161341	\N
9	9	Andi Wijaya	Startup Founder & CEO	https://picsum.photos/seed/speaker9/400/400	2026-06-29 13:38:55.165637	\N
10	10	Diana Putri	HR Director Tech Co.	https://picsum.photos/seed/speaker10/400/400	2026-06-29 13:38:55.170462	\N
11	11	Ir. Haryanto, M.T.	IoT Researcher	https://picsum.photos/seed/speaker11/400/400	2026-06-29 13:38:55.174218	\N
12	12	Prof. Dr. Sutrisno, M.Sc.	Applied Mathematician	https://picsum.photos/seed/speaker12/400/400	2026-06-29 13:38:55.183145	\N
13	13	Rina Marlina, S.E., Ak.	Certified Accountant	https://picsum.photos/seed/speaker13/400/400	2026-06-29 13:38:55.191481	\N
14	14	Eko Priyanto, S.Sn.	Curator & Artist	https://picsum.photos/seed/speaker14/400/400	2026-06-29 13:38:55.199843	\N
15	15	Dr. Yuliana Hapsari, S.H., M.H.	Legal Expert	https://picsum.photos/seed/speaker15/400/400	2026-06-29 13:38:55.209353	\N
16	16	Ir. Slamet Riyadi	Agriculture Specialist	https://picsum.photos/seed/speaker16/400/400	2026-06-29 13:38:55.219346	\N
17	17	Prof. Dr. Eng. Agus Supriyanto	Vocational Education Expert	https://picsum.photos/seed/speaker17/400/400	2026-06-29 13:38:55.222592	\N
18	18	M. Fauzi, S.T., M.T.	Robotics Engineer	https://picsum.photos/seed/speaker18/400/400	2026-06-29 13:38:55.227473	\N
19	19	dr. Ratna Dewi, Sp.KJ	Clinical Psychologist	https://picsum.photos/seed/speaker19/400/400	2026-06-29 13:38:55.231541	\N
20	20	Dimas Ardianto	Full Stack Developer	https://picsum.photos/seed/speaker20/400/400	2026-06-29 13:38:55.236024	\N
21	21	Dr. Ahmad Dahlan, M.Hum.	Philosophy Lecturer	https://picsum.photos/seed/speaker21/400/400	2026-06-29 13:38:55.239197	\N
22	22	Dr. Nina Wulandari, M.Pd.	Academic Writing Specialist	https://picsum.photos/seed/speaker22/400/400	2026-06-29 13:38:55.243445	\N
23	23	dr. Citra Amelia, M.Kes.	Reproductive Health Specialist	https://picsum.photos/seed/speaker23/400/400	2026-06-29 13:38:55.247169	\N
24	24	Prof. Dr. Ir. Bambang Winardi, M.T.	Research Professor	https://picsum.photos/seed/speaker24/400/400	2026-06-29 13:38:55.251259	\N
25	25	Gita Savitar	Musician & Content Creator	https://picsum.photos/seed/speaker25/400/400	2026-06-29 13:38:55.255231	\N
26	26	Dr. Yann LeCun (Keynote)	Chief AI Scientist, Meta	https://picsum.photos/seed/speaker26/400/400	2026-06-29 13:38:55.259325	\N
27	27	Rudy Setiawan	Creative Economy Practitioner	https://picsum.photos/seed/speaker27/400/400	2026-06-29 13:38:55.2625	\N
28	28	dr. Nadia Octavia, MARS	Digital Health Expert	https://picsum.photos/seed/speaker28/400/400	2026-06-29 13:38:55.265614	\N
29	29	Prof. Dr. Ir. Muhammad Riza	Education Consultant	https://picsum.photos/seed/speaker29/400/400	2026-06-29 13:38:55.26995	\N
30	30	Garin Nugroho	Filmmaker	https://picsum.photos/seed/speaker30/400/400	2026-06-29 13:38:55.273566	\N
31	31	Dr. Ir. Hadi Susanto, M.Agr.	Food Security Expert	https://picsum.photos/seed/speaker31/400/400	2026-06-29 13:38:55.277267	\N
32	32	Rangga Wirawan, M.Psi.	Life Coach & Psychologist	https://picsum.photos/seed/speaker32/400/400	2026-06-29 13:38:55.280929	\N
33	33	William Tanuwijaya	Founder & CEO Tech Startup	https://picsum.photos/seed/speaker33/400/400	2026-06-29 13:38:55.285253	\N
34	34	Dr. Nurhayati, S.H., M.H.	Anti-Corruption Activist	https://picsum.photos/seed/speaker34/400/400	2026-06-29 13:38:55.289057	\N
35	35	Ayu Lestari, CFP	Financial Planner	https://picsum.photos/seed/speaker35/400/400	2026-06-29 13:38:55.292439	\N
36	36	Prof. Eugene Kaspersky	Cybersecurity Expert	https://picsum.photos/seed/speaker36/400/400	2026-06-29 13:38:55.296412	\N
37	37	Prof. Dr. Quraish Shihab	Islamic Scholar	https://picsum.photos/seed/speaker37/400/400	2026-06-29 13:38:55.300164	\N
38	38	Prof. Dr. Siti Zubaidah, M.Pd.	Scopus Reviewer	https://picsum.photos/seed/speaker38/400/400	2026-06-29 13:38:55.304639	\N
39	39	Fadhlur Rahman, S.T., M.T.	Robotics Researcher	https://picsum.photos/seed/speaker39/400/400	2026-06-29 13:38:55.308123	\N
40	40	Prof. Dr. Jufrizal, M.Hum.	Linguistics Professor	https://picsum.photos/seed/speaker40/400/400	2026-06-29 13:38:55.311613	\N
\.


--
-- TOC entry 5224 (class 0 OID 16544)
-- Dependencies: 236
-- Data for Name: pendaftaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pendaftaran (id, event_id, user_id, kode_pendaftaran, status, dibuat_pada, diperbarui_pada, dihapus_pada, bukti_pembayaran, metode_pembayaran_id, total_harga, alasan_penolakan) FROM stdin;
1	1	4	REG-1-001	terdaftar	2026-06-29 13:38:55.359354	\N	\N	https://picsum.photos/seed/payment1/800/600	\N	0	\N
2	1	5	REG-1-002	hadir	2026-06-29 13:38:55.372793	\N	\N	https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf	\N	0	\N
3	4	3	REG-SC-001	terdaftar	2026-06-29 13:38:55.381256	\N	\N	https://picsum.photos/seed/payment_reg/800/600	\N	0	\N
4	5	3	REG-CS-002	terdaftar	2026-06-29 13:38:55.387125	\N	\N	https://picsum.photos/seed/payment_reg/800/600	\N	0	\N
5	6	3	REG-EH-003	terdaftar	2026-06-29 13:38:55.392272	\N	\N	https://picsum.photos/seed/payment_reg/800/600	\N	0	\N
6	41	9	REG-41-9-1782717152053	hadir	2026-06-29 07:12:32.053	2026-06-29 07:13:03.663	\N	https://fciofv2srwuutfhq.public.blob.vercel-storage.com/uploads/payments/9_1782717149439.jpg	\N	0	\N
\.


--
-- TOC entry 5243 (class 0 OID 22808)
-- Dependencies: 255
-- Data for Name: penulis_paper; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.penulis_paper (id, paper_submission_id, nama, email, institusi, urutan, dibuat_pada, is_corresponding) FROM stdin;
1	1	Ahmad Rizki	penulis1@example.com	Politeknik Negeri Semarang	1	2026-06-29 13:38:55.405045	f
2	1	Dr. Sujatmiko	penulis2@example.com	Politeknik Negeri Semarang	2	2026-06-29 13:38:55.409661	f
3	1	Sarah Amelia	penulis3@example.com	Politeknik Negeri Semarang	3	2026-06-29 13:38:55.410963	f
4	2	Ahmad Rizki	penulis1@example.com	Politeknik Negeri Semarang	1	2026-06-29 13:38:55.413858	f
5	2	Prof. Budi Santoso	penulis2@example.com	Politeknik Negeri Semarang	2	2026-06-29 13:38:55.415039	f
6	3	Ahmad Rizki	penulis1@example.com	Politeknik Negeri Semarang	1	2026-06-29 13:38:55.420734	f
7	3	dr. Tirta	penulis2@example.com	Politeknik Negeri Semarang	2	2026-06-29 13:38:55.423692	f
8	4	Mochamad FAqih Ardiansyah	mofaqihardiansyah@gmail.com	intasni1	1	2026-06-29 14:14:21.136923	t
9	4	Ardi Ardi		intasnoi	2	2026-06-29 14:14:21.136923	f
\.


--
-- TOC entry 5226 (class 0 OID 16555)
-- Dependencies: 238
-- Data for Name: peserta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.peserta (id, pendaftaran_id, kode_peserta, nama_lengkap, email, nomor_telepon, jenis_kelamin, user_id, dibuat_pada, diperbarui_pada) FROM stdin;
1	1	P-1-001	Dewi Anggraini	dewi.anggraini@gmail.com	082111222337	Perempuan	\N	2026-06-29 13:38:55.363897	\N
2	2	P-1-002	Fajar Setiawan	fajar.setiawan@gmail.com	082111222337	Laki-laki	\N	2026-06-29 13:38:55.374804	\N
3	3	PS-REG-SC-001	Pengunjung	visitor@gmail.com	081234567892	Laki-laki	\N	2026-06-29 13:38:55.383397	\N
4	4	PS-REG-CS-002	Pengunjung	visitor@gmail.com	081234567892	Laki-laki	\N	2026-06-29 13:38:55.388874	\N
5	5	PS-REG-EH-003	Pengunjung	visitor@gmail.com	081234567892	Laki-laki	\N	2026-06-29 13:38:55.393907	\N
6	6	PES-41-9-852	Mochamad Faqih Ardiansyah	mofaqihardiansyah@gmail.com	+6282327655735	Laki-laki	\N	2026-06-29 14:12:32.053428	\N
\.


--
-- TOC entry 5228 (class 0 OID 16567)
-- Dependencies: 240
-- Data for Name: profil_penyelenggara; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.profil_penyelenggara (id, user_id, nama_instansi, deskripsi_instansi, url_dokumen_legalitas, url_website, dibuat_pada, diperbarui_pada, alasan_penolakan) FROM stdin;
1	2	Politeknik Negeri Semarang	Perguruan tinggi vokasi terkemuka.	\N	\N	2026-06-29 13:38:55.322732	\N	\N
\.


--
-- TOC entry 5230 (class 0 OID 16579)
-- Dependencies: 242
-- Data for Name: provinsi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.provinsi (id, nama) FROM stdin;
1	Aceh
2	Sumatera Utara
3	Sumatera Barat
4	Riau
5	Kepulauan Riau
6	Jambi
7	Sumatera Selatan
8	Kepulauan Bangka Belitung
9	Bengkulu
10	Lampung
11	DKI Jakarta
12	Jawa Barat
13	Banten
14	Jawa Tengah
15	DI Yogyakarta
16	Jawa Timur
17	Bali
18	Nusa Tenggara Barat
19	Nusa Tenggara Timur
20	Kalimantan Barat
21	Kalimantan Tengah
22	Kalimantan Selatan
23	Kalimantan Timur
24	Kalimantan Utara
25	Sulawesi Utara
26	Sulawesi Tengah
27	Sulawesi Selatan
28	Sulawesi Tenggara
29	Gorontalo
30	Sulawesi Barat
31	Maluku
32	Maluku Utara
33	Papua
34	Papua Barat
35	Papua Selatan
36	Papua Tengah
37	Papua Pegunungan
38	Papua Barat Daya
\.


--
-- TOC entry 5247 (class 0 OID 23298)
-- Dependencies: 259
-- Data for Name: raw_scraped_data; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.raw_scraped_data (id, sumber, url_target, data, status_integrasi, dibuat_pada, status) FROM stdin;
4	https://eventkampus.com	https://eventkampus.com/event/detail/4442/webinar-nasional-ekspedisi-seribu-pulau-4-2023	{"_raw": {"harga": 0, "judul": "WEBINAR NASIONAL EKSPEDISI SERIBU PULAU #4 2023", "kuota": null, "deskripsi": "<p>Kapal Ekspedisi Proudly Present💫</p><p>WEBINAR NASIONAL EKSPEDISI SERIBU PULAU #4 2023</p><p><br></p><p>Assalamu'alaikum Warahmatullahi Wabarakatuh✨</p><p>Hallo, para pemuda Indonesia 👋🏻</p><p><br></p><p>Amnesia historis menjadikan generasi pemuda lupa akan budayanya, yang paling fatal adalah lupa akan jati dirinya, insecure terhadap bangsa dan agamanya sendiri. Pada akhirnya terciptalah generasi ikut-ikutan dan masih main-main dengan amanah peradaban umat yang sangat besar ini. Oleh karena, itu alumni ESP4 di Bayan, Lombok Utara, menginisiasi diskursus \\" Eksistensi dan Harmoni Manusia, Agama, dan Budaya di Pulau Seribu Masjid\\" Sebagai respons atas krisisnya jati diri seorang Khalifah serta mendalami nilai hidup Gumi Sasak dengan kekuatan budaya agamanya.</p><p><br></p><p>😊 Yuk gabung dengan acara kita. 🤩🙌🏻 Webinar Nasional Pasca ESP#4</p><p><br></p><p>📢 *Terbuka Untuk Umum*</p><p>Yang akan di laksanakan pada :</p><p>🗓️Hari , tanggal : Sabtu , 1 April 2023</p><p>🕗Pukul : 07.30 WIB s.d selesai</p><p>👇🏻Link Pendaftaran :</p><p>http://bit.ly/PendaftaranWebinarESP4</p><p>http://bit.ly/PendaftaranWebinarESP4</p><p>http://bit.ly/PendaftaranWebinarESP4</p><p><br></p><p>📝Dengan tema :</p><p>\\" _Eksistensi dan Harmoni Manusia, Agama, dan Budaya di Pulau Seribu Masjid_ \\"</p><p><br></p><p>Bersama para tokoh luar biasa :</p><p>🗣️Keynote speaker :</p><p>*Dr. H. Zulkieflimansyah, P.hD.*</p><p>(Gubernur Nusa Tenggara Barat)</p><p>🗣️ Narasumber 1 :</p><p>*Dr. H. Najmul Achyar, M.H*</p><p>- Bupati KLU 2015-2020</p><p>- Pegiat Budaya dan Tokoh Nahdlatul Wathan</p><p>🗣️ Narasumber 2 :</p><p>*Raden Sawinggih, S.Sos*</p><p>- Penggiat Budaya, pariwisata berkelanjutan, seni tradisional.</p><p>- Penulis Buku Bayan untuk Indonesia Inklusif</p><p>🗣️ Guess Star ⭐</p><p>🗣️ Moderator :</p><p>*Farid Abdul Hakim, S.Pd.I.*</p><p><br></p><p>*Benefit :*</p><p>📚Ilmu yang bermanfaat</p><p>👥Relasi se Nusantara</p><p>📧E-sertifikat Nasional</p><p>🎉Doorprize Menarik</p><p><br></p><p>*Link Twibbon*</p><p>https://twb.nz/twbwebnaske</p><p>https://twb.nz/twbwebnaske</p><p><br></p><p>☎️ *Contact Person:*</p><p>+62 856-6899-7132 (Rizal Tri Bimantoro)</p><p><br></p><p>Let's Joint 🥳</p><p>IG : @kapalekspedisi</p><p><br></p><p>_Wassalamu'laikum Warohmatullahi Wabarakatuh_</p><p><br></p><p>#kapalekspedisi #givesociety</p><p>#islamicvolunteer #ekspedisiseribupulau</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom", "linkEksternal": "https://eventkampus.com/event/detail/4442/webinar-nasional-ekspedisi-seribu-pulau-4-2023", "tanggalMentah": "01  - 01 Apr 2023", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "http://bit.ly/PendaftaranWebinarESP4http://bit.ly/PendaftaranWebinarESP4http://bit.ly/PendaftaranWebinarESP4📝Dengan"}, "harga": 0, "judul": "WEBINAR NASIONAL EKSPEDISI SERIBU PULAU #4 2023", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.131Z", "deskripsi": "<p>Kapal Ekspedisi Proudly Present💫</p><p>WEBINAR NASIONAL EKSPEDISI SERIBU PULAU #4 2023</p><p><br></p><p>Assalamu'alaikum Warahmatullahi Wabarakatuh✨</p><p>Hallo, para pemuda Indonesia 👋🏻</p><p><br></p><p>Amnesia historis menjadikan generasi pemuda lupa akan budayanya, yang paling fatal adalah lupa akan jati dirinya, insecure terhadap bangsa dan agamanya sendiri. Pada akhirnya terciptalah generasi ikut-ikutan dan masih main-main dengan amanah peradaban umat yang sangat besar ini. Oleh karena, itu alumni ESP4 di Bayan, Lombok Utara, menginisiasi diskursus \\" Eksistensi dan Harmoni Manusia, Agama, dan Budaya di Pulau Seribu Masjid\\" Sebagai respons atas krisisnya jati diri seorang Khalifah serta mendalami nilai hidup Gumi Sasak dengan kekuatan budaya agamanya.</p><p><br></p><p>😊 Yuk gabung dengan acara kita. 🤩🙌🏻 Webinar Nasional Pasca ESP#4</p><p><br></p><p>📢 *Terbuka Untuk Umum*</p><p>Yang akan di laksanakan pada :</p><p>🗓️Hari , tanggal : Sabtu , 1 April 2023</p><p>🕗Pukul : 07.30 WIB s.d selesai</p><p>👇🏻Link Pendaftaran :</p><p>http://bit.ly/PendaftaranWebinarESP4</p><p>http://bit.ly/PendaftaranWebinarESP4</p><p>http://bit.ly/PendaftaranWebinarESP4</p><p><br></p><p>📝Dengan tema :</p><p>\\" _Eksistensi dan Harmoni Manusia, Agama, dan Budaya di Pulau Seribu Masjid_ \\"</p><p><br></p><p>Bersama para tokoh luar biasa :</p><p>🗣️Keynote speaker :</p><p>*Dr. H. Zulkieflimansyah, P.hD.*</p><p>(Gubernur Nusa Tenggara Barat)</p><p>🗣️ Narasumber 1 :</p><p>*Dr. H. Najmul Achyar, M.H*</p><p>- Bupati KLU 2015-2020</p><p>- Pegiat Budaya dan Tokoh Nahdlatul Wathan</p><p>🗣️ Narasumber 2 :</p><p>*Raden Sawinggih, S.Sos*</p><p>- Penggiat Budaya, pariwisata berkelanjutan, seni tradisional.</p><p>- Penulis Buku Bayan untuk Indonesia Inklusif</p><p>🗣️ Guess Star ⭐</p><p>🗣️ Moderator :</p><p>*Farid Abdul Hakim, S.Pd.I.*</p><p><br></p><p>*Benefit :*</p><p>📚Ilmu yang bermanfaat</p><p>👥Relasi se Nusantara</p><p>📧E-sertifikat Nasional</p><p>🎉Doorprize Menarik</p><p><br></p><p>*Link Twibbon*</p><p>https://twb.nz/twbwebnaske</p><p>https://twb.nz/twbwebnaske</p><p><br></p><p>☎️ *Contact Person:*</p><p>+62 856-6899-7132 (Rizal Tri Bimantoro)</p><p><br></p><p>Let's Joint 🥳</p><p>IG : @kapalekspedisi</p><p><br></p><p>_Wassalamu'laikum Warohmatullahi Wabarakatuh_</p><p><br></p><p>#kapalekspedisi #givesociety</p><p>#islamicvolunteer #ekspedisiseribupulau</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom", "tanggalMulai": "2023-03-31T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4442/webinar-nasional-ekspedisi-seribu-pulau-4-2023", "tanggalMentah": "01  - 01 Apr 2023", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "http://bit.ly/PendaftaranWebinarESP4http://bit.ly/PendaftaranWebinarESP4http://bit.ly/PendaftaranWebinarESP4📝Dengan", "tanggalSelesai": "2023-03-31T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.640603	processed
10	https://eventkampus.com	https://eventkampus.com/event/detail/4414/go-scholarship-2022	{"_raw": {"harga": 0, "judul": "Go Scholarship 2022", "kuota": null, "deskripsi": "<p>🎓𝐎𝐩𝐞𝐧 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢𝐨𝐧 𝐆𝐨 𝐒𝐜𝐡𝐨𝐥𝐚𝐫𝐬𝐡𝐢𝐩 𝟐𝟎𝟐𝟐🎓</p><p><br></p><p>Go Scholarship 2022 proudly present</p><p>“𝙀𝙣𝙧𝙞𝙘𝙝 𝙮𝙤𝙪𝙧 𝘼𝙗𝙞𝙡𝙞𝙩𝙮, 𝙐𝙣𝙡𝙤𝙘𝙠 𝙮𝙤𝙪𝙧 𝙣𝙚𝙬 𝙊𝙥𝙥𝙤𝙧𝙩𝙪𝙣𝙞𝙩𝙮”</p><p>An Inspiring with our awardees from several well-known scholarships and “𝐏𝐚𝐫𝐚𝐦𝐚 𝐏𝐫𝐚𝐝𝐚𝐧𝐚 𝐒𝐮𝐭𝐞𝐣𝐚” as our guest star!</p><p><br></p><p>Event will be held on:</p><p>📅 : November 5th, 2022</p><p>⏰ : 09.00 WIB</p><p>📍 : Zoom Meeting</p><p><br></p><p>𝐅𝐑𝐄𝐄 𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐀𝐓𝐈𝐎𝐍&nbsp;❗</p><p>𝐓𝐡𝐢𝐬 𝐞𝐯𝐞𝐧𝐭 𝐢𝐬 𝐨𝐩𝐞𝐧 𝐟𝐨𝐫 𝐩𝐮𝐛𝐥𝐢𝐜.</p><p><br></p><p>So, what are you waiting for? It's free!</p><p>Register now and start to level up your education ✨</p><p>https://linktr.ee/goscholarship2022</p><p><br></p><p><br></p><p>✨𝗙𝗼𝗿 𝗳𝘂𝘁𝗵𝗲𝗿 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻, 𝗰𝗵𝗲𝗰𝗸 𝗼𝘂𝗿 𝗦𝗼𝗰𝗶𝗮𝗹 𝗠𝗲𝗱𝗶𝗮 𝗮𝗻𝗱 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝗣𝗲𝗿𝘀𝗼𝗻 𝗯𝗲𝗹𝗼𝘄 ✨:</p><p>Instagram: @Goscholarship2022</p><p>LinkedIn: Go Scholarship2022</p><p>TikTok: @Go_Scholarship</p><p><br></p><p>𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐏𝐞𝐫𝐬𝐨𝐧 :&nbsp;</p><p>Ivana : 082214973852 (WA)</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;adhila_nasywaa (LINE)</p><p>Erfina : 081907120457 (WA)</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;finaabfdl (LINE)</p><p><br></p><p>______</p><p>Departemen Adkesma</p><p><br></p><p><br></p><p><br></p><p>#GoScholarship2022</p><p>#KabinetSinergiCita</p><p>#BEMFEBUNAIR2022</p><p>#FEBSatu</p><p>#UNAIRHEBAT</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4414/go-scholarship-2022", "tanggalMentah": "05  - 05 Nov 2022", "teleponKontak": "082214973852", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "Go Scholarship 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.389Z", "deskripsi": "<p>🎓𝐎𝐩𝐞𝐧 𝐑𝐞𝐠𝐢𝐬𝐭𝐫𝐚𝐭𝐢𝐨𝐧 𝐆𝐨 𝐒𝐜𝐡𝐨𝐥𝐚𝐫𝐬𝐡𝐢𝐩 𝟐𝟎𝟐𝟐🎓</p><p><br></p><p>Go Scholarship 2022 proudly present</p><p>“𝙀𝙣𝙧𝙞𝙘𝙝 𝙮𝙤𝙪𝙧 𝘼𝙗𝙞𝙡𝙞𝙩𝙮, 𝙐𝙣𝙡𝙤𝙘𝙠 𝙮𝙤𝙪𝙧 𝙣𝙚𝙬 𝙊𝙥𝙥𝙤𝙧𝙩𝙪𝙣𝙞𝙩𝙮”</p><p>An Inspiring with our awardees from several well-known scholarships and “𝐏𝐚𝐫𝐚𝐦𝐚 𝐏𝐫𝐚𝐝𝐚𝐧𝐚 𝐒𝐮𝐭𝐞𝐣𝐚” as our guest star!</p><p><br></p><p>Event will be held on:</p><p>📅 : November 5th, 2022</p><p>⏰ : 09.00 WIB</p><p>📍 : Zoom Meeting</p><p><br></p><p>𝐅𝐑𝐄𝐄 𝐑𝐄𝐆𝐈𝐒𝐓𝐑𝐀𝐓𝐈𝐎𝐍&nbsp;❗</p><p>𝐓𝐡𝐢𝐬 𝐞𝐯𝐞𝐧𝐭 𝐢𝐬 𝐨𝐩𝐞𝐧 𝐟𝐨𝐫 𝐩𝐮𝐛𝐥𝐢𝐜.</p><p><br></p><p>So, what are you waiting for? It's free!</p><p>Register now and start to level up your education ✨</p><p>https://linktr.ee/goscholarship2022</p><p><br></p><p><br></p><p>✨𝗙𝗼𝗿 𝗳𝘂𝘁𝗵𝗲𝗿 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻, 𝗰𝗵𝗲𝗰𝗸 𝗼𝘂𝗿 𝗦𝗼𝗰𝗶𝗮𝗹 𝗠𝗲𝗱𝗶𝗮 𝗮𝗻𝗱 𝗖𝗼𝗻𝘁𝗮𝗰𝘁 𝗣𝗲𝗿𝘀𝗼𝗻 𝗯𝗲𝗹𝗼𝘄 ✨:</p><p>Instagram: @Goscholarship2022</p><p>LinkedIn: Go Scholarship2022</p><p>TikTok: @Go_Scholarship</p><p><br></p><p>𝐂𝐨𝐧𝐭𝐚𝐜𝐭 𝐏𝐞𝐫𝐬𝐨𝐧 :&nbsp;</p><p>Ivana : 082214973852 (WA)</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;adhila_nasywaa (LINE)</p><p>Erfina : 081907120457 (WA)</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;finaabfdl (LINE)</p><p><br></p><p>______</p><p>Departemen Adkesma</p><p><br></p><p><br></p><p><br></p><p>#GoScholarship2022</p><p>#KabinetSinergiCita</p><p>#BEMFEBUNAIR2022</p><p>#FEBSatu</p><p>#UNAIRHEBAT</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-11-04T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4414/go-scholarship-2022", "tanggalMentah": "05  - 05 Nov 2022", "teleponKontak": "082214973852", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-11-04T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.682501	processed
8	https://eventkampus.com	https://eventkampus.com/event/detail/4419/seminar-nasional-fisioterapi-universitas-airlangga-2022	{"_raw": {"harga": 0, "judul": "SEMINAR NASIONAL FISIOTERAPI UNIVERSITAS AIRLANGGA 2022", "kuota": null, "deskripsi": "<p>[ Himpunan Mahasiswa Fisioterapi Universitas Airlangga ]</p><p><br></p><p>Proudly present ...</p><p><br></p><p>💫 SEMINAR NASIONAL FISIOTERAPI UNIVERSITAS AIRLANGGA 2022 💫</p><p><br></p><p>🔉Tema: \\"Cardiorespiratory Rehabilitation for Patients with Chronic Obstructive Pulmonary Disease (COPD)\\"&nbsp;</p><p><br></p><p>📌 Save the date 📌</p><p>Seminar Nasional Fisioterapi akan dilaksanakan pada:</p><p>📆 Minggu, 13 November 2022</p><p>🕢 07.30 - Selesai WIB</p><p>📍 Ruang Auditorium Gedung Kuliah Bersama (GKB) Kampus C Universitas Airlangga</p><p><br></p><p>✨ Pelaksanaan Seminar Nasional tahun ini tentunya akan menghadirkan pemateri yang ahli dalam bidangnya masing-masing. So, without any further a do, let’s check out our great speakers! 🙌</p><p><br></p><p>📢 Pemateri :</p><p>1. Dewi Poerwandari, dr., SpKFR-K</p><p>- Alumni Kedokteran FK UNAIR</p><p>- Staff KSM Rehabilitasi Medik di RSUD Dr. Soetomo Surabaya</p><p><br></p><p>2. Nur Sulastri, dr. SpKFR-K</p><p>- Alumni Kedokteran FK UNAIR</p><p>- Kepala Seksi Penunjang Medis RS Universitas Airlangga</p><p>- Staff Departemen Kedokteran Fisik dan Rehabilitasi RS Universitas Airlangga</p><p><br></p><p>3. Isnaini Herawati, S.Fis.,Ftr.,M.Sc</p><p>- Alumni Fisioterapi UMS</p><p>- Dosen prodi Fisioterapi UMS</p><p><br></p><p>4. Akhmad Susiloaji, S.Tr.Kes., S.KM</p><p>- Alumni Fisioterapi UNAIR</p><p>- Dosen Prodi Fosioterapi UNAIR</p><p>- Fisioterapis RSUD Dr. Soetomo Surabaya</p><p><br></p><p>🎤 Moderator</p><p>Dimas Aji Prayitno, S.Tr.Fis, MPT.</p><p>- Alumni Fisioterapi UNAIR</p><p>- Lulusan Master of Physiotherapy MAHSA University</p><p>- Dosen Prodi Fisioterapi UNAIR</p><p><br></p><p><br></p><p>✨ Investasi :</p><p>Khusus mahasiswa fisioterapi dan fisioterapis</p><p>- SKP IFI : Rp. 150.000</p><p>- NON-SKP : Rp. 135.000</p><p>- Mahasiswa Aktif : Rp. 110.000</p><p><br></p><p>✨ Benefit :</p><p>1. Materi yang bermanfaat 📚</p><p>2. E-sertifikat SKP-IFI (On Progress) 📜</p><p>3. E-sertifikat NON-SKP 📜</p><p>4. Menambah relasi</p><p>5. Seminar kit&nbsp;</p><p>6. Konsumsi&nbsp;</p><p><br></p><p><br></p><p>💥Mark your calendar and don't forget to register yourself by contacting the contact person down below ⏬</p><p><br></p><p>📞 CP (WhatsApp) :</p><p>CP 1 : Naira (082142270593)</p><p>CP 2 : Dini (0859106919067)</p><p><br></p><p>❗Additional Notes❗:</p><p>TIDAK MENERIMA PENDAFTARAN SELAIN MELALUI CONTACT PERSON YANG TERTERA DI ATAS😊</p><p><br></p><p>⚡So, what are you waiting for? Come and join us!! See you👋</p><p><br></p><p>#SIAPSEMNAS2022 #HIMAFISUNAIR #KABINETABYAKTA #PILIHFISIOTERAPI #FisioterapiIndonesia #seminar #seminarnasional #seminarkesehatan #seminarfisioterapi #webinarfisioterapi</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Ruang Auditorium Gedung Kuliah Bersama (GKB) Kampus C Universitas Airlangga", "linkEksternal": "https://eventkampus.com/event/detail/4419/seminar-nasional-fisioterapi-universitas-airlangga-2022", "tanggalMentah": "13  - 13 Nov 2022", "teleponKontak": "082142270593", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "SEMINAR NASIONAL FISIOTERAPI UNIVERSITAS AIRLANGGA 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.240Z", "deskripsi": "<p>[ Himpunan Mahasiswa Fisioterapi Universitas Airlangga ]</p><p><br></p><p>Proudly present ...</p><p><br></p><p>💫 SEMINAR NASIONAL FISIOTERAPI UNIVERSITAS AIRLANGGA 2022 💫</p><p><br></p><p>🔉Tema: \\"Cardiorespiratory Rehabilitation for Patients with Chronic Obstructive Pulmonary Disease (COPD)\\"&nbsp;</p><p><br></p><p>📌 Save the date 📌</p><p>Seminar Nasional Fisioterapi akan dilaksanakan pada:</p><p>📆 Minggu, 13 November 2022</p><p>🕢 07.30 - Selesai WIB</p><p>📍 Ruang Auditorium Gedung Kuliah Bersama (GKB) Kampus C Universitas Airlangga</p><p><br></p><p>✨ Pelaksanaan Seminar Nasional tahun ini tentunya akan menghadirkan pemateri yang ahli dalam bidangnya masing-masing. So, without any further a do, let’s check out our great speakers! 🙌</p><p><br></p><p>📢 Pemateri :</p><p>1. Dewi Poerwandari, dr., SpKFR-K</p><p>- Alumni Kedokteran FK UNAIR</p><p>- Staff KSM Rehabilitasi Medik di RSUD Dr. Soetomo Surabaya</p><p><br></p><p>2. Nur Sulastri, dr. SpKFR-K</p><p>- Alumni Kedokteran FK UNAIR</p><p>- Kepala Seksi Penunjang Medis RS Universitas Airlangga</p><p>- Staff Departemen Kedokteran Fisik dan Rehabilitasi RS Universitas Airlangga</p><p><br></p><p>3. Isnaini Herawati, S.Fis.,Ftr.,M.Sc</p><p>- Alumni Fisioterapi UMS</p><p>- Dosen prodi Fisioterapi UMS</p><p><br></p><p>4. Akhmad Susiloaji, S.Tr.Kes., S.KM</p><p>- Alumni Fisioterapi UNAIR</p><p>- Dosen Prodi Fosioterapi UNAIR</p><p>- Fisioterapis RSUD Dr. Soetomo Surabaya</p><p><br></p><p>🎤 Moderator</p><p>Dimas Aji Prayitno, S.Tr.Fis, MPT.</p><p>- Alumni Fisioterapi UNAIR</p><p>- Lulusan Master of Physiotherapy MAHSA University</p><p>- Dosen Prodi Fisioterapi UNAIR</p><p><br></p><p><br></p><p>✨ Investasi :</p><p>Khusus mahasiswa fisioterapi dan fisioterapis</p><p>- SKP IFI : Rp. 150.000</p><p>- NON-SKP : Rp. 135.000</p><p>- Mahasiswa Aktif : Rp. 110.000</p><p><br></p><p>✨ Benefit :</p><p>1. Materi yang bermanfaat 📚</p><p>2. E-sertifikat SKP-IFI (On Progress) 📜</p><p>3. E-sertifikat NON-SKP 📜</p><p>4. Menambah relasi</p><p>5. Seminar kit&nbsp;</p><p>6. Konsumsi&nbsp;</p><p><br></p><p><br></p><p>💥Mark your calendar and don't forget to register yourself by contacting the contact person down below ⏬</p><p><br></p><p>📞 CP (WhatsApp) :</p><p>CP 1 : Naira (082142270593)</p><p>CP 2 : Dini (0859106919067)</p><p><br></p><p>❗Additional Notes❗:</p><p>TIDAK MENERIMA PENDAFTARAN SELAIN MELALUI CONTACT PERSON YANG TERTERA DI ATAS😊</p><p><br></p><p>⚡So, what are you waiting for? Come and join us!! See you👋</p><p><br></p><p>#SIAPSEMNAS2022 #HIMAFISUNAIR #KABINETABYAKTA #PILIHFISIOTERAPI #FisioterapiIndonesia #seminar #seminarnasional #seminarkesehatan #seminarfisioterapi #webinarfisioterapi</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Ruang Auditorium Gedung Kuliah Bersama (GKB) Kampus C Universitas Airlangga", "tanggalMulai": "2022-11-12T17:00:00.000Z", "tipePlatform": "offline", "linkEksternal": "https://eventkampus.com/event/detail/4419/seminar-nasional-fisioterapi-universitas-airlangga-2022", "tanggalMentah": "13  - 13 Nov 2022", "teleponKontak": "082142270593", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-11-12T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.67613	processed
19	https://eventkampus.com	https://eventkampus.com/event/detail/4371/the-64th-markplus-goes-to-campus	{"_raw": {"harga": 0, "judul": "The 64th MarkPlus Goes to Campus", "kuota": null, "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 64th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 20 Agustus 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Prof. Dr. H. Mustofa Kamil, Dip., RSL., M.Pd. - Rektor Universitas Islam Syekh - Yusuf</p><p>2. Dr. Ir. Bob Foster, M.M. - Rektor Universitas Informatika dan Bisnis Indonesia (UNIBI)</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC64</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "linkEksternal": "https://eventkampus.com/event/detail/4371/the-64th-markplus-goes-to-campus", "tanggalMentah": "20  - 20 Agu 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC64Terima"}, "harga": 0, "judul": "The 64th MarkPlus Goes to Campus", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.823Z", "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 64th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 20 Agustus 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Prof. Dr. H. Mustofa Kamil, Dip., RSL., M.Pd. - Rektor Universitas Islam Syekh - Yusuf</p><p>2. Dr. Ir. Bob Foster, M.M. - Rektor Universitas Informatika dan Bisnis Indonesia (UNIBI)</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC64</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "tanggalMulai": "2022-08-19T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4371/the-64th-markplus-goes-to-campus", "tanggalMentah": "20  - 20 Agu 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC64Terima", "tanggalSelesai": "2022-08-19T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.736537	processed
9	https://eventkampus.com	https://eventkampus.com/event/detail/4418/the-72nd-markplus-goes-to-campus	{"_raw": {"harga": 0, "judul": "The 72nd MarkPlus Goes to Campus", "kuota": null, "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 72nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 29 Oktober 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Dra. Diennaryati Tjokrosuprihatono, M.Psi, Psikolog - Wakil Rektor Universitas Pancasila</p><p>2. DR. Hj. Iis Ristiani, S. Pd., M.Pd - Wakil Rektor Universitas Suryakancana</p><p><br></p><p>Moderator : Jacky Mussry - CEO MarkPlus, Inc*</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut :&nbsp;</p><p>https://bit.ly/MGTCep72</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p><p><br></p><p>Info lebih lanjut:</p><p>Aisyah - 083128723830</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "linkEksternal": "https://eventkampus.com/event/detail/4418/the-72nd-markplus-goes-to-campus", "tanggalMentah": "29  - 29 Okt 2022", "teleponKontak": "083128723830", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTCep72Terima"}, "harga": 0, "judul": "The 72nd MarkPlus Goes to Campus", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.258Z", "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 72nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 29 Oktober 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Dra. Diennaryati Tjokrosuprihatono, M.Psi, Psikolog - Wakil Rektor Universitas Pancasila</p><p>2. DR. Hj. Iis Ristiani, S. Pd., M.Pd - Wakil Rektor Universitas Suryakancana</p><p><br></p><p>Moderator : Jacky Mussry - CEO MarkPlus, Inc*</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut :&nbsp;</p><p>https://bit.ly/MGTCep72</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p><p><br></p><p>Info lebih lanjut:</p><p>Aisyah - 083128723830</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "tanggalMulai": "2022-10-28T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4418/the-72nd-markplus-goes-to-campus", "tanggalMentah": "29  - 29 Okt 2022", "teleponKontak": "083128723830", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTCep72Terima", "tanggalSelesai": "2022-10-28T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.679339	processed
42	https://eventkampus.com	https://eventkampus.com/event/detail/4284/himatemia-ft-unila-proudly-present-excess-2022	{"_raw": {"harga": 50000, "judul": "📣HIMATEMIA FT UNILA PROUDLY PRESENT📣    🔥EXCESS 2022🔥", "kuota": null, "deskripsi": "<p>📣HIMATEMIA FT UNILA PROUDLY PRESENT📣</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>🔥EXCESS 2022🔥</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>\\"PERAN GENERASI MUDA INDONESIA dalam MENDORONG INOVASI GUNA MENINGKATKAN INDUSTRI yang INKLUSIF dan BERKELANJUTAN\\"</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>📝SEMINAR NASIONAL - UMUM</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>💡Subtema : \\"Peranan Generasi Muda dalam Meningkatkan Inovasi pada Bidang Industri Bahan Bakar\\"</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>📆Hari/Tgl : Minggu, 29 Mei 2022</p>\\n\\n<p>⌚Pukul : 08.00 WIB sd. Selesai</p>\\n\\n<p>📍Tempat : Dekanat A Fakultas Teknik, Universitas Lampung</p>\\n\\n<p>💰HTM : 50K</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Fasilitas:</p>\\n\\n<p>☑ Seminar Kit</p>\\n\\n<p>☑ Sertifikat</p>\\n\\n<p>☑ Snack</p>\\n\\n<p>☑️ Makan Siang</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>📎Cara Pendaftaran :</p>\\n\\n<p>• Membayar registrasi sebesar Rp 50.000,- melalui :</p>\\n\\n<p>- Bank Mandiri 1140021348530 a. n Ni Gusti Sayu</p>\\n\\n<p>- Dana 082282456818 a. n NI Gusti Sayu</p>\\n\\n<p>- OVO 082282456818 a. n Ni Gusti Sayu</p>\\n\\n<p>•Mengisi formulir online di website :</p>\\n\\n<p>https://bit.ly/SEMNAS_EXCESS2022</p>\\n\\n<p>• Konfirmasi melalui Whatsapp ke Contact Person (CP) dengan format : SEMNAS_Nama_Asal Instansi</p>\\n\\n<p>.</p>\\n\\n<p>Atau dapat menscan barcode yang ada pada pamflet dan juga dapat registrasi langsung di Gedung L Teknik Kimia Unila</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>For more information, visit:</p>\\n\\n<p>Situs web: www.excesshimatemiaunila.com</p>\\n\\n<p>IG: @excess_himatemiaunila</p>\\n\\n<p>Line : @mrj5785x</p>\\n\\n<p>📲Contact Person:</p>\\n\\n<p>M. Nuh : 082280951731</p>\\n\\n<p>Ni Gusti Sayu : 082282456818</p>\\n\\n<p>📣Jadi, tunggu apalagi ? Segera daftarkan dirimu di Seminar Nasional EXCESS 2022 !!!🔥 .</p>\\n\\n<p>#EXCESS_2022</p>\\n\\n<p>#TeknikKimia</p>\\n\\n<p>#TeknikKimiaUnila</p>\\n\\n<p>#HimatemiaFTUnila2022</p>\\n\\n<p>#AkuCintaUnila</p>\\n\\n<p>#Eventkampuscom</p>\\n\\n<p>#eventkampuscom</p>", "tipeHarga": "paid", "urlBanner": "", "namaKontak": "Dana  a. n NI Gusti Sayu", "detailLokasi": "Dekanat A. Fakultas Teknik Universitas Lampung", "linkEksternal": "https://eventkampus.com/event/detail/4284/himatemia-ft-unila-proudly-present-excess-2022", "tanggalMentah": "29  - 29 Mei 2022", "teleponKontak": "082282456818", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/SEMNAS_EXCESS2022"}, "harga": 50000, "judul": "📣HIMATEMIA FT UNILA PROUDLY PRESENT📣 🔥EXCESS 2022🔥", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.636Z", "deskripsi": "<p>📣HIMATEMIA FT UNILA PROUDLY PRESENT📣</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>🔥EXCESS 2022🔥</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>\\"PERAN GENERASI MUDA INDONESIA dalam MENDORONG INOVASI GUNA MENINGKATKAN INDUSTRI yang INKLUSIF dan BERKELANJUTAN\\"</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>📝SEMINAR NASIONAL - UMUM</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>💡Subtema : \\"Peranan Generasi Muda dalam Meningkatkan Inovasi pada Bidang Industri Bahan Bakar\\"</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>📆Hari/Tgl : Minggu, 29 Mei 2022</p>\\n\\n<p>⌚Pukul : 08.00 WIB sd. Selesai</p>\\n\\n<p>📍Tempat : Dekanat A Fakultas Teknik, Universitas Lampung</p>\\n\\n<p>💰HTM : 50K</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Fasilitas:</p>\\n\\n<p>☑ Seminar Kit</p>\\n\\n<p>☑ Sertifikat</p>\\n\\n<p>☑ Snack</p>\\n\\n<p>☑️ Makan Siang</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>📎Cara Pendaftaran :</p>\\n\\n<p>• Membayar registrasi sebesar Rp 50.000,- melalui :</p>\\n\\n<p>- Bank Mandiri 1140021348530 a. n Ni Gusti Sayu</p>\\n\\n<p>- Dana 082282456818 a. n NI Gusti Sayu</p>\\n\\n<p>- OVO 082282456818 a. n Ni Gusti Sayu</p>\\n\\n<p>•Mengisi formulir online di website :</p>\\n\\n<p>https://bit.ly/SEMNAS_EXCESS2022</p>\\n\\n<p>• Konfirmasi melalui Whatsapp ke Contact Person (CP) dengan format : SEMNAS_Nama_Asal Instansi</p>\\n\\n<p>.</p>\\n\\n<p>Atau dapat menscan barcode yang ada pada pamflet dan juga dapat registrasi langsung di Gedung L Teknik Kimia Unila</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>For more information, visit:</p>\\n\\n<p>Situs web: www.excesshimatemiaunila.com</p>\\n\\n<p>IG: @excess_himatemiaunila</p>\\n\\n<p>Line : @mrj5785x</p>\\n\\n<p>📲Contact Person:</p>\\n\\n<p>M. Nuh : 082280951731</p>\\n\\n<p>Ni Gusti Sayu : 082282456818</p>\\n\\n<p>📣Jadi, tunggu apalagi ? Segera daftarkan dirimu di Seminar Nasional EXCESS 2022 !!!🔥 .</p>\\n\\n<p>#EXCESS_2022</p>\\n\\n<p>#TeknikKimia</p>\\n\\n<p>#TeknikKimiaUnila</p>\\n\\n<p>#HimatemiaFTUnila2022</p>\\n\\n<p>#AkuCintaUnila</p>\\n\\n<p>#Eventkampuscom</p>\\n\\n<p>#eventkampuscom</p>", "tipeHarga": "paid", "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "Dana  a. n NI Gusti Sayu", "detailLokasi": "Dekanat A. Fakultas Teknik Universitas Lampung", "tanggalMulai": "2022-05-28T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4284/himatemia-ft-unila-proudly-present-excess-2022", "tanggalMentah": "29  - 29 Mei 2022", "teleponKontak": "082282456818", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/SEMNAS_EXCESS2022", "tanggalSelesai": "2022-05-28T17:00:00.000Z", "confidenceScore": 60, "fieldConfidence": {"harga": 10, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-27 17:31:56.859188	processed
34	https://eventkampus.com	https://eventkampus.com/event/detail/4318/pasarind-talks-pentingnya-customer-retention-untuk-bisnis	{"_raw": {"harga": 0, "judul": "Pasarind Talks \\"Pentingnya Customer Retention Untuk Bisnis\\"", "kuota": null, "deskripsi": "<p>Sebagian besar pebisnis terkadang hanya memfokuskan perhatian pada strategi memperoleh konsumen baru. Padahal, mempertahankan konsumen lama untuk tetap menggunakan produk yang kita jual merupakan hal yang tidak kalah penting!</p><p><br></p><p>Dengan menerapkan strategi customer retention, diharapkan mampu memperkuat koneksi konsumen dengan pelanggan. Lalu, mengapa customer retention itu begitu penting untuk bisnis?</p><p><br></p><p>Simak tipsnya di webinar Pasarind POS bersama Yunita Valentina CRM Manager CT Corp Digital.</p><p><br></p><p>Catat tanggalnya, ya!</p><p>📆 Selasa, 31 Mei 2022</p><p>⏰ 15.00-16.30 WIB</p><p><br></p><p>Dapatkan berbagai hadiah menarik TOTAL 3 juta rupiah. Acara ini GRATIS &amp; Registrasi sekarang klik link di BIO atau daftar di bayarind.co/PasarindTalksEps5</p><p><br></p><p>#eventkampus #talkshow #customerRetention #talkshowbisnis</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4318/pasarind-talks-pentingnya-customer-retention-untuk-bisnis", "tanggalMentah": "31  - 31 Mei 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "Pasarind Talks \\"Pentingnya Customer Retention Untuk Bisnis\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.484Z", "deskripsi": "<p>Sebagian besar pebisnis terkadang hanya memfokuskan perhatian pada strategi memperoleh konsumen baru. Padahal, mempertahankan konsumen lama untuk tetap menggunakan produk yang kita jual merupakan hal yang tidak kalah penting!</p><p><br></p><p>Dengan menerapkan strategi customer retention, diharapkan mampu memperkuat koneksi konsumen dengan pelanggan. Lalu, mengapa customer retention itu begitu penting untuk bisnis?</p><p><br></p><p>Simak tipsnya di webinar Pasarind POS bersama Yunita Valentina CRM Manager CT Corp Digital.</p><p><br></p><p>Catat tanggalnya, ya!</p><p>📆 Selasa, 31 Mei 2022</p><p>⏰ 15.00-16.30 WIB</p><p><br></p><p>Dapatkan berbagai hadiah menarik TOTAL 3 juta rupiah. Acara ini GRATIS &amp; Registrasi sekarang klik link di BIO atau daftar di bayarind.co/PasarindTalksEps5</p><p><br></p><p>#eventkampus #talkshow #customerRetention #talkshowbisnis</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-05-30T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4318/pasarind-talks-pentingnya-customer-retention-untuk-bisnis", "tanggalMentah": "31  - 31 Mei 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-05-30T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.808302	processed
14	https://eventkampus.com	https://eventkampus.com/event/detail/4395/seminar-nasional-tl-expo-2022	{"_raw": {"harga": 50000, "judul": "SEMINAR NASIONAL TL EXPO 2022", "kuota": null, "deskripsi": "<p>SEMINAR NASIONAL TL EXPO 2022</p><p><br></p><p>Jangan lewatkan Seminar Nasional “Environment Restoration to Reach SDGs With Action”. Dapatkan kesempatan untuk mendalami topik dari narasumber yang kompeten di bidangnya.</p><p><br></p><p>Save the Date ⚠️</p><p>🗓 Sabtu, 15 Oktober 2022</p><p>⏰ 07.30 - Selesai</p><p>📍 Engineering Hall Dekanat Fakultas Teknik Universitas Diponegoro, Jl. Prof Sudarto, Tembalang, Semarang, Jawa Tengah, 50275.</p><p><br></p><p>Speakers 🎙️</p><p>1. \\tIr. Sigit Reliantoro, M.Sc ( Direktur Jenderal Pengendalian Pencemaran dan Kerusakan Lingkungan KLHK )</p><p>2.\\tSripeni Inten Cahyani ( Tenaga Ahli Menteri Energi Bersih dan Mineral )</p><p>3. Ir. Priyadi ( Presiden Direktur, PT Adaro Indonesia )</p><p>4.\\tProf. Dr.rer.nat. Imam Buchori, ST ( Guru Besar Perencanaan Wilayah dan Kota, Fakultas Teknik Universitas Diponegoro )</p><p><br></p><p><br></p><p>Benefits ✨</p><p>✔️ Sertifikat</p><p>✔️ Knowledge</p><p>✔️ Snack</p><p>✔️ Lunch</p><p>✔️ Seminar kit</p><p>✔️ Photobooth</p><p>✔️ Doorprize</p><p><br></p><p>Price 💵</p><p>Early Bird Ticket&nbsp;: SOLD</p><p>Pre Sale 1 Ticket&nbsp;: SOLD OUT</p><p>Pre Sale 2 Ticket : SOLD OUT</p><p>Normal : Rp50.000,00&nbsp;</p><p><br></p><p>⚠️ please fill all question on the registration form with the right information. For more information, please check our official instagram @tl_expo or contact our personal contact ⚠️</p><p><br></p><p>Link Registrasi 🖇</p><p>bit.ly/RegistrasiSemNasTLExpo2022</p><p><br></p><p><br></p><p>Payment 💸</p><p>Rekening yang dituju tertera pada link registrasi. Kirimkan bukti pembayaran kepada CP dengan format :&nbsp;</p><p>MetodePembayaran_Nama_Tanggal. Contoh : Mandiri_Helga Fawwas_28 Agustus</p><p><br></p><p>Contact Person 📞</p><p>📲 085771420564 (Husnul Karimah)</p><p>📲 0895401534743 (Zulfikar Imampuro)</p>", "tipeHarga": "paid", "urlBanner": "", "namaKontak": null, "detailLokasi": "Engineering Hall Dekanat Fakultas Teknik Universitas Diponegoro", "linkEksternal": "https://eventkampus.com/event/detail/4395/seminar-nasional-tl-expo-2022", "tanggalMentah": "15  - 15 Okt 2022", "teleponKontak": "085771420564", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 50000, "judul": "SEMINAR NASIONAL TL EXPO 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.504Z", "deskripsi": "<p>SEMINAR NASIONAL TL EXPO 2022</p><p><br></p><p>Jangan lewatkan Seminar Nasional “Environment Restoration to Reach SDGs With Action”. Dapatkan kesempatan untuk mendalami topik dari narasumber yang kompeten di bidangnya.</p><p><br></p><p>Save the Date ⚠️</p><p>🗓 Sabtu, 15 Oktober 2022</p><p>⏰ 07.30 - Selesai</p><p>📍 Engineering Hall Dekanat Fakultas Teknik Universitas Diponegoro, Jl. Prof Sudarto, Tembalang, Semarang, Jawa Tengah, 50275.</p><p><br></p><p>Speakers 🎙️</p><p>1. \\tIr. Sigit Reliantoro, M.Sc ( Direktur Jenderal Pengendalian Pencemaran dan Kerusakan Lingkungan KLHK )</p><p>2.\\tSripeni Inten Cahyani ( Tenaga Ahli Menteri Energi Bersih dan Mineral )</p><p>3. Ir. Priyadi ( Presiden Direktur, PT Adaro Indonesia )</p><p>4.\\tProf. Dr.rer.nat. Imam Buchori, ST ( Guru Besar Perencanaan Wilayah dan Kota, Fakultas Teknik Universitas Diponegoro )</p><p><br></p><p><br></p><p>Benefits ✨</p><p>✔️ Sertifikat</p><p>✔️ Knowledge</p><p>✔️ Snack</p><p>✔️ Lunch</p><p>✔️ Seminar kit</p><p>✔️ Photobooth</p><p>✔️ Doorprize</p><p><br></p><p>Price 💵</p><p>Early Bird Ticket&nbsp;: SOLD</p><p>Pre Sale 1 Ticket&nbsp;: SOLD OUT</p><p>Pre Sale 2 Ticket : SOLD OUT</p><p>Normal : Rp50.000,00&nbsp;</p><p><br></p><p>⚠️ please fill all question on the registration form with the right information. For more information, please check our official instagram @tl_expo or contact our personal contact ⚠️</p><p><br></p><p>Link Registrasi 🖇</p><p>bit.ly/RegistrasiSemNasTLExpo2022</p><p><br></p><p><br></p><p>Payment 💸</p><p>Rekening yang dituju tertera pada link registrasi. Kirimkan bukti pembayaran kepada CP dengan format :&nbsp;</p><p>MetodePembayaran_Nama_Tanggal. Contoh : Mandiri_Helga Fawwas_28 Agustus</p><p><br></p><p>Contact Person 📞</p><p>📲 085771420564 (Husnul Karimah)</p><p>📲 0895401534743 (Zulfikar Imampuro)</p>", "tipeHarga": "paid", "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Engineering Hall Dekanat Fakultas Teknik Universitas Diponegoro", "tanggalMulai": "2022-10-14T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4395/seminar-nasional-tl-expo-2022", "tanggalMentah": "15  - 15 Okt 2022", "teleponKontak": "085771420564", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-10-14T17:00:00.000Z", "confidenceScore": 60, "fieldConfidence": {"harga": 10, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-27 17:31:56.704273	processed
16	https://eventkampus.com	https://eventkampus.com/event/detail/4390	{"_raw": {"harga": 40000, "judul": "𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓 𝐍𝐀𝐓𝐈𝐎𝐍𝐀𝐋 𝐄𝐍𝐓𝐑𝐄𝐏𝐑𝐄𝐍𝐄𝐔𝐑 𝐓𝐀𝐋𝐊 𝟐𝟎𝟐𝟐", "kuota": null, "deskripsi": "<p>✨[𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓 𝐍𝐀𝐓𝐈𝐎𝐍𝐀𝐋 𝐄𝐍𝐓𝐑𝐄𝐏𝐑𝐄𝐍𝐄𝐔𝐑 𝐓𝐀𝐋𝐊 𝟐𝟎𝟐𝟐]✨</p><p><br></p><p>Himpunan Mahasiswa Manajemen Fakultas Ekonomi dan Bisnis Universitas Udayana</p><p><br></p><p>🔉Proudly Present🔉</p><p><br></p><p>Management National Entrepreneur Talk 2022 yang mengusung tema “𝐒𝐞𝐭 𝐔𝐩 𝐘𝐨𝐮𝐫 𝐌𝐢𝐧𝐝 𝐭𝐨 𝐛𝐞 𝐚 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐘𝐨𝐮𝐧𝐠 𝐄𝐧𝐭𝐫𝐞𝐩𝐫𝐞𝐧𝐞𝐮𝐫”</p><p><br></p><p>📌 SAVE THE DATE📌</p><p>Sunday, 30 October 2022</p><p>Via Cisco Webex Meetings</p><p>---‐------------------------------‐---------</p><p><br></p><p>Halo, calon pengusaha muda!👋</p><p>kalian pasti udah gak sabar kan gimana keseruan MJ NET 2022?!</p><p>udah penasaran sama pembicaranya?😱</p><p><br></p><p>MJ NET kali ini kembali hadir dengan konsep yang berbeda. Tentunya akan lebih menarik dan lebih seruu!!</p><p><br></p><p>Untuk itu dengan bangga kami mempersembahkan pembicara kami, yaitu:</p><p><br></p><p>🔉❗️OUR SPEAKERS❗️🔉</p><p><br></p><p>🧑🏻‍💼𝐑𝐚𝐲𝐦𝐨𝐧𝐝 𝐂𝐡𝐢𝐧</p><p>- CEO &amp; Co Founder @ternakuang.id</p><p><br></p><p>👩🏻‍💼𝐒𝐭𝐞𝐩𝐡𝐚𝐧𝐢𝐞 𝐃𝐢𝐬𝐡</p><p>- Content Creator</p><p>- Owner @studio.dish</p><p><br></p><p>👩🏻‍💼𝐒𝐚𝐬𝐡𝐢𝐚 𝐃𝐚𝐧𝐚</p><p>- Owner &amp; Founder @sashbeautystudio @deva_transport</p><p><br></p><p>WOW pembicaranya kece banget nih!! ayo segera daftarkan diri kalian dengan biaya pendaftaran hanya sebesar Rp40.000💸</p><p><br></p><p>Benefit :</p><p>- Knowledge</p><p>- E-Certificate (SKP)</p><p>- Relations</p><p>- Doorprize</p><p><br></p><p>⚠️𝐓𝐈𝐊𝐄𝐓 𝐓𝐄𝐑𝐁𝐀𝐓𝐀𝐒⚠️</p><p><br></p><p>Untuk mekanisme pendaftaran, silahkan mengisi data diri pada link berikut:</p><p>bit.ly/PendaftaranMJNET2022</p><p><br></p><p>Stay tuned ya, selalu pantengin instagram kami @mj_net2022 untuk informasi lebih lanjut!</p><p><br></p><p>For more information, please contact to contact person below:</p><p><br></p><p>👦🏻: ADITYA YAMA</p><p>📞 : 08996073705</p><p>🆔 : Yamadityaa</p><p><br></p><p>👩🏻‍🦰: AYU PRADNYA</p><p>📞 : 081339311915</p><p>🆔 : ayupradnyaa</p><p><br></p><p>👩🏻 : AYU SUGIANTARI</p><p>📞 : 081353263225</p><p>🆔 : saus_tartar27</p><p><br></p><p>#seminarnasional</p><p>#MJNET2022</p><p>#entrepreneur</p><p>#edukasibisnis</p>", "tipeHarga": "paid", "urlBanner": "", "namaKontak": null, "detailLokasi": "Cisco Webex Meetings", "linkEksternal": "https://eventkampus.com/event/detail/4390", "tanggalMentah": "30  - 30 Okt 2022", "teleponKontak": "08996073705", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 40000, "judul": "𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓 𝐍𝐀𝐓𝐈𝐎𝐍𝐀𝐋 𝐄𝐍𝐓𝐑𝐄𝐏𝐑𝐄𝐍𝐄𝐔𝐑 𝐓𝐀𝐋𝐊 𝟐𝟎𝟐𝟐", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.689Z", "deskripsi": "<p>✨[𝐌𝐀𝐍𝐀𝐆𝐄𝐌𝐄𝐍𝐓 𝐍𝐀𝐓𝐈𝐎𝐍𝐀𝐋 𝐄𝐍𝐓𝐑𝐄𝐏𝐑𝐄𝐍𝐄𝐔𝐑 𝐓𝐀𝐋𝐊 𝟐𝟎𝟐𝟐]✨</p><p><br></p><p>Himpunan Mahasiswa Manajemen Fakultas Ekonomi dan Bisnis Universitas Udayana</p><p><br></p><p>🔉Proudly Present🔉</p><p><br></p><p>Management National Entrepreneur Talk 2022 yang mengusung tema “𝐒𝐞𝐭 𝐔𝐩 𝐘𝐨𝐮𝐫 𝐌𝐢𝐧𝐝 𝐭𝐨 𝐛𝐞 𝐚 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥 𝐘𝐨𝐮𝐧𝐠 𝐄𝐧𝐭𝐫𝐞𝐩𝐫𝐞𝐧𝐞𝐮𝐫”</p><p><br></p><p>📌 SAVE THE DATE📌</p><p>Sunday, 30 October 2022</p><p>Via Cisco Webex Meetings</p><p>---‐------------------------------‐---------</p><p><br></p><p>Halo, calon pengusaha muda!👋</p><p>kalian pasti udah gak sabar kan gimana keseruan MJ NET 2022?!</p><p>udah penasaran sama pembicaranya?😱</p><p><br></p><p>MJ NET kali ini kembali hadir dengan konsep yang berbeda. Tentunya akan lebih menarik dan lebih seruu!!</p><p><br></p><p>Untuk itu dengan bangga kami mempersembahkan pembicara kami, yaitu:</p><p><br></p><p>🔉❗️OUR SPEAKERS❗️🔉</p><p><br></p><p>🧑🏻‍💼𝐑𝐚𝐲𝐦𝐨𝐧𝐝 𝐂𝐡𝐢𝐧</p><p>- CEO &amp; Co Founder @ternakuang.id</p><p><br></p><p>👩🏻‍💼𝐒𝐭𝐞𝐩𝐡𝐚𝐧𝐢𝐞 𝐃𝐢𝐬𝐡</p><p>- Content Creator</p><p>- Owner @studio.dish</p><p><br></p><p>👩🏻‍💼𝐒𝐚𝐬𝐡𝐢𝐚 𝐃𝐚𝐧𝐚</p><p>- Owner &amp; Founder @sashbeautystudio @deva_transport</p><p><br></p><p>WOW pembicaranya kece banget nih!! ayo segera daftarkan diri kalian dengan biaya pendaftaran hanya sebesar Rp40.000💸</p><p><br></p><p>Benefit :</p><p>- Knowledge</p><p>- E-Certificate (SKP)</p><p>- Relations</p><p>- Doorprize</p><p><br></p><p>⚠️𝐓𝐈𝐊𝐄𝐓 𝐓𝐄𝐑𝐁𝐀𝐓𝐀𝐒⚠️</p><p><br></p><p>Untuk mekanisme pendaftaran, silahkan mengisi data diri pada link berikut:</p><p>bit.ly/PendaftaranMJNET2022</p><p><br></p><p>Stay tuned ya, selalu pantengin instagram kami @mj_net2022 untuk informasi lebih lanjut!</p><p><br></p><p>For more information, please contact to contact person below:</p><p><br></p><p>👦🏻: ADITYA YAMA</p><p>📞 : 08996073705</p><p>🆔 : Yamadityaa</p><p><br></p><p>👩🏻‍🦰: AYU PRADNYA</p><p>📞 : 081339311915</p><p>🆔 : ayupradnyaa</p><p><br></p><p>👩🏻 : AYU SUGIANTARI</p><p>📞 : 081353263225</p><p>🆔 : saus_tartar27</p><p><br></p><p>#seminarnasional</p><p>#MJNET2022</p><p>#entrepreneur</p><p>#edukasibisnis</p>", "tipeHarga": "paid", "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Cisco Webex Meetings", "tanggalMulai": "2022-10-29T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4390", "tanggalMentah": "30  - 30 Okt 2022", "teleponKontak": "08996073705", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-10-29T17:00:00.000Z", "confidenceScore": 75, "fieldConfidence": {"harga": 10, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.71745	processed
12	https://eventkampus.com	https://eventkampus.com/event/detail/4399/ilsa-connect-2022	{"_raw": {"harga": 0, "judul": "ILSA Connect 2022", "kuota": null, "deskripsi": "<p>[ILSA Connect: Understanding non-litigation international dispute resolution through negotiation]</p><p><br></p><p>Hi everyone, hereby we present to you the main event of the ILSA Connect 2022 webinar talkshow, you can register via bit.ly/PendaftaranILSAConnect2022 for the opportunity to learn about non-litigation international dispute resolution through negotiation with amazing speakers.</p><p><br></p><p><br></p><p>so what are you waiting for? register now!</p><p><br></p><p><br></p><p>ILSA, The Future of International Law!</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4399/ilsa-connect-2022", "tanggalMentah": "15  - 15 Okt 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "ILSA Connect 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.607Z", "deskripsi": "<p>[ILSA Connect: Understanding non-litigation international dispute resolution through negotiation]</p><p><br></p><p>Hi everyone, hereby we present to you the main event of the ILSA Connect 2022 webinar talkshow, you can register via bit.ly/PendaftaranILSAConnect2022 for the opportunity to learn about non-litigation international dispute resolution through negotiation with amazing speakers.</p><p><br></p><p><br></p><p>so what are you waiting for? register now!</p><p><br></p><p><br></p><p>ILSA, The Future of International Law!</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-10-14T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4399/ilsa-connect-2022", "tanggalMentah": "15  - 15 Okt 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-10-14T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.693928	processed
13	https://eventkampus.com	https://eventkampus.com/event/detail/4397/the-69th-markplus-goes-to-campus	{"_raw": {"harga": 0, "judul": "The 69th MarkPlus Goes to Campus", "kuota": null, "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 69th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 1 Oktober 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Dr. Ir. Drs. H. A. Moeslihat Komara, M.Si - Rektor Universitas Subang&nbsp;</p><p>2. Dr. Mochammad Mukti Ali, ST MM - Rektor Universitas Indonesia Membangun (INABA)</p><p><br></p><p>Moderator : Jacky Mussry - CEO MarkPlus, Inc</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut :&nbsp;</p><p>https://bit.ly/MGTC69</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p><p><br></p><p>Info lebih lanjut:&nbsp;</p><p>Aisyah - 083128723830</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarkPlus Channel", "linkEksternal": "https://eventkampus.com/event/detail/4397/the-69th-markplus-goes-to-campus", "tanggalMentah": "01  - 01 Okt 2022", "teleponKontak": "083128723830", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC69Terima"}, "harga": 0, "judul": "The 69th MarkPlus Goes to Campus", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.660Z", "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 69th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 1 Oktober 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Dr. Ir. Drs. H. A. Moeslihat Komara, M.Si - Rektor Universitas Subang&nbsp;</p><p>2. Dr. Mochammad Mukti Ali, ST MM - Rektor Universitas Indonesia Membangun (INABA)</p><p><br></p><p>Moderator : Jacky Mussry - CEO MarkPlus, Inc</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut :&nbsp;</p><p>https://bit.ly/MGTC69</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p><p><br></p><p>Info lebih lanjut:&nbsp;</p><p>Aisyah - 083128723830</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarkPlus Channel", "tanggalMulai": "2022-09-30T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4397/the-69th-markplus-goes-to-campus", "tanggalMentah": "01  - 01 Okt 2022", "teleponKontak": "083128723830", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC69Terima", "tanggalSelesai": "2022-09-30T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.699595	processed
17	https://eventkampus.com	https://eventkampus.com/event/detail/4385/pekan-raya-biologi-2022	{"_raw": {"harga": 0, "judul": "Pekan Raya Biologi 2022", "kuota": null, "deskripsi": "<p>📣 Pekan Raya Biologi 2022 Present 📣</p><p><br></p><p>Bedah Buku&nbsp;&amp; Seminar Nasional sebagai Acara Puncak Pekan Raya Biologi 2022.</p><p><br></p><p>📌Bedah Buku \\"You Do You: Discovering Life Through Experiment &amp; Self Awareness\\"</p><p>Narasumber: Hestia Istiviani (Business Development Manager &amp; Inisiator of Baca Bareng)</p><p>Moderator: Rusydan Latifah (Ketua UKM Exact 2022)</p><p><br></p><p>Save The Date!</p><p>📅: Sabtu, 17 September 2022</p><p>🕖: 08.00 - Selesai</p><p>📍: Zoom Meeting &amp; Teatrikal Lt.1 FST</p><p><br></p><p>Link Pendaftaran:</p><p>bit.ly/DaftarBedahBuku2022</p><p><br></p><p>📌Seminar Nasional \\"Aktualisasi dan Tantangan Perkembangan Bioteknologi Dalam Membangun Masyarakat Modern\\"</p><p>Narasumber:</p><p>1. Prof. Dr. Endang Semiarti, M.S., M.Sc. (Guru Besar Ilmu Kultur Jaringan Tumbuhan &amp; Bioteknologi Tumbuhan UGM)</p><p>2. Jumailatus Sholihah S.Si., M.Si. (Halal Center UIN Sunan Kalijaga Yogyakarta)</p><p>3. Dr. Ema Damayanti, M.Biotech (Periset BRIN Gunungkidul)</p><p>Moderator: Ika Nugraheni Ari Martiwi, M.Si. (Dosen Biologi UIN Sunan Kalijaga)</p><p><br></p><p>Save The Date!</p><p>📅: Minggu, 18 September 2022</p><p>🕖: 07.30 - Selesai</p><p>📍: Zoom Meeting &amp; Teatrikal Lt. 1 FST</p><p><br></p><p>Link Pendaftaran:</p><p>bit.ly/DaftarSemnas2022</p><p><br></p><p>Diselingi penampilan dari Saintek Musik dan FREE HTM‼️ Jangan Sampai Terlewat💯</p><p><br></p><p>More Information:</p><p>Amanda (081294367663)</p><p>Rosita (088215791367)</p><p>@prbuinsuka2022</p><p><br></p><p>#prbuinsuka2022 #seminar #webinar #bedahbuku #seminaronline #webinaronline #seminarnasional #webinarnasional #seminargratis #webinargratis #eventpelajar #eventmahasiswa #event #mahasiswa #pelajar #sma #uin #uinsuka #yogyakarta #biologi #bioteknologi #jawatengah #jawabarat #jawatimur #jakarta</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting & Teatrikal Lt.1 FST", "linkEksternal": "https://eventkampus.com/event/detail/4385/pekan-raya-biologi-2022", "tanggalMentah": "17  - 17 Sep 2022", "teleponKontak": "081294367663", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "Pekan Raya Biologi 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.705Z", "deskripsi": "<p>📣 Pekan Raya Biologi 2022 Present 📣</p><p><br></p><p>Bedah Buku&nbsp;&amp; Seminar Nasional sebagai Acara Puncak Pekan Raya Biologi 2022.</p><p><br></p><p>📌Bedah Buku \\"You Do You: Discovering Life Through Experiment &amp; Self Awareness\\"</p><p>Narasumber: Hestia Istiviani (Business Development Manager &amp; Inisiator of Baca Bareng)</p><p>Moderator: Rusydan Latifah (Ketua UKM Exact 2022)</p><p><br></p><p>Save The Date!</p><p>📅: Sabtu, 17 September 2022</p><p>🕖: 08.00 - Selesai</p><p>📍: Zoom Meeting &amp; Teatrikal Lt.1 FST</p><p><br></p><p>Link Pendaftaran:</p><p>bit.ly/DaftarBedahBuku2022</p><p><br></p><p>📌Seminar Nasional \\"Aktualisasi dan Tantangan Perkembangan Bioteknologi Dalam Membangun Masyarakat Modern\\"</p><p>Narasumber:</p><p>1. Prof. Dr. Endang Semiarti, M.S., M.Sc. (Guru Besar Ilmu Kultur Jaringan Tumbuhan &amp; Bioteknologi Tumbuhan UGM)</p><p>2. Jumailatus Sholihah S.Si., M.Si. (Halal Center UIN Sunan Kalijaga Yogyakarta)</p><p>3. Dr. Ema Damayanti, M.Biotech (Periset BRIN Gunungkidul)</p><p>Moderator: Ika Nugraheni Ari Martiwi, M.Si. (Dosen Biologi UIN Sunan Kalijaga)</p><p><br></p><p>Save The Date!</p><p>📅: Minggu, 18 September 2022</p><p>🕖: 07.30 - Selesai</p><p>📍: Zoom Meeting &amp; Teatrikal Lt. 1 FST</p><p><br></p><p>Link Pendaftaran:</p><p>bit.ly/DaftarSemnas2022</p><p><br></p><p>Diselingi penampilan dari Saintek Musik dan FREE HTM‼️ Jangan Sampai Terlewat💯</p><p><br></p><p>More Information:</p><p>Amanda (081294367663)</p><p>Rosita (088215791367)</p><p>@prbuinsuka2022</p><p><br></p><p>#prbuinsuka2022 #seminar #webinar #bedahbuku #seminaronline #webinaronline #seminarnasional #webinarnasional #seminargratis #webinargratis #eventpelajar #eventmahasiswa #event #mahasiswa #pelajar #sma #uin #uinsuka #yogyakarta #biologi #bioteknologi #jawatengah #jawabarat #jawatimur #jakarta</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting & Teatrikal Lt.1 FST", "tanggalMulai": "2022-09-16T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4385/pekan-raya-biologi-2022", "tanggalMentah": "17  - 17 Sep 2022", "teleponKontak": "081294367663", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-09-16T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.725789	processed
18	https://eventkampus.com	https://eventkampus.com/event/detail/4377/brawijaya-law-fair-xiii-2022-seminar-hukum-nasional	{"_raw": {"harga": 0, "judul": "BRAWIJAYA LAW FAIR XIII 2022: SEMINAR HUKUM NASIONAL", "kuota": null, "deskripsi": "<p>📣 [OPENING CEREMONY BRAWIJAYA LAW FAIR XIII 2022: SEMINAR HUKUM NASIONAL] 📣</p><p><br></p><p>Halo Mahasiswa Fakultas Hukum Seluruh Indonesia 📢 Brawijaya Law Fair dari Fakultas Hukum Universitas Brawijaya kembali lagi tahun ini dengan tema dan rangkaian kegiatan yang tidak kalah menarik!</p><p><br></p><p>Pemindahan ibu kota ke kalimantan tentunya akan memuat banyak permasalahan ekonomi yang kompleks. Hal ini semakin disorot dengan kenyataan bahwa status Indonesia masih berada di tengah pandemi Covid-19 sehingga anggaran banyak dialokasikan guna penanganan pandemi 2 tahun terakhir. Apabila wacana pemindahan ibu kota tetap dilaksanakan, bagaimanakah solusi atas tantangan ekonomi yang akan kita hadapi?</p><p><br></p><p>Temukan jawabannya di dalam Opening Ceremony Brawijaya Law Fair XIII 2022, dengan tema “Megaproyek IKN: Apakah Sebuah Solusi Tantangan Ekonomi Bangsa Pasca Pandemi?”</p><p><br></p><p>Dan saksikan juga launching tema kompetisi Brawijaya Law Fair XIII 2022 🤩🤩</p><p><br></p><p>Yuk, catat tanggalnya!</p><p>🗓 3 September 2022</p><p>🕰 Open Gate 09.00</p><p>📍Zoom Meeting Room</p><p>Free e-certificate</p><p><br></p><p>Mari bergabung dengan kami melalui tautan berikut ini : bit.ly/DaftarTalkshowHukumBLF2022</p><p><br></p><p>Sampai jumpa pada tanggal pelaksanaan!👋🏻😁</p><p><br></p><p>Tetap terhubung dengan kami melalui:</p><p>Instagram : blf_fhub</p><p>Twitter : @blf_fhub</p><p>Telp : 085272698917 (Dina)</p><p><br></p><p>#BrawijayaLawFair2022</p><p>#BLF202</p><p>#eventkampus</p><p>#talkshow</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4377/brawijaya-law-fair-xiii-2022-seminar-hukum-nasional", "tanggalMentah": "03  - 03 Sep 2022", "teleponKontak": "085272698917", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "BRAWIJAYA LAW FAIR XIII 2022: SEMINAR HUKUM NASIONAL", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.735Z", "deskripsi": "<p>📣 [OPENING CEREMONY BRAWIJAYA LAW FAIR XIII 2022: SEMINAR HUKUM NASIONAL] 📣</p><p><br></p><p>Halo Mahasiswa Fakultas Hukum Seluruh Indonesia 📢 Brawijaya Law Fair dari Fakultas Hukum Universitas Brawijaya kembali lagi tahun ini dengan tema dan rangkaian kegiatan yang tidak kalah menarik!</p><p><br></p><p>Pemindahan ibu kota ke kalimantan tentunya akan memuat banyak permasalahan ekonomi yang kompleks. Hal ini semakin disorot dengan kenyataan bahwa status Indonesia masih berada di tengah pandemi Covid-19 sehingga anggaran banyak dialokasikan guna penanganan pandemi 2 tahun terakhir. Apabila wacana pemindahan ibu kota tetap dilaksanakan, bagaimanakah solusi atas tantangan ekonomi yang akan kita hadapi?</p><p><br></p><p>Temukan jawabannya di dalam Opening Ceremony Brawijaya Law Fair XIII 2022, dengan tema “Megaproyek IKN: Apakah Sebuah Solusi Tantangan Ekonomi Bangsa Pasca Pandemi?”</p><p><br></p><p>Dan saksikan juga launching tema kompetisi Brawijaya Law Fair XIII 2022 🤩🤩</p><p><br></p><p>Yuk, catat tanggalnya!</p><p>🗓 3 September 2022</p><p>🕰 Open Gate 09.00</p><p>📍Zoom Meeting Room</p><p>Free e-certificate</p><p><br></p><p>Mari bergabung dengan kami melalui tautan berikut ini : bit.ly/DaftarTalkshowHukumBLF2022</p><p><br></p><p>Sampai jumpa pada tanggal pelaksanaan!👋🏻😁</p><p><br></p><p>Tetap terhubung dengan kami melalui:</p><p>Instagram : blf_fhub</p><p>Twitter : @blf_fhub</p><p>Telp : 085272698917 (Dina)</p><p><br></p><p>#BrawijayaLawFair2022</p><p>#BLF202</p><p>#eventkampus</p><p>#talkshow</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-09-02T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4377/brawijaya-law-fair-xiii-2022-seminar-hukum-nasional", "tanggalMentah": "03  - 03 Sep 2022", "teleponKontak": "085272698917", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-09-02T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.731617	processed
21	https://eventkampus.com	https://eventkampus.com/event/detail/4363/webinar-nasional	{"_raw": {"harga": 0, "judul": "Webinar Nasional", "kuota": null, "deskripsi": "<p>Assalamualaikum warahmatullahi wabarakatuh.</p><p><br></p><p>Hallo Sist &amp; Brow 👋🏻</p><p>Bagaimana kabarnya? Semoga sehat sehat dan dalam lindungan Allah SWT. Aamiin 🙏🏻</p><p><br></p><p>Pemerintah membidik milenial karena milenial yang akan mampu meneruskan perjuangan dalam membangun Hukum dan Ekonomi syariah di Indonesia kedepannya. Apalagi masyarakat Indonesia didominasi oleh muslim.&nbsp;</p><p><br></p><p>Ada kabar gembira nih untuk kalian semua yang ingin menambah wawasan mengenai Hukum dan Ekonomi syariah.&nbsp;</p><p><br></p><p>HIMAHES STAI ASY SYUKRIYYAH</p><p>✨Mempersembahkan✨</p><p><br></p><p>📢 DIBUKA UNTUK UMUM&nbsp;</p><p>💫Webinar Nasional 💫</p><p>Tema : Peran Pemuda dan Perwakilan Daerah Dalam Pembangunan Hukum Dan Ekonomi Menyongsong 77 Tahun Kemerdekaan&nbsp;</p><p><br></p><p>&nbsp;📌 SAVE THE DATE 📌</p><p>📄 Pendaftaran : 05-13 Agustus 2022</p><p>💰 Free Pendaftaran</p><p><br></p><p>🔊 Webinar Hukum Ekonomi&nbsp;</p><p>🗓️ 14 Agustus 2022</p><p>💻 Zoom Meeting</p><p>⏰ 08.30 s.d selesai</p><p><br></p><p>👤 Our Speakers</p><p>H. M. FADHIL RAHMI, LC.,MA</p><p>(Anggota DPD RI)</p><p><br></p><p>MUHAMMAD RYANO PANJAITAN&nbsp;</p><p>(Ketua Umum KNPI)</p><p><br></p><p>DAYANTO, S.H., M.H.</p><p>(Ahli Hukum Tata Negara)</p><p><br></p><p>🗣️ Moderator</p><p>FACHRUL MARASABESSY, S.H., M.Kn.&nbsp;</p><p><br></p><p>🎁 Benefit</p><p>⭐ Ilmu yang bermanfaat</p><p>⭐ Teman diskusi baru</p><p>⭐ E-sertifikat bagi seluruh peserta&nbsp;</p><p><br></p><p><br></p><p>📱 Link Pendaftaran Webinar</p><p>http://bit.ly/PemudaEkonomiHukum</p><p>📱 Kunjungi instagram</p><p>https://instagram.com/himahes.stais?igshid=YmMyMTA2M2Y=</p><p><br></p><p>Pantau terus instagram kami untuk informasi lebih lanjut</p><p>IG : @himahes.stais</p><p><br></p><p><br></p><p>Come join us and enjoy~</p><p>Semangat~</p><p><br></p><p>Wassalamualaikum warahnatullahi wabarakatuh</p><p><br></p><p>#eventkampus #webinar #seminar #stai #himahes</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4363/webinar-nasional", "tanggalMentah": "14  - 14 Agu 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "http://bit.ly/PemudaEkonomiHukum📱"}, "harga": 0, "judul": "Webinar Nasional", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.910Z", "deskripsi": "<p>Assalamualaikum warahmatullahi wabarakatuh.</p><p><br></p><p>Hallo Sist &amp; Brow 👋🏻</p><p>Bagaimana kabarnya? Semoga sehat sehat dan dalam lindungan Allah SWT. Aamiin 🙏🏻</p><p><br></p><p>Pemerintah membidik milenial karena milenial yang akan mampu meneruskan perjuangan dalam membangun Hukum dan Ekonomi syariah di Indonesia kedepannya. Apalagi masyarakat Indonesia didominasi oleh muslim.&nbsp;</p><p><br></p><p>Ada kabar gembira nih untuk kalian semua yang ingin menambah wawasan mengenai Hukum dan Ekonomi syariah.&nbsp;</p><p><br></p><p>HIMAHES STAI ASY SYUKRIYYAH</p><p>✨Mempersembahkan✨</p><p><br></p><p>📢 DIBUKA UNTUK UMUM&nbsp;</p><p>💫Webinar Nasional 💫</p><p>Tema : Peran Pemuda dan Perwakilan Daerah Dalam Pembangunan Hukum Dan Ekonomi Menyongsong 77 Tahun Kemerdekaan&nbsp;</p><p><br></p><p>&nbsp;📌 SAVE THE DATE 📌</p><p>📄 Pendaftaran : 05-13 Agustus 2022</p><p>💰 Free Pendaftaran</p><p><br></p><p>🔊 Webinar Hukum Ekonomi&nbsp;</p><p>🗓️ 14 Agustus 2022</p><p>💻 Zoom Meeting</p><p>⏰ 08.30 s.d selesai</p><p><br></p><p>👤 Our Speakers</p><p>H. M. FADHIL RAHMI, LC.,MA</p><p>(Anggota DPD RI)</p><p><br></p><p>MUHAMMAD RYANO PANJAITAN&nbsp;</p><p>(Ketua Umum KNPI)</p><p><br></p><p>DAYANTO, S.H., M.H.</p><p>(Ahli Hukum Tata Negara)</p><p><br></p><p>🗣️ Moderator</p><p>FACHRUL MARASABESSY, S.H., M.Kn.&nbsp;</p><p><br></p><p>🎁 Benefit</p><p>⭐ Ilmu yang bermanfaat</p><p>⭐ Teman diskusi baru</p><p>⭐ E-sertifikat bagi seluruh peserta&nbsp;</p><p><br></p><p><br></p><p>📱 Link Pendaftaran Webinar</p><p>http://bit.ly/PemudaEkonomiHukum</p><p>📱 Kunjungi instagram</p><p>https://instagram.com/himahes.stais?igshid=YmMyMTA2M2Y=</p><p><br></p><p>Pantau terus instagram kami untuk informasi lebih lanjut</p><p>IG : @himahes.stais</p><p><br></p><p><br></p><p>Come join us and enjoy~</p><p>Semangat~</p><p><br></p><p>Wassalamualaikum warahnatullahi wabarakatuh</p><p><br></p><p>#eventkampus #webinar #seminar #stai #himahes</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-08-13T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4363/webinar-nasional", "tanggalMentah": "14  - 14 Agu 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "http://bit.ly/PemudaEkonomiHukum📱", "tanggalSelesai": "2022-08-13T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.747092	processed
22	https://eventkampus.com	https://eventkampus.com/event/detail/4361/spexperience-ii	{"_raw": {"harga": 0, "judul": "SPEXPERIENCE II", "kuota": null, "deskripsi": "<p>[SPEXPERIENCE II]</p><p><br></p><p>Hi everyone!</p><p>Wanna learn more about Development advanced technology on gas and oil industry? Have a problem on where to start?SPExperience II is the answer!</p><p><br></p><p>SPExperience II is a webinar held by SPE UNDIP SC to members and nonmembers of SPE. This webinar will bring speaker who is an expert in the oil and gas industry. In addition, this webinar will provide information about careers, tips, and experience from the expert!</p><p><br></p><p>Save the date:</p><p>7 August 2022 via zoom meeting</p><p>10.40-finish (GMT +7)</p><p><br></p><p>What Will you get?</p><p>- Increase interest in advanced technology in oil and gas industry</p><p>- Views from expert</p><p>- Provide knowledge about modern technology overview for oil and gas industry\\t</p><p><br></p><p>Register here:</p><p>https://bit.ly/SPEXPERIENCEII</p><p><br></p><p>Contact person:</p><p>Project Manager of SPEXPERIENCE II</p><p>Ammar Razzaq Suryantara</p><p>+6281214561097 (WA)</p><p><br></p><p>#eventkampus #webinar #seminar #oilindustry #gasindustry</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4361/spexperience-ii", "tanggalMentah": "07  - 07 Agu 2022", "teleponKontak": "+6281214561097", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/SPEXPERIENCEIIContact"}, "harga": 0, "judul": "SPEXPERIENCE II", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.984Z", "deskripsi": "<p>[SPEXPERIENCE II]</p><p><br></p><p>Hi everyone!</p><p>Wanna learn more about Development advanced technology on gas and oil industry? Have a problem on where to start?SPExperience II is the answer!</p><p><br></p><p>SPExperience II is a webinar held by SPE UNDIP SC to members and nonmembers of SPE. This webinar will bring speaker who is an expert in the oil and gas industry. In addition, this webinar will provide information about careers, tips, and experience from the expert!</p><p><br></p><p>Save the date:</p><p>7 August 2022 via zoom meeting</p><p>10.40-finish (GMT +7)</p><p><br></p><p>What Will you get?</p><p>- Increase interest in advanced technology in oil and gas industry</p><p>- Views from expert</p><p>- Provide knowledge about modern technology overview for oil and gas industry\\t</p><p><br></p><p>Register here:</p><p>https://bit.ly/SPEXPERIENCEII</p><p><br></p><p>Contact person:</p><p>Project Manager of SPEXPERIENCE II</p><p>Ammar Razzaq Suryantara</p><p>+6281214561097 (WA)</p><p><br></p><p>#eventkampus #webinar #seminar #oilindustry #gasindustry</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-08-06T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4361/spexperience-ii", "tanggalMentah": "07  - 07 Agu 2022", "teleponKontak": "+6281214561097", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/SPEXPERIENCEIIContact", "tanggalSelesai": "2022-08-06T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.752738	processed
86	https://eventkampus.com	https://eventkampus.com/event/detail/4405/the-7th-annual-international-conference-and-exhibition-on-indonesian-medical-education-and-research-institute	{"_raw": {"harga": 0, "judul": "The 7th Annual International Conference and Exhibition on Indonesian Medical Education and Research ", "kuota": null, "deskripsi": "<p>The 7th Annual International Conference and Exhibition on Indonesian Medical Education and Research Institute</p><p>”Welcome Back to The Future of Biomedical Science”</p><p><br></p><p>⚠️OPEN REGISTRATION NOW⚠️</p><p>17 CONCURRENT SESSIONS and 13 WORKSHOPS</p><p>With “National &amp; International Speaker”</p><p><br></p><p>📌Concurrent Session : November 5 - 13th, 2022 (online &amp; offline)</p><p>📌 Workshops : November 5 - 11th , 2022 (online &amp; offline)</p><p>Registration Symposium : FREE!!</p><p>SKP IDI ACCREDITED!</p><p><br></p><p>REGISTER NOW THROUGH:</p><p>https://iceonimeri.id/participant/register&nbsp;</p><p><br></p><p>For More Information:</p><p>Website: www.iceonimeri.id</p><p>Instagram: @iceonimeri</p><p>Email: <a href=\\"/cdn-cgi/l/email-protection\\" class=\\"__cf_email__\\" data-cfemail=\\"97fefaf2e5febafef4d7e2feb9f6f4b9fef3\\">[email&nbsp;protected]</a></p><p><br></p><p>#medicine #imeri #fkui #ui #iceonimeri #workshop #symposium #event</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "online & offline", "linkEksternal": "https://eventkampus.com/event/detail/4405/the-7th-annual-international-conference-and-exhibition-on-indonesian-medical-education-and-research-institute", "tanggalMentah": "05  - 13 Nov 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "The 7th Annual International Conference and Exhibition on Indonesian Medical Education and Research", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.792Z", "deskripsi": "<p>The 7th Annual International Conference and Exhibition on Indonesian Medical Education and Research Institute</p><p>”Welcome Back to The Future of Biomedical Science”</p><p><br></p><p>⚠️OPEN REGISTRATION NOW⚠️</p><p>17 CONCURRENT SESSIONS and 13 WORKSHOPS</p><p>With “National &amp; International Speaker”</p><p><br></p><p>📌Concurrent Session : November 5 - 13th, 2022 (online &amp; offline)</p><p>📌 Workshops : November 5 - 11th , 2022 (online &amp; offline)</p><p>Registration Symposium : FREE!!</p><p>SKP IDI ACCREDITED!</p><p><br></p><p>REGISTER NOW THROUGH:</p><p>https://iceonimeri.id/participant/register&nbsp;</p><p><br></p><p>For More Information:</p><p>Website: www.iceonimeri.id</p><p>Instagram: @iceonimeri</p><p>Email: <a href=\\"/cdn-cgi/l/email-protection\\" class=\\"__cf_email__\\" data-cfemail=\\"97fefaf2e5febafef4d7e2feb9f6f4b9fef3\\">[email&nbsp;protected]</a></p><p><br></p><p>#medicine #imeri #fkui #ui #iceonimeri #workshop #symposium #event</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "conference", "kategoriId": null, "namaKontak": null, "detailLokasi": "online & offline", "tanggalMulai": "2022-11-04T17:00:00.000Z", "tipePlatform": "hybrid", "linkEksternal": "https://eventkampus.com/event/detail/4405/the-7th-annual-international-conference-and-exhibition-on-indonesian-medical-education-and-research-institute", "tanggalMentah": "05  - 13 Nov 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-11-04T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.724742	processed
28	https://eventkampus.com	https://eventkampus.com/event/detail/4330/alsa-lc-ui-for-society-2022	{"_raw": {"harga": 0, "judul": "ALSA LC UI for Society 2022", "kuota": null, "deskripsi": "<p>Hello, Everyone!</p><p><br></p><p>The right of ownership is essential for artists in order to protect their creations against incidents such as plagiarism and work theft. However, the knowledge regarding intellectual property is still deficient amongst artists as well as the general public. Therefore, if you are interested in this topic, ALSA LC UI is providing you a chance to dig deeper into this issue and gain more knowledge and understanding of intellectual property rights in ALSA LC UI for Society 2022’s Legal Webinar with the theme of “Solving Copyright Infringement on Artistic Creation”.</p><p><br></p><p>In ALSA LC UI for Society 2022, we’re focusing on educating artists of Indonesia on getting the rights they deserve and empowering the general public to care more about copyright issues. Embodying the legally skilled pillar of ALSA, ALSA LC UI for Society 2022 is holding a legal webinar to elevate artists' and the general public’s knowledge on intellectual property rights and spread awareness about the importance of these rights for artists to the masses.</p><p><br></p><p>The webinar will be conducted in a hybrid system on:</p><p>day, date: Wednesday, June 15th, 2022</p><p>time: 1.00 p.m. - finish</p><p>place:&nbsp;</p><p>- Museum Kebangkitan Nasional for the artists to be held offline; and</p><p>- Zoom App for other participants to be held online</p><p><br></p><p>This event will feature Angga Priancha S.H., LL.M. as a lecturer in Universitas Indonesia and also Ari Juliano Gema, S.H. as a Partner at Assegaf Hamzah and Partners who both specialize in Intellectual Property Rights. We will also send an e-certificate for those who participate in this legal webinar. So, don’t miss out and register yourself in ALSA LC UI for Society 2022’s Legal Webinar! You can register yourself through bit.ly/OpregLWAFS2022 before 3 p.m. on Tuesday, June 14th, 2022.</p><p><br></p><p>Let's support artists to get their own rights to creative ownership by participating in this legal webinar!&nbsp;</p><p><br></p><p>For further information, please kindly contact:</p><p>Valerie (08118331206/ LINE ID: valeriesondakh120603)</p><p>Adam (085813567811/ LINE ID: adamrahmansyah2)</p><p><br></p><p>Thank you for your attention.</p><p><br></p><p>ALSA, Always be One!</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4330/alsa-lc-ui-for-society-2022", "tanggalMentah": "15  - 15 Jun 2022", "teleponKontak": "08118331206", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "ALSA LC UI for Society 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.425Z", "deskripsi": "<p>Hello, Everyone!</p><p><br></p><p>The right of ownership is essential for artists in order to protect their creations against incidents such as plagiarism and work theft. However, the knowledge regarding intellectual property is still deficient amongst artists as well as the general public. Therefore, if you are interested in this topic, ALSA LC UI is providing you a chance to dig deeper into this issue and gain more knowledge and understanding of intellectual property rights in ALSA LC UI for Society 2022’s Legal Webinar with the theme of “Solving Copyright Infringement on Artistic Creation”.</p><p><br></p><p>In ALSA LC UI for Society 2022, we’re focusing on educating artists of Indonesia on getting the rights they deserve and empowering the general public to care more about copyright issues. Embodying the legally skilled pillar of ALSA, ALSA LC UI for Society 2022 is holding a legal webinar to elevate artists' and the general public’s knowledge on intellectual property rights and spread awareness about the importance of these rights for artists to the masses.</p><p><br></p><p>The webinar will be conducted in a hybrid system on:</p><p>day, date: Wednesday, June 15th, 2022</p><p>time: 1.00 p.m. - finish</p><p>place:&nbsp;</p><p>- Museum Kebangkitan Nasional for the artists to be held offline; and</p><p>- Zoom App for other participants to be held online</p><p><br></p><p>This event will feature Angga Priancha S.H., LL.M. as a lecturer in Universitas Indonesia and also Ari Juliano Gema, S.H. as a Partner at Assegaf Hamzah and Partners who both specialize in Intellectual Property Rights. We will also send an e-certificate for those who participate in this legal webinar. So, don’t miss out and register yourself in ALSA LC UI for Society 2022’s Legal Webinar! You can register yourself through bit.ly/OpregLWAFS2022 before 3 p.m. on Tuesday, June 14th, 2022.</p><p><br></p><p>Let's support artists to get their own rights to creative ownership by participating in this legal webinar!&nbsp;</p><p><br></p><p>For further information, please kindly contact:</p><p>Valerie (08118331206/ LINE ID: valeriesondakh120603)</p><p>Adam (085813567811/ LINE ID: adamrahmansyah2)</p><p><br></p><p>Thank you for your attention.</p><p><br></p><p>ALSA, Always be One!</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-06-14T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4330/alsa-lc-ui-for-society-2022", "tanggalMentah": "15  - 15 Jun 2022", "teleponKontak": "08118331206", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-06-14T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.778603	processed
95	https://eventkampus.com	https://eventkampus.com/event/detail/4366/the-63rd-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 63rd MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 63rd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 13 Agustus 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Dr. Tri Arief Sardjono, S.T., M.T. - Rektor Institut Teknologi Telkom Surabaya</p><p>2. Dr. Dadang Syarif Sihabudin Sahid, S.Si., M.Sc. - Direktur Politenik Caltex Riau</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC63</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p><p><br></p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "linkEksternal": "https://eventkampus.com/event/detail/4366/the-63rd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "13  - 13 Agu 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC63Terima"}, "harga": 0, "judul": "The 63rd MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.733Z", "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 63rd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 13 Agustus 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Dr. Tri Arief Sardjono, S.T., M.T. - Rektor Institut Teknologi Telkom Surabaya</p><p>2. Dr. Dadang Syarif Sihabudin Sahid, S.Si., M.Sc. - Direktur Politenik Caltex Riau</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC63</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p><p><br></p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "tanggalMulai": "2022-08-12T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4366/the-63rd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "13  - 13 Agu 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC63Terima", "tanggalSelesai": "2022-08-12T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.744426	processed
60	https://eventkampus.com	https://eventkampus.com/event/detail/4235/the-46th-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 46th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 46th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 5 Maret 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus Channel</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. Edy Winarno, S.T., M.Eng - Rektor - Universitas Stikubank Semarang<br>\\n2. Raden Gunawan, ST, MT - Direktur - Politeknik Raflesia</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC46 &nbsp;&nbsp;</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4235/the-46th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "05  - 05 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC46"}, "harga": 0, "judul": "The 46th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.957Z", "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 46th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 5 Maret 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus Channel</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. Edy Winarno, S.T., M.Eng - Rektor - Universitas Stikubank Semarang<br>\\n2. Raden Gunawan, ST, MT - Direktur - Politeknik Raflesia</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC46 &nbsp;&nbsp;</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-03-04T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4235/the-46th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "05  - 05 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC46", "tanggalSelesai": "2022-03-04T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.946791	processed
30	https://eventkampus.com	https://eventkampus.com/event/detail/4324/acts-a-collection-of-teen-stories	{"_raw": {"harga": 0, "judul": "ACTS (A Collection of Teen Stories)", "kuota": null, "deskripsi": "<p>Halo teens!!&nbsp;</p><p><br></p><p>*ACTS (A Collection of Teen Stories)* sebuah event besar seputar dunia remaja di era digital akan diselenggarakan via *Zoom*&nbsp;</p><p>*Tanggal: 11 Juni 2022*&nbsp;</p><p>*Waktu: 09.00 sampai selesai*</p><p><br></p><p>*Dapatkan E-Certificate dan menangkan hadiah super menarik sebelum dan selama event ACTS berlangsung*</p><p><br></p><p>Yuk! *Follow IG: litdigi.smpdb2*</p><p>Banyak update info seru tentang event ini, Quiz, dan pastinya ilmu-ilmu kekinian yang berguna.</p><p><br></p><p>Di event ini, akan ada ilmu seputar dunia menulis dari *editor dan novelis teenlit yang keren dari Gramedia Writing Project (Gwp)*</p><p><br></p><p>Peserta juga berkenalan dengan proses pembuatan animasi yang akan dibawakan oleh *sutradara dan script writer hitz dan ternama dari MNC Animation*&nbsp;</p><p><br></p><p>*Psylution* juga akan hadir untuk memberi info menarik seputar&nbsp;kepribadian tokoh di dalam sebuah cerpen dari sisi psikologi.&nbsp;</p><p><br></p><p>Ada juga, pembahasan singkat tentang *personal branding* untuk mempromosikan karya di medsos.</p><p><br></p><p>Turut hadir pula *dosen FIKOM UNTAR* yang akan membahas *karya siswa-siswi SMP DB 2 yang tayang di website Gramedia Writing Project (Gwp)*</p><p><br></p><p>Sssst!!! Ada additional speaker lainnya yang akan memberi ulasan ulasan keren juga untuk cerpen Tim Literasi Digital yang tayang di gramedia writing project nanti, loh! Makanya pantau terus IG: litdigi.smpdb2 untuk melihat reviewnya.</p><p><br></p><p><br></p><p>For more info:&nbsp;</p><p>DM IG @patricia_astrid_nadia (0811845426)</p><p>*LIMITED SEAT!*&nbsp;</p><p><br></p><p>Regist now! Don't miss it! Jamin deh, nggak bakal nyesel ikut event keren dari Literasi Digital SMP Don Bosco II ! See you, soon! 😁</p><p><br></p><p>https://forms.gle/BsmR5efGZtS1hjqQ7</p><p><br></p><p>@patricia_astrid_nadia</p><p>@sekolahdonbosco&nbsp;</p><p>@gwp_id&nbsp;</p><p>@mncanimation&nbsp;</p><p>@psylution.id&nbsp;</p><p>@bemfikomuntar&nbsp;</p><p>@untarjakarta&nbsp;</p><p>@prouduntarian</p><p>@kampusukrida&nbsp;</p><p>@unikaatmajaya&nbsp;</p><p>@pmb.umn&nbsp;</p><p>@eyevit_lapi&nbsp;</p><p>@osissmpdb2</p><p><br></p><p>#SMPDonBosco2</p><p>#LiterasiDigitalSMPDonBosco2</p><p>#GramediaWritingProject</p><p>#MNCAnimation</p><p>#gwp.id</p><p>#Psylution</p><p>#BEMFIKOMUNTAR</p><p>#ACTS</p><p>#ACollectionofTeenStories</p><p>#Teenlit</p><p>#FiksidanNonFiksi</p><p>#Animasi</p><p>#Psikologi</p><p>#PersonalBranding</p><p>#eventkampus</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4324/acts-a-collection-of-teen-stories", "tanggalMentah": "11  - 11 Jun 2022", "teleponKontak": "0811845426", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://forms.gle/BsmR5efGZtS1hjqQ7@patricia_astrid_nadia@sekolahdonbosco"}, "harga": 0, "judul": "ACTS (A Collection of Teen Stories)", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.497Z", "deskripsi": "<p>Halo teens!!&nbsp;</p><p><br></p><p>*ACTS (A Collection of Teen Stories)* sebuah event besar seputar dunia remaja di era digital akan diselenggarakan via *Zoom*&nbsp;</p><p>*Tanggal: 11 Juni 2022*&nbsp;</p><p>*Waktu: 09.00 sampai selesai*</p><p><br></p><p>*Dapatkan E-Certificate dan menangkan hadiah super menarik sebelum dan selama event ACTS berlangsung*</p><p><br></p><p>Yuk! *Follow IG: litdigi.smpdb2*</p><p>Banyak update info seru tentang event ini, Quiz, dan pastinya ilmu-ilmu kekinian yang berguna.</p><p><br></p><p>Di event ini, akan ada ilmu seputar dunia menulis dari *editor dan novelis teenlit yang keren dari Gramedia Writing Project (Gwp)*</p><p><br></p><p>Peserta juga berkenalan dengan proses pembuatan animasi yang akan dibawakan oleh *sutradara dan script writer hitz dan ternama dari MNC Animation*&nbsp;</p><p><br></p><p>*Psylution* juga akan hadir untuk memberi info menarik seputar&nbsp;kepribadian tokoh di dalam sebuah cerpen dari sisi psikologi.&nbsp;</p><p><br></p><p>Ada juga, pembahasan singkat tentang *personal branding* untuk mempromosikan karya di medsos.</p><p><br></p><p>Turut hadir pula *dosen FIKOM UNTAR* yang akan membahas *karya siswa-siswi SMP DB 2 yang tayang di website Gramedia Writing Project (Gwp)*</p><p><br></p><p>Sssst!!! Ada additional speaker lainnya yang akan memberi ulasan ulasan keren juga untuk cerpen Tim Literasi Digital yang tayang di gramedia writing project nanti, loh! Makanya pantau terus IG: litdigi.smpdb2 untuk melihat reviewnya.</p><p><br></p><p><br></p><p>For more info:&nbsp;</p><p>DM IG @patricia_astrid_nadia (0811845426)</p><p>*LIMITED SEAT!*&nbsp;</p><p><br></p><p>Regist now! Don't miss it! Jamin deh, nggak bakal nyesel ikut event keren dari Literasi Digital SMP Don Bosco II ! See you, soon! 😁</p><p><br></p><p>https://forms.gle/BsmR5efGZtS1hjqQ7</p><p><br></p><p>@patricia_astrid_nadia</p><p>@sekolahdonbosco&nbsp;</p><p>@gwp_id&nbsp;</p><p>@mncanimation&nbsp;</p><p>@psylution.id&nbsp;</p><p>@bemfikomuntar&nbsp;</p><p>@untarjakarta&nbsp;</p><p>@prouduntarian</p><p>@kampusukrida&nbsp;</p><p>@unikaatmajaya&nbsp;</p><p>@pmb.umn&nbsp;</p><p>@eyevit_lapi&nbsp;</p><p>@osissmpdb2</p><p><br></p><p>#SMPDonBosco2</p><p>#LiterasiDigitalSMPDonBosco2</p><p>#GramediaWritingProject</p><p>#MNCAnimation</p><p>#gwp.id</p><p>#Psylution</p><p>#BEMFIKOMUNTAR</p><p>#ACTS</p><p>#ACollectionofTeenStories</p><p>#Teenlit</p><p>#FiksidanNonFiksi</p><p>#Animasi</p><p>#Psikologi</p><p>#PersonalBranding</p><p>#eventkampus</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-06-10T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4324/acts-a-collection-of-teen-stories", "tanggalMentah": "11  - 11 Jun 2022", "teleponKontak": "0811845426", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://forms.gle/BsmR5efGZtS1hjqQ7@patricia_astrid_nadia@sekolahdonbosco", "tanggalSelesai": "2022-06-10T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.786557	processed
90	https://eventkampus.com	https://eventkampus.com/event/detail/4392/68th-markplus-goes-to-campus	{"_raw": {"harga": 0, "judul": "68th MarkPlus Goes to Campus", "kuota": null, "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 68th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 24 September 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Neil Semuel Rupidara, S.E., M.Sc., Ph.D - Rektor Universitas Kristen Satya Wacana</p><p>2. Ners. Husin, S.Kep.,MPH - Direktur Politeknik Unggulan Kalimantan</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc. *</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC68</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p><p><br></p><p>For more info:</p><p>Aisyah Mahdiyah</p><p>083128723830</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "linkEksternal": "https://eventkampus.com/event/detail/4392/68th-markplus-goes-to-campus", "tanggalMentah": "24  - 24 Sep 2022", "teleponKontak": "083128723830", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC68Terima"}, "harga": 0, "judul": "68th MarkPlus Goes to Campus", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.475Z", "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 68th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 24 September 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Neil Semuel Rupidara, S.E., M.Sc., Ph.D - Rektor Universitas Kristen Satya Wacana</p><p>2. Ners. Husin, S.Kep.,MPH - Direktur Politeknik Unggulan Kalimantan</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc. *</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC68</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p><p><br></p><p>For more info:</p><p>Aisyah Mahdiyah</p><p>083128723830</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "tanggalMulai": "2022-09-23T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4392/68th-markplus-goes-to-campus", "tanggalMentah": "24  - 24 Sep 2022", "teleponKontak": "083128723830", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC68Terima", "tanggalSelesai": "2022-09-23T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.73614	processed
33	https://eventkampus.com	https://eventkampus.com/event/detail/4319/podcast-htts-2022	{"_raw": {"harga": 0, "judul": "Podcast HTTS 2022", "kuota": null, "deskripsi": "<p>🚭[𝗣𝗢𝗗𝗖𝗔𝗦𝗧 𝗛𝗔𝗥𝗜 𝗧𝗔𝗡𝗣𝗔 𝗧𝗘𝗠𝗕𝗔𝗞𝗔𝗨 𝗦𝗘𝗗𝗨𝗡𝗜𝗔 𝟮𝟬𝟮𝟮]🚭</p><p><br></p><p>•</p><p><br></p><p>Halo sobat anti rokok👋</p><p><br></p><p>Gimana nih kabarnya? Semoga selalu dalam keadaan sehat ya!🥰</p><p><br></p><p>•</p><p><br></p><p>Dalam memeriahkan Hari Tanpa Tembakau Sedunia 2022, Komunitas Mahasiswa Peduli Bahaya Tembakau HMKM FK Unud akan melaksanakan kegiatan Podcast dengan tema \\"𝐒𝐭𝐨𝐩 𝐒𝐦𝐨𝐤𝐢𝐧𝐠, 𝐋𝐞𝐭𝐬 𝐒𝐩𝐫𝐞𝐚𝐝𝐢𝐧𝐠! 𝐓𝐡𝐞 𝐁𝐞𝐧𝐞𝐟𝐢𝐭 𝐟𝐫𝐨𝐦 𝐒𝐦𝐨𝐤𝐞 𝐅𝐫𝐞𝐞 𝐄𝐧𝐯𝐢𝐫𝐨𝐧𝐦𝐞𝐧𝐭 𝐭𝐨 𝐈𝐧𝐜𝐫𝐞𝐚𝐬𝐞 𝐓𝐡𝐞 𝐐𝐮𝐚𝐥𝐢𝐭𝐲 𝐨𝐟 𝐎𝐮𝐫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧𝐚𝐥 𝐄𝐧𝐯𝐢𝐫𝐨𝐧𝐦𝐞𝐧𝐭\\"✨</p><p><br></p><p>•</p><p><br></p><p>Podcast HTTS 2022 akan dilaksanakan pada :</p><p><br></p><p>📅 : Selasa, 31 Mei 2022</p><p><br></p><p>⏰ : 19.00 WITA</p><p><br></p><p>📍 : HMKM Youtube Channel</p><p><br></p><p>•</p><p><br></p><p>Podcast HTTS kali ini akan menyajikan acara bincang-bincang santai dengan menghadirkan pembicara yang tentunya sangat terpercaya yaitu Wakil Ketua BEM FK Unud. Wah, tentunya akan sangat menarik bukan‼️🤩</p><p><br></p><p>•</p><p><br></p><p>Yuk, jangan ragu untuk ikutan karena acara ini gratis dan terbuka untuk umum lohh! Semoga dengan adanya bincang-bincang ini, kita dapat lebih memahami bahaya dan pentingnya berhenti merokok untuk meningkatkan kesehatan diri kita sendiri dan orang di sekitar kita🔥</p><p><br></p><p>•</p><p><br></p><p>Jika terdapat hal yang kurang jelas, dapat menghubungi contact person (CP) di bawah ini☺️</p><p><br></p><p>•</p><p><br></p><p>Contact Person :</p><p><br></p><p>📞 Dinda Ayu Kartika : 087762890666 / kxrtika</p><p><br></p><p>📞 Ayu Ratna : 082236166533 / ayuratna_01</p><p><br></p><p>•</p><p><br></p><p>Salam Adaptif!</p><p><br></p><p>•</p><p><br></p><p>#WorldNoTobaccoDay2022</p><p><br></p><p>#HTTS_KMPT2022</p><p><br></p><p>#WNTDPodcastKMPT</p><p><br></p><p>#SinergiKMPT</p><p><br></p><p>#KMPT_HMKMUnud</p><p><br></p><p>#HMKMCreative</p><p><br></p><p>#KabinetKarsaBersama</p><p><br></p><p>#WeAreOneKBM</p><p><br></p><p>#AgenPreventif</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Youtube", "linkEksternal": "https://eventkampus.com/event/detail/4319/podcast-htts-2022", "tanggalMentah": "31  - 31 Mei 2022", "teleponKontak": "087762890666", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "Podcast HTTS 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.543Z", "deskripsi": "<p>🚭[𝗣𝗢𝗗𝗖𝗔𝗦𝗧 𝗛𝗔𝗥𝗜 𝗧𝗔𝗡𝗣𝗔 𝗧𝗘𝗠𝗕𝗔𝗞𝗔𝗨 𝗦𝗘𝗗𝗨𝗡𝗜𝗔 𝟮𝟬𝟮𝟮]🚭</p><p><br></p><p>•</p><p><br></p><p>Halo sobat anti rokok👋</p><p><br></p><p>Gimana nih kabarnya? Semoga selalu dalam keadaan sehat ya!🥰</p><p><br></p><p>•</p><p><br></p><p>Dalam memeriahkan Hari Tanpa Tembakau Sedunia 2022, Komunitas Mahasiswa Peduli Bahaya Tembakau HMKM FK Unud akan melaksanakan kegiatan Podcast dengan tema \\"𝐒𝐭𝐨𝐩 𝐒𝐦𝐨𝐤𝐢𝐧𝐠, 𝐋𝐞𝐭𝐬 𝐒𝐩𝐫𝐞𝐚𝐝𝐢𝐧𝐠! 𝐓𝐡𝐞 𝐁𝐞𝐧𝐞𝐟𝐢𝐭 𝐟𝐫𝐨𝐦 𝐒𝐦𝐨𝐤𝐞 𝐅𝐫𝐞𝐞 𝐄𝐧𝐯𝐢𝐫𝐨𝐧𝐦𝐞𝐧𝐭 𝐭𝐨 𝐈𝐧𝐜𝐫𝐞𝐚𝐬𝐞 𝐓𝐡𝐞 𝐐𝐮𝐚𝐥𝐢𝐭𝐲 𝐨𝐟 𝐎𝐮𝐫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧𝐚𝐥 𝐄𝐧𝐯𝐢𝐫𝐨𝐧𝐦𝐞𝐧𝐭\\"✨</p><p><br></p><p>•</p><p><br></p><p>Podcast HTTS 2022 akan dilaksanakan pada :</p><p><br></p><p>📅 : Selasa, 31 Mei 2022</p><p><br></p><p>⏰ : 19.00 WITA</p><p><br></p><p>📍 : HMKM Youtube Channel</p><p><br></p><p>•</p><p><br></p><p>Podcast HTTS kali ini akan menyajikan acara bincang-bincang santai dengan menghadirkan pembicara yang tentunya sangat terpercaya yaitu Wakil Ketua BEM FK Unud. Wah, tentunya akan sangat menarik bukan‼️🤩</p><p><br></p><p>•</p><p><br></p><p>Yuk, jangan ragu untuk ikutan karena acara ini gratis dan terbuka untuk umum lohh! Semoga dengan adanya bincang-bincang ini, kita dapat lebih memahami bahaya dan pentingnya berhenti merokok untuk meningkatkan kesehatan diri kita sendiri dan orang di sekitar kita🔥</p><p><br></p><p>•</p><p><br></p><p>Jika terdapat hal yang kurang jelas, dapat menghubungi contact person (CP) di bawah ini☺️</p><p><br></p><p>•</p><p><br></p><p>Contact Person :</p><p><br></p><p>📞 Dinda Ayu Kartika : 087762890666 / kxrtika</p><p><br></p><p>📞 Ayu Ratna : 082236166533 / ayuratna_01</p><p><br></p><p>•</p><p><br></p><p>Salam Adaptif!</p><p><br></p><p>•</p><p><br></p><p>#WorldNoTobaccoDay2022</p><p><br></p><p>#HTTS_KMPT2022</p><p><br></p><p>#WNTDPodcastKMPT</p><p><br></p><p>#SinergiKMPT</p><p><br></p><p>#KMPT_HMKMUnud</p><p><br></p><p>#HMKMCreative</p><p><br></p><p>#KabinetKarsaBersama</p><p><br></p><p>#WeAreOneKBM</p><p><br></p><p>#AgenPreventif</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Youtube", "tanggalMulai": "2022-05-30T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4319/podcast-htts-2022", "tanggalMentah": "31  - 31 Mei 2022", "teleponKontak": "087762890666", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-05-30T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-27 17:31:56.803752	processed
107	https://eventkampus.com	https://eventkampus.com/event/detail/4321/creative-seminar-clic-2022-encapsulate-your-personage	{"_raw": {"harga": 0, "judul": "Creative seminar C.L.I.C 2022 “Encapsulate Your Personage”", "kuota": null, "deskripsi": "<p>💫Creative seminar C.L.I.C 2022 “Encapsulate Your Personage”💫.&nbsp;</p><p>Disini kita akan sama-sama mengupas bagaimana cara menerima serta mengembangkan diri untuk menjadi versi terbaik dari diri kamu lohh 😱✨.&nbsp;&nbsp;</p><p><br></p><p>Our Speakers:&nbsp;</p><p>💁🏻‍♀️ Cinta Laura (Actress, Singer, and Model)&nbsp;</p><p>💁🏻‍♀️ Sonia Basil (CEO of Cakelogy and Keku)&nbsp;&nbsp;</p><p><br></p><p>MARK THE DATE!&nbsp;</p><p>🗓 Kamis, 9 Juni 2022&nbsp;</p><p>⏰ 19:00 WIB – Selesai&nbsp;</p><p>📌 Zoom Meeting&nbsp;&nbsp;</p><p><br></p><p>FREE E-CERTIFICATE&nbsp;&nbsp;</p><p><br></p><p>‼️Registration periode: 31 May-9 June 2022‼️&nbsp;&nbsp;</p><p>Yuk segera daftar di: https://bit.ly/RegistrationSeminar1CLIC&nbsp;&nbsp;</p><p><br></p><p>LIMITED SLOT, JANGAN SAMPAI KEHABISAN YA TEMAN-TEMAN😱❗️&nbsp;&nbsp;</p><p><br></p><p>For more information:&nbsp;</p><p>- LINE OA: @clicprasmul&nbsp;</p><p>- WhatsApp: 081932512956 (Jessica)&nbsp;&nbsp;&nbsp;</p><p><br></p><p>SEE YOU ON CREATIVE SEMINAR C.L.I.C 👋🏻♥️</p><p><br></p><p>#eventkampus #seminar #webinar</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4321/creative-seminar-clic-2022-encapsulate-your-personage", "tanggalMentah": "09  - 09 Jun 2022", "teleponKontak": "081932512956", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/RegistrationSeminar1CLIC"}, "harga": 0, "judul": "Creative seminar C.L.I.C 2022 “Encapsulate Your Personage”", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.256Z", "deskripsi": "<p>💫Creative seminar C.L.I.C 2022 “Encapsulate Your Personage”💫.&nbsp;</p><p>Disini kita akan sama-sama mengupas bagaimana cara menerima serta mengembangkan diri untuk menjadi versi terbaik dari diri kamu lohh 😱✨.&nbsp;&nbsp;</p><p><br></p><p>Our Speakers:&nbsp;</p><p>💁🏻‍♀️ Cinta Laura (Actress, Singer, and Model)&nbsp;</p><p>💁🏻‍♀️ Sonia Basil (CEO of Cakelogy and Keku)&nbsp;&nbsp;</p><p><br></p><p>MARK THE DATE!&nbsp;</p><p>🗓 Kamis, 9 Juni 2022&nbsp;</p><p>⏰ 19:00 WIB – Selesai&nbsp;</p><p>📌 Zoom Meeting&nbsp;&nbsp;</p><p><br></p><p>FREE E-CERTIFICATE&nbsp;&nbsp;</p><p><br></p><p>‼️Registration periode: 31 May-9 June 2022‼️&nbsp;&nbsp;</p><p>Yuk segera daftar di: https://bit.ly/RegistrationSeminar1CLIC&nbsp;&nbsp;</p><p><br></p><p>LIMITED SLOT, JANGAN SAMPAI KEHABISAN YA TEMAN-TEMAN😱❗️&nbsp;&nbsp;</p><p><br></p><p>For more information:&nbsp;</p><p>- LINE OA: @clicprasmul&nbsp;</p><p>- WhatsApp: 081932512956 (Jessica)&nbsp;&nbsp;&nbsp;</p><p><br></p><p>SEE YOU ON CREATIVE SEMINAR C.L.I.C 👋🏻♥️</p><p><br></p><p>#eventkampus #seminar #webinar</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-06-08T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4321/creative-seminar-clic-2022-encapsulate-your-personage", "tanggalMentah": "09  - 09 Jun 2022", "teleponKontak": "081932512956", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/RegistrationSeminar1CLIC", "tanggalSelesai": "2022-06-08T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.775025	processed
119	https://eventkampus.com	https://eventkampus.com/event/detail/4275/the-6th-irofonic-2022	{"_raw": {"harga": 0, "judul": "The 6th IROFONIC 2022", "kuota": null, "deskripsi": "<p>The International Relations department of Universitas Pembangunan Nasional “Veteran” Jawa Timur proudly presents the 6th IROFONIC (International Relations on Indonesian Foreign Policy Conference) 2022 with the theme \\"Community Engagement in Southeast Asian Development\\". The conference aims to comprehensively discuss the significance of community engagement in socio-cultural, political, economic, and policy-making issues for the betterment of Southeast Asian region.</p>\\n\\n<p>The 6th IROFONIC 2022 Sub-themes:<br>\\n● Community Engagement in people-based economic development in the Southeast Asia Region.<br>\\n● Social Activism in Southeast Asia.<br>\\n● Civil Society engagement in the development of domestic politics, security and foreign policies in Southeast Asia.<br>\\n● Local Wisdom, Language, and Cultural Heritage of Southeast Asia.</p>\\n\\n<p>List of Speakers:<br>\\nKeynote Speaker: &nbsp;<br>\\n(to be confirmed)<br>\\nExpert Speakers: &nbsp;<br>\\nDr. David Michael M. San Juan (De La Salle University)<br>\\nAssistant Professor. Dr. Patoo Cusripituck (Mahidol University).</p>\\n\\n<p>Date of Events: July 5th, 2022.<br>\\nMedium: Hybrid (Offline dan Online via Zoom).<br>\\nRegistration link: bit.ly/IROFONIC2022RegistrationandAbstract.<br>\\nFor further information, please contact Firsty (087854444104) / Resa (081330151871) &nbsp;<br>\\nor visit our website and social media;<br>\\nInstagram @irofonic<br>\\nirofonic.upnjatim.ac.id<br>\\nEmail: <a href=\\"/cdn-cgi/l/email-protection\\" class=\\"__cf_email__\\" data-cfemail=\\"8ee7fce1e8e1e0e7edcefbfee0e4effae7e3a0efeda0e7ea\\">[email&nbsp;protected]</a></p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Hybrid (Offline dan Online via Zoom)", "linkEksternal": "https://eventkampus.com/event/detail/4275/the-6th-irofonic-2022", "tanggalMentah": "05  - 05 Jul 2022", "teleponKontak": "087854444104", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "The 6th IROFONIC 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.440Z", "deskripsi": "<p>The International Relations department of Universitas Pembangunan Nasional “Veteran” Jawa Timur proudly presents the 6th IROFONIC (International Relations on Indonesian Foreign Policy Conference) 2022 with the theme \\"Community Engagement in Southeast Asian Development\\". The conference aims to comprehensively discuss the significance of community engagement in socio-cultural, political, economic, and policy-making issues for the betterment of Southeast Asian region.</p>\\n\\n<p>The 6th IROFONIC 2022 Sub-themes:<br>\\n● Community Engagement in people-based economic development in the Southeast Asia Region.<br>\\n● Social Activism in Southeast Asia.<br>\\n● Civil Society engagement in the development of domestic politics, security and foreign policies in Southeast Asia.<br>\\n● Local Wisdom, Language, and Cultural Heritage of Southeast Asia.</p>\\n\\n<p>List of Speakers:<br>\\nKeynote Speaker: &nbsp;<br>\\n(to be confirmed)<br>\\nExpert Speakers: &nbsp;<br>\\nDr. David Michael M. San Juan (De La Salle University)<br>\\nAssistant Professor. Dr. Patoo Cusripituck (Mahidol University).</p>\\n\\n<p>Date of Events: July 5th, 2022.<br>\\nMedium: Hybrid (Offline dan Online via Zoom).<br>\\nRegistration link: bit.ly/IROFONIC2022RegistrationandAbstract.<br>\\nFor further information, please contact Firsty (087854444104) / Resa (081330151871) &nbsp;<br>\\nor visit our website and social media;<br>\\nInstagram @irofonic<br>\\nirofonic.upnjatim.ac.id<br>\\nEmail: <a href=\\"/cdn-cgi/l/email-protection\\" class=\\"__cf_email__\\" data-cfemail=\\"8ee7fce1e8e1e0e7edcefbfee0e4effae7e3a0efeda0e7ea\\">[email&nbsp;protected]</a></p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Hybrid (Offline dan Online via Zoom)", "tanggalMulai": "2022-07-04T17:00:00.000Z", "tipePlatform": "hybrid", "linkEksternal": "https://eventkampus.com/event/detail/4275/the-6th-irofonic-2022", "tanggalMentah": "05  - 05 Jul 2022", "teleponKontak": "087854444104", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-07-04T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.809708	processed
37	https://eventkampus.com	https://eventkampus.com/event/detail/4307/adkesma-talk-series-ii	{"_raw": {"harga": 0, "judul": "ADKESMA-TALK SERIES II", "kuota": null, "deskripsi": "<p>✨ ADKESMA-TALK SERIES II PRESENT ✨</p><p>Hallo, Hallo Peeps‼️</p><p><br></p><p>Jumpa lagi nih sama webinar kece Adkesma Talk Series II yang mengusung tema ga kalah asik dan pentingnya dong dengan yang sebelumnya.&nbsp;</p><p><br></p><p>Apalagi kalau bukan \\"Being an Outstanding College Student\\" 🥳🥳</p><p>__</p><p><br></p><p>Hayo siapa sih yang gak mau menjadi mahasiswa dengan segudang prestasi ??!!</p><p>Dengan prestasi tentunya kita dapat melihat dunia dengan sudut pandang yang lebih luas lagi dongg tentunya serta menjadi kebanggan banyak orang🤩💫</p><p><br></p><p>Penasaran gimana caranya🤔</p><p><br></p><p>Join Us Now‼️</p><p>kamu bakal mendapatkan informasi serta tips &amp; trick mengulik kiat dan usaha yang harus dilakukan untuk mencapai sebuah prestasi.&nbsp;</p><p><br></p><p>⚠️ FREE REGISTRATION⚠️</p><p><br></p><p>❗Registration On❗</p><p>https://bit.ly/AdkesmaTalk2</p><p>7 Mei - 20 Mei 2022</p><p><br></p><p>📌Save the date:</p><p>📆 Sabtu, 21 Mei 2022</p><p>⏰ 08.00 WIB s.d selesai</p><p>🖥️ Zoom Cloud Meeting</p><p><br></p><p>🔊 Narasumber :</p><p>🗣️ Edy Nuswantara Putra</p><p>- Awardee Beswan Djarum 2020</p><p>-Executive Board Leadership Training ISMKI Wil. III 2020-2021</p><p>- Co-Ass Kedokteran Universitas Diponegoro</p><p>🗣️ Joses Waldy Aro Asmara Telaumbanua</p><p>- Wakil IV Duta GenRe Kota Jambi</p><p>- Duta GenRe Provinsi Jambi</p><p>- Lolos Pendanaan PHP2D Tingkat Nasional</p><p><br></p><p>👩‍💼Moderator&nbsp;</p><p>Rizda Choyrin Nizwa&nbsp;</p><p>(Mahasiswi Ilmu Kesehatan Masyarakat 2019, Universitas Jambi)</p><p><br></p><p>Benefit :</p><p>📄 E - Sertifikat</p><p>📚 Ilmu yang bermanfaat</p><p>🤝 Menambah Relasi</p><p>🎉 Doorprize</p><p><br></p><p>__</p><p><br></p><p>☎️Narahubung</p><p>📱Syarif (082283019899)</p><p><br></p><p>@bemfkik.unja @adkesma.fkikunja</p><p>#beasiswaluarnegeri #webinarbeasiswa #bemfkikunja #departemenadkesma #webinarscholarship #eventkampus #webinar #beasiswa</p><p><br></p><p>Don't forget to join our webinar Peeps!!! See you😍😍 —————————————————</p><p>DEPARTEMEN ADVOKASI DAN KESEJAHTERAAN MAHASISWA BEM FKIK UNJA</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4307/adkesma-talk-series-ii", "tanggalMentah": "21  - 21 Mei 2022", "teleponKontak": "082283019899", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/AdkesmaTalk27"}, "harga": 0, "judul": "ADKESMA-TALK SERIES II", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.562Z", "deskripsi": "<p>✨ ADKESMA-TALK SERIES II PRESENT ✨</p><p>Hallo, Hallo Peeps‼️</p><p><br></p><p>Jumpa lagi nih sama webinar kece Adkesma Talk Series II yang mengusung tema ga kalah asik dan pentingnya dong dengan yang sebelumnya.&nbsp;</p><p><br></p><p>Apalagi kalau bukan \\"Being an Outstanding College Student\\" 🥳🥳</p><p>__</p><p><br></p><p>Hayo siapa sih yang gak mau menjadi mahasiswa dengan segudang prestasi ??!!</p><p>Dengan prestasi tentunya kita dapat melihat dunia dengan sudut pandang yang lebih luas lagi dongg tentunya serta menjadi kebanggan banyak orang🤩💫</p><p><br></p><p>Penasaran gimana caranya🤔</p><p><br></p><p>Join Us Now‼️</p><p>kamu bakal mendapatkan informasi serta tips &amp; trick mengulik kiat dan usaha yang harus dilakukan untuk mencapai sebuah prestasi.&nbsp;</p><p><br></p><p>⚠️ FREE REGISTRATION⚠️</p><p><br></p><p>❗Registration On❗</p><p>https://bit.ly/AdkesmaTalk2</p><p>7 Mei - 20 Mei 2022</p><p><br></p><p>📌Save the date:</p><p>📆 Sabtu, 21 Mei 2022</p><p>⏰ 08.00 WIB s.d selesai</p><p>🖥️ Zoom Cloud Meeting</p><p><br></p><p>🔊 Narasumber :</p><p>🗣️ Edy Nuswantara Putra</p><p>- Awardee Beswan Djarum 2020</p><p>-Executive Board Leadership Training ISMKI Wil. III 2020-2021</p><p>- Co-Ass Kedokteran Universitas Diponegoro</p><p>🗣️ Joses Waldy Aro Asmara Telaumbanua</p><p>- Wakil IV Duta GenRe Kota Jambi</p><p>- Duta GenRe Provinsi Jambi</p><p>- Lolos Pendanaan PHP2D Tingkat Nasional</p><p><br></p><p>👩‍💼Moderator&nbsp;</p><p>Rizda Choyrin Nizwa&nbsp;</p><p>(Mahasiswi Ilmu Kesehatan Masyarakat 2019, Universitas Jambi)</p><p><br></p><p>Benefit :</p><p>📄 E - Sertifikat</p><p>📚 Ilmu yang bermanfaat</p><p>🤝 Menambah Relasi</p><p>🎉 Doorprize</p><p><br></p><p>__</p><p><br></p><p>☎️Narahubung</p><p>📱Syarif (082283019899)</p><p><br></p><p>@bemfkik.unja @adkesma.fkikunja</p><p>#beasiswaluarnegeri #webinarbeasiswa #bemfkikunja #departemenadkesma #webinarscholarship #eventkampus #webinar #beasiswa</p><p><br></p><p>Don't forget to join our webinar Peeps!!! See you😍😍 —————————————————</p><p>DEPARTEMEN ADVOKASI DAN KESEJAHTERAAN MAHASISWA BEM FKIK UNJA</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-05-20T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4307/adkesma-talk-series-ii", "tanggalMentah": "21  - 21 Mei 2022", "teleponKontak": "082283019899", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/AdkesmaTalk27", "tanggalSelesai": "2022-05-20T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.828939	processed
43	https://eventkampus.com	https://eventkampus.com/event/detail/4279/open-regist-industrial-spirit-of-caring-inspiring-hmti-upnvj-2022	{"_raw": {"judul": "[OPEN REGIST INDUSTRIAL SPIRIT OF CARING - INSPIRING HMTI UPNVJ 2022]", "urlBanner": "", "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4279/open-regist-industrial-spirit-of-caring-inspiring-hmti-upnvj-2022", "tanggalMentah": "22  - 22 Apr 2022", "websiteSumber": "https://eventkampus.com"}, "harga": 0, "judul": "[OPEN REGIST INDUSTRIAL SPIRIT OF CARING - INSPIRING HMTI UPNVJ 2022]", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.720Z", "deskripsi": "", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-04-21T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4279/open-regist-industrial-spirit-of-caring-inspiring-hmti-upnvj-2022", "tanggalMentah": "22  - 22 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-04-21T17:00:00.000Z", "confidenceScore": 35, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 0, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.864679	processed
40	https://eventkampus.com	https://eventkampus.com/event/detail/4289/webinar-pasarindtalks	{"_raw": {"harga": 0, "judul": "Webinar #PasarindTalks", "kuota": null, "deskripsi": "<p>Seiring meningkatnya kesadaran masyarakat akan kesetaraan gender, keterlibatan perempuan dalam sektor bisnis saat ini semakin banyak.</p>\\n\\n<p>Perempuan tidak lagi malu, tapi malah sebaliknya! Mereka berjuang sekuat tenaga hingga sukses meski dilain pihak masih berperan sebagai ibu rumah tangga.</p>\\n\\n<p>Seperti apa tips &amp; tricks untuk mencapai kesuksesan? Yuk ikuti webinar #PasarindTalks bersama&nbsp;</p>\\n\\n<p>Catat tanggalnya, ya!<br>\\n📆 Selasa, 26 April 2022<br>\\n⏰ 15.00-16.30 WIB</p>\\n\\n<p>Dapatkan berbagai hadiah menarik TOTAL 3 juta rupiah. Acara ini GRATIS &amp; Registrasi sekarang klik link di BIO atau daftar di Bayarind.co/JoinPasarindTalksEps4</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom", "linkEksternal": "https://eventkampus.com/event/detail/4289/webinar-pasarindtalks", "tanggalMentah": "26  - 26 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "Webinar #PasarindTalks", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.695Z", "deskripsi": "<p>Seiring meningkatnya kesadaran masyarakat akan kesetaraan gender, keterlibatan perempuan dalam sektor bisnis saat ini semakin banyak.</p>\\n\\n<p>Perempuan tidak lagi malu, tapi malah sebaliknya! Mereka berjuang sekuat tenaga hingga sukses meski dilain pihak masih berperan sebagai ibu rumah tangga.</p>\\n\\n<p>Seperti apa tips &amp; tricks untuk mencapai kesuksesan? Yuk ikuti webinar #PasarindTalks bersama&nbsp;</p>\\n\\n<p>Catat tanggalnya, ya!<br>\\n📆 Selasa, 26 April 2022<br>\\n⏰ 15.00-16.30 WIB</p>\\n\\n<p>Dapatkan berbagai hadiah menarik TOTAL 3 juta rupiah. Acara ini GRATIS &amp; Registrasi sekarang klik link di BIO atau daftar di Bayarind.co/JoinPasarindTalksEps4</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom", "tanggalMulai": "2022-04-25T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4289/webinar-pasarindtalks", "tanggalMentah": "26  - 26 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-04-25T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.849391	processed
41	https://eventkampus.com	https://eventkampus.com/event/detail/4285/the-52nd-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 52nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 52nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 23 April 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Prof. Dr. Totok Prasetyo, B.Eng (Hons), MT, IPU, Asean.Eng, ACPE - Direktur Politeknik Negeri Semarang<br>\\n2. Aria Pandu Wicaksana, S.E., S.H., M.M. - Ketua STIE IBMT</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC52</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>\\n\\n<p>#eventkampuscom #Eventkampuscom</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4285/the-52nd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "23  - 23 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC52"}, "harga": 0, "judul": "The 52nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.707Z", "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 52nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 23 April 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Prof. Dr. Totok Prasetyo, B.Eng (Hons), MT, IPU, Asean.Eng, ACPE - Direktur Politeknik Negeri Semarang<br>\\n2. Aria Pandu Wicaksana, S.E., S.H., M.M. - Ketua STIE IBMT</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC52</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>\\n\\n<p>#eventkampuscom #Eventkampuscom</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-04-22T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4285/the-52nd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "23  - 23 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC52", "tanggalSelesai": "2022-04-22T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.852602	processed
78	https://eventkampus.com	https://eventkampus.com/event/detail/4481/webinar-kesetaraan-gender	{"_raw": {"harga": 0, "judul": "WEBINAR KESETARAAN GENDER", "kuota": null, "deskripsi": "<p>[FORSA FH UB×PMII HUKUM BRAWIJAYA×FORSIKA FP UB]</p><p><br></p><p>✨Assalamu’alaikum Muslim Brawijaya</p><p><br></p><p>Pernah ngga sih temen temen muslim mendengar isu kesetaraan gender? Kita akan membahas hal ini dari sudut pandang menurut agama.&nbsp;</p><p><br></p><p>Yuk, recharge kembali iman dan semangat hidup kita melalui WEBINAR KESETARAAN GENDER bersama narasumber yang menarik :</p><p>Narasumber 1 : RIFQIL MUSLIM (pengasuh PP Manbaul Hikmah Kendal)</p><p>Narasumber 2 : NUVISA L.M. (Pengasuh PP Khaira Ummah Malang)</p><p>pada :</p><p><br></p><p>🗓 : Minggu, 19 November 2023</p><p>⏰ : 15:00 WIB-selesai&nbsp;</p><p>📌 : zoom meeting</p><p>🔗 : https://bit.ly/WebinarIslam1</p><p><br></p><p><br></p><p>Segera registrasi dan siapkan pertanyaan terbaikmu yaa!☝🏻</p><p><br></p><p>✨Wassalamu'alaikum Warahmatullahi Wabarakatuh</p><p><br></p><p>#forsafhub</p><p>#pmiihukumbrawijaya</p><p>#forsikafpub</p><p><br></p><p>@forsafh</p><p>@pmiihukumbrawijaya</p><p>@forsikafpub</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4481/webinar-kesetaraan-gender", "tanggalMentah": "19  - 19 Nov 2023", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/WebinarIslam1Segera"}, "harga": 0, "judul": "WEBINAR KESETARAAN GENDER", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.186Z", "deskripsi": "<p>[FORSA FH UB×PMII HUKUM BRAWIJAYA×FORSIKA FP UB]</p><p><br></p><p>✨Assalamu’alaikum Muslim Brawijaya</p><p><br></p><p>Pernah ngga sih temen temen muslim mendengar isu kesetaraan gender? Kita akan membahas hal ini dari sudut pandang menurut agama.&nbsp;</p><p><br></p><p>Yuk, recharge kembali iman dan semangat hidup kita melalui WEBINAR KESETARAAN GENDER bersama narasumber yang menarik :</p><p>Narasumber 1 : RIFQIL MUSLIM (pengasuh PP Manbaul Hikmah Kendal)</p><p>Narasumber 2 : NUVISA L.M. (Pengasuh PP Khaira Ummah Malang)</p><p>pada :</p><p><br></p><p>🗓 : Minggu, 19 November 2023</p><p>⏰ : 15:00 WIB-selesai&nbsp;</p><p>📌 : zoom meeting</p><p>🔗 : https://bit.ly/WebinarIslam1</p><p><br></p><p><br></p><p>Segera registrasi dan siapkan pertanyaan terbaikmu yaa!☝🏻</p><p><br></p><p>✨Wassalamu'alaikum Warahmatullahi Wabarakatuh</p><p><br></p><p>#forsafhub</p><p>#pmiihukumbrawijaya</p><p>#forsikafpub</p><p><br></p><p>@forsafh</p><p>@pmiihukumbrawijaya</p><p>@forsikafpub</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2023-11-18T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4481/webinar-kesetaraan-gender", "tanggalMentah": "19  - 19 Nov 2023", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/WebinarIslam1Segera", "tanggalSelesai": "2023-11-18T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.674158	processed
48	https://eventkampus.com	https://eventkampus.com/event/detail/4266/seminar-nasional-mewujudkan-kampus-yang-bersih-dari-kekerasan-seksual-dengan-ngojek	{"_raw": {"harga": 40000, "judul": "SEMINAR NASIONAL \\" Mewujudkan Kampus yang Bersih dari Kekerasan Seksual dengan NGOJEK \\"", "kuota": null, "deskripsi": "<p>Om Swastyastu</p>\\n\\n<p>[Badan Eksekutif Mahasiswa Ikatan Keluarga Besar Mahasiswa Universitas Hindu Indonesia 2021/2022]</p>\\n\\n<p>✨Proundly Present✨<br>\\n\\"SEMINAR NASIONAL\\"&nbsp;<br>\\ndengan tema&nbsp;<br>\\n\\"Mewujudkan Kampus yang Bersih dari Kekerasan Seksual dengan NGOJEK (Ngobrol Jenius Kekinian)\\"</p>\\n\\n<p>\\"With Keynote Speaker 🔊\\" :&nbsp;<br>\\nI Gusti Ayu Bintang Darmawati, S.E,M.Si (Menteri Pemberdayaan Perempuan dan Perlindungan Anak Indonesia)&nbsp;</p>\\n\\n<p>\\"And With Amazing Speaker🗣️\\" :<br>\\n1. Adv.Erlin Cahaya Sugiarti.,SH.MH.<br>\\n(Ketua Umum PAWIN )<br>\\n2. Dr. Ns. Ni Made Dian Sulistiowati, M. Kep, Sp. Kep.J&nbsp;<br>\\n(Trainer Lisa Helpline Indonesia)&nbsp;</p>\\n\\n<p>Moderator 👤 :&nbsp;<br>\\n1. A.A.Ayu Mirah Dwiyanti&nbsp;</p>\\n\\n<p>Yang akan dilaksanakan pada :<br>\\n🗓 Hari/tanggal : Sabtu, 23 April 2022<br>\\n🕗 Waktu : 08.30 - Selesai<br>\\n📍Tempat : Aula Taman Asoka<br>\\nUniversitas Hindu Indonesia&nbsp;<br>\\nJI. Sanggalangit, Tembau, Penatih.&nbsp;<br>\\n👔Dress code : Pakaian Adat + Jas Almamater</p>\\n\\n<p>💸Biaya Pendaftaran Intern Rp. 40.000<br>\\n💸 Biaya Pendaftaran Ekstern Rp. 45.000</p>\\n\\n<p>📥 Includes:<br>\\n✔️Sertifikat&nbsp;<br>\\n✔️2 point di buku panduan&nbsp;<br>\\n✔️Nasi &amp; Snack<br>\\n✔️Live Perfomance Acoustic ( Present UKM PERKUSHI UNHI)&nbsp;</p>\\n\\n<p>‼️Pendaftaran dilaksanakan mulai tanggal 04 April - 19 April 2022&nbsp;</p>\\n\\n<p>‼️Pendaftaran Intern (Mahasiswa Aktif UNHI ) dilakukan di Sekretariat BEM IKBM UNHI dari Pukul 13.00 - 17.00 Wita</p>\\n\\n<p>‼️Untuk Ekstern, pendaftaran bisa dilakukan melalui link : https://bit.ly/3r2jkQv&nbsp;<br>\\nDengan pembayaran melalui rekening BNI berikut : 1233641476 A/N Pande ni pt anggita mahaswari</p>\\n\\n<p>‼️Diinformasikan Bagi Peserta DIWAJIBKAN Untuk Membawa Tumbler (botol minum).&nbsp;</p>\\n\\n<p>Yuk daftar dan tambah wawasan kalian. KUOTA TERBATAS!</p>\\n\\n<p>Info Lebih Lanjut &nbsp;📞:<br>\\n1. Wisnu (08980585830)<br>\\n2. Gungayu (081997855901)</p>\\n\\n<p>Om Shanti, Shanti, Shanti Om</p>", "tipeHarga": "paid", "urlBanner": "", "namaKontak": "1. Wisnu ()", "detailLokasi": "Aula Taman Asoka Universitas Hindu Indonesia", "linkEksternal": "https://eventkampus.com/event/detail/4266/seminar-nasional-mewujudkan-kampus-yang-bersih-dari-kekerasan-seksual-dengan-ngojek", "tanggalMentah": "23  - 23 Apr 2022", "teleponKontak": "08980585830", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/3r2jkQv"}, "harga": 40000, "judul": "SEMINAR NASIONAL \\" Mewujudkan Kampus yang Bersih dari Kekerasan Seksual dengan NGOJEK \\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.838Z", "deskripsi": "<p>Om Swastyastu</p>\\n\\n<p>[Badan Eksekutif Mahasiswa Ikatan Keluarga Besar Mahasiswa Universitas Hindu Indonesia 2021/2022]</p>\\n\\n<p>✨Proundly Present✨<br>\\n\\"SEMINAR NASIONAL\\"&nbsp;<br>\\ndengan tema&nbsp;<br>\\n\\"Mewujudkan Kampus yang Bersih dari Kekerasan Seksual dengan NGOJEK (Ngobrol Jenius Kekinian)\\"</p>\\n\\n<p>\\"With Keynote Speaker 🔊\\" :&nbsp;<br>\\nI Gusti Ayu Bintang Darmawati, S.E,M.Si (Menteri Pemberdayaan Perempuan dan Perlindungan Anak Indonesia)&nbsp;</p>\\n\\n<p>\\"And With Amazing Speaker🗣️\\" :<br>\\n1. Adv.Erlin Cahaya Sugiarti.,SH.MH.<br>\\n(Ketua Umum PAWIN )<br>\\n2. Dr. Ns. Ni Made Dian Sulistiowati, M. Kep, Sp. Kep.J&nbsp;<br>\\n(Trainer Lisa Helpline Indonesia)&nbsp;</p>\\n\\n<p>Moderator 👤 :&nbsp;<br>\\n1. A.A.Ayu Mirah Dwiyanti&nbsp;</p>\\n\\n<p>Yang akan dilaksanakan pada :<br>\\n🗓 Hari/tanggal : Sabtu, 23 April 2022<br>\\n🕗 Waktu : 08.30 - Selesai<br>\\n📍Tempat : Aula Taman Asoka<br>\\nUniversitas Hindu Indonesia&nbsp;<br>\\nJI. Sanggalangit, Tembau, Penatih.&nbsp;<br>\\n👔Dress code : Pakaian Adat + Jas Almamater</p>\\n\\n<p>💸Biaya Pendaftaran Intern Rp. 40.000<br>\\n💸 Biaya Pendaftaran Ekstern Rp. 45.000</p>\\n\\n<p>📥 Includes:<br>\\n✔️Sertifikat&nbsp;<br>\\n✔️2 point di buku panduan&nbsp;<br>\\n✔️Nasi &amp; Snack<br>\\n✔️Live Perfomance Acoustic ( Present UKM PERKUSHI UNHI)&nbsp;</p>\\n\\n<p>‼️Pendaftaran dilaksanakan mulai tanggal 04 April - 19 April 2022&nbsp;</p>\\n\\n<p>‼️Pendaftaran Intern (Mahasiswa Aktif UNHI ) dilakukan di Sekretariat BEM IKBM UNHI dari Pukul 13.00 - 17.00 Wita</p>\\n\\n<p>‼️Untuk Ekstern, pendaftaran bisa dilakukan melalui link : https://bit.ly/3r2jkQv&nbsp;<br>\\nDengan pembayaran melalui rekening BNI berikut : 1233641476 A/N Pande ni pt anggita mahaswari</p>\\n\\n<p>‼️Diinformasikan Bagi Peserta DIWAJIBKAN Untuk Membawa Tumbler (botol minum).&nbsp;</p>\\n\\n<p>Yuk daftar dan tambah wawasan kalian. KUOTA TERBATAS!</p>\\n\\n<p>Info Lebih Lanjut &nbsp;📞:<br>\\n1. Wisnu (08980585830)<br>\\n2. Gungayu (081997855901)</p>\\n\\n<p>Om Shanti, Shanti, Shanti Om</p>", "tipeHarga": "paid", "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "1. Wisnu ()", "detailLokasi": "Aula Taman Asoka Universitas Hindu Indonesia", "tanggalMulai": "2022-04-22T17:00:00.000Z", "tipePlatform": "offline", "linkEksternal": "https://eventkampus.com/event/detail/4266/seminar-nasional-mewujudkan-kampus-yang-bersih-dari-kekerasan-seksual-dengan-ngojek", "tanggalMentah": "23  - 23 Apr 2022", "teleponKontak": "08980585830", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/3r2jkQv", "tanggalSelesai": "2022-04-22T17:00:00.000Z", "confidenceScore": 75, "fieldConfidence": {"harga": 10, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.893739	processed
69	https://eventkampus.com	https://eventkampus.com/event/detail/4211/the-43rd-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 43rd MarkPlus Goes to Campus “Entrepreneurial Marketing\\".", "kuota": null, "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 43rd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 12 Februari 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. Ma’mun Murod, M.Si. - Rektor - Universitas Muhammadiyah Jakarta<br>\\n2. Dr. Yudi Sutarso,SE.,M.Si - Rektor - Universitas Hayam Wuruk Perbanas</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC43 &nbsp;&nbsp;</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4211/the-43rd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "12  - 12 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC43"}, "harga": 0, "judul": "The 43rd MarkPlus Goes to Campus “Entrepreneurial Marketing\\".", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.677Z", "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 43rd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 12 Februari 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. Ma’mun Murod, M.Si. - Rektor - Universitas Muhammadiyah Jakarta<br>\\n2. Dr. Yudi Sutarso,SE.,M.Si - Rektor - Universitas Hayam Wuruk Perbanas</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC43 &nbsp;&nbsp;</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-02-11T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4211/the-43rd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "12  - 12 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC43", "tanggalSelesai": "2022-02-11T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.986808	processed
46	https://eventkampus.com	https://eventkampus.com/event/detail/4268/seminar-nasional-sains-dan-teknologi-informasi	{"_raw": {"harga": 0, "judul": "✨ SEMINAR NASIONAL SAINS DAN TEKNOLOGI INFORMASI ✨", "kuota": null, "deskripsi": "<p>Assalamualaikum Warrahmatullahi Wabarakatuh 📢<br>\\n<br>\\n🎓 BADAN EKSEKUTIF MAHASISWA FAKULTAS FARMASI DAN SAINS UHAMKA 2021-2022 KABINET ANDARE INSIEME🎓<br>\\n------- 𝐏𝐫𝐨𝐮𝐝𝐥𝐲 𝐏𝐫𝐞𝐬𝐞𝐧𝐭 -------<br>\\n<br>\\n✨ SEMINAR NASIONAL SAINS DAN TEKNOLOGI INFORMASI ✨<br>\\n<br>\\nHALO TEMAN-TEMAN MAHASISWA👋<br>\\nApa kabar semuanya? &nbsp;<br>\\nSemoga kalian semua sehat dan selalu dalam lindungan-Nya🙏🏼☺️<br>\\nSemoga pandemi cepat berakhir sehingga kita bisa beraktivitas lagi seperti biasanya.<br>\\nStay safe🙌<br>\\n<br>\\n✨ Kami ingin mengajak Para Mahasiswa Indonesia untuk mengetahui Inovasi Teknologi Informasi pada Ruang Lingkup Kesehatan dalam Meningkatkan Kualitas Pelayanan Kesehatan di Masa Pandemi. Tidak hanya itu, kami juga akan membahas Dampak Pandemi Covid-19 dalam Penggunaan Teknologi serta Strategi Tenaga Kesehatan dalam Memajukan Teknologi Informasi✨<br>\\n<br>\\nPendaftaran :<br>\\nGel. I : 2 s.d 5 April 2022<br>\\nGel. II: 6 s.d&nbsp;9 April 2022<br>\\n<br>\\n🗓️ Tanggal Pelaksanaan :<br>\\n• Minggu,&nbsp;10 April 2022<br>\\n⏱️ Pukul:<br>\\n• 09.00 WIB s.d Selesai<br>\\n<br>\\n💵 HTM :<br>\\nGel.I -&gt; UHAMKA : 35K<br>\\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Umum &nbsp; &nbsp; &nbsp;: 40K<br>\\n<br>\\nGel.II -&gt; UHAMKA : 40K<br>\\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Umum &nbsp; &nbsp; &nbsp;: 50K<br>\\n<br>\\n📜Benefit :<br>\\n- 2 SKP PAFI<br>\\n- 2 SKP IAI<br>\\n- SKPI IT<br>\\n- Doorprize<br>\\n- Ilmu yang bermanfaat<br>\\n- Relasi baru<br>\\n<br>\\nPayment :<br>\\n• BRI : 052801002131534 (a.n Meinisa Rofiqah)<br>\\n• Dana : 082193336945 (a.n Meinisa Rofiqah)<br>\\n<br>\\n📞 Contact Person :<br>\\n•&nbsp;<a href=\\"https://wa.me/+6282193336945\\" target=\\"_blank\\">wa.me/+6282193336945</a>&nbsp;(Meinisa Rofiqah)<br>\\n<br>\\nKami tunggu Partisipasi nya dan JANGAN SAMPAI TELAT DAFTAR YA!! ✨<br>\\n<br>\\n‼️ Pendaftaran Terbatas !!! ‼️<br>\\n<br>\\n📍Visit and Follow Us :<br>\\n📸 Instagram : bem_ffsuhamka<br>\\n📨 Twitter : Bem_ffsuhamka<br>\\n✉️ E-mail :&nbsp;<a href=\\"/cdn-cgi/l/email-protection#1d7f78707b7b6e5d68757c70767c337c7e337479\\" target=\\"_blank\\"><span class=\\"__cf_email__\\" data-cfemail=\\"fb999e969d9d88bb8e939a96909ad59a98d5929f\\">[email&nbsp;protected]</span></a><br>\\n<br>\\nBillahifisabillilhaq Fastabiqul Khoirot<br>\\n📢 𝘞𝘢𝘴𝘴𝘢𝘭𝘢𝘮𝘶𝘢𝘭𝘢𝘪𝘬𝘶𝘮 𝘞𝘢𝘳𝘢𝘩𝘮𝘢𝘵𝘶𝘭𝘭𝘢𝘩𝘪 𝘞𝘢𝘣𝘢𝘳𝘢𝘬𝘢𝘵𝘶𝘩📢</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>#Eventkampuscom #eventkampuscom</p>", "tipeHarga": "paid", "urlBanner": "", "namaKontak": "• Dana   (a.n Meinisa Rofiqah)", "detailLokasi": "Zoom", "linkEksternal": "https://eventkampus.com/event/detail/4268/seminar-nasional-sains-dan-teknologi-informasi", "tanggalMentah": "10  - 10 Apr 2022", "teleponKontak": "082193336945", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://wa.me/+6282193336945"}, "harga": 0, "judul": "✨ SEMINAR NASIONAL SAINS DAN TEKNOLOGI INFORMASI ✨", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.809Z", "deskripsi": "<p>Assalamualaikum Warrahmatullahi Wabarakatuh 📢<br>\\n<br>\\n🎓 BADAN EKSEKUTIF MAHASISWA FAKULTAS FARMASI DAN SAINS UHAMKA 2021-2022 KABINET ANDARE INSIEME🎓<br>\\n------- 𝐏𝐫𝐨𝐮𝐝𝐥𝐲 𝐏𝐫𝐞𝐬𝐞𝐧𝐭 -------<br>\\n<br>\\n✨ SEMINAR NASIONAL SAINS DAN TEKNOLOGI INFORMASI ✨<br>\\n<br>\\nHALO TEMAN-TEMAN MAHASISWA👋<br>\\nApa kabar semuanya? &nbsp;<br>\\nSemoga kalian semua sehat dan selalu dalam lindungan-Nya🙏🏼☺️<br>\\nSemoga pandemi cepat berakhir sehingga kita bisa beraktivitas lagi seperti biasanya.<br>\\nStay safe🙌<br>\\n<br>\\n✨ Kami ingin mengajak Para Mahasiswa Indonesia untuk mengetahui Inovasi Teknologi Informasi pada Ruang Lingkup Kesehatan dalam Meningkatkan Kualitas Pelayanan Kesehatan di Masa Pandemi. Tidak hanya itu, kami juga akan membahas Dampak Pandemi Covid-19 dalam Penggunaan Teknologi serta Strategi Tenaga Kesehatan dalam Memajukan Teknologi Informasi✨<br>\\n<br>\\nPendaftaran :<br>\\nGel. I : 2 s.d 5 April 2022<br>\\nGel. II: 6 s.d&nbsp;9 April 2022<br>\\n<br>\\n🗓️ Tanggal Pelaksanaan :<br>\\n• Minggu,&nbsp;10 April 2022<br>\\n⏱️ Pukul:<br>\\n• 09.00 WIB s.d Selesai<br>\\n<br>\\n💵 HTM :<br>\\nGel.I -&gt; UHAMKA : 35K<br>\\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Umum &nbsp; &nbsp; &nbsp;: 40K<br>\\n<br>\\nGel.II -&gt; UHAMKA : 40K<br>\\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Umum &nbsp; &nbsp; &nbsp;: 50K<br>\\n<br>\\n📜Benefit :<br>\\n- 2 SKP PAFI<br>\\n- 2 SKP IAI<br>\\n- SKPI IT<br>\\n- Doorprize<br>\\n- Ilmu yang bermanfaat<br>\\n- Relasi baru<br>\\n<br>\\nPayment :<br>\\n• BRI : 052801002131534 (a.n Meinisa Rofiqah)<br>\\n• Dana : 082193336945 (a.n Meinisa Rofiqah)<br>\\n<br>\\n📞 Contact Person :<br>\\n•&nbsp;<a href=\\"https://wa.me/+6282193336945\\" target=\\"_blank\\">wa.me/+6282193336945</a>&nbsp;(Meinisa Rofiqah)<br>\\n<br>\\nKami tunggu Partisipasi nya dan JANGAN SAMPAI TELAT DAFTAR YA!! ✨<br>\\n<br>\\n‼️ Pendaftaran Terbatas !!! ‼️<br>\\n<br>\\n📍Visit and Follow Us :<br>\\n📸 Instagram : bem_ffsuhamka<br>\\n📨 Twitter : Bem_ffsuhamka<br>\\n✉️ E-mail :&nbsp;<a href=\\"/cdn-cgi/l/email-protection#1d7f78707b7b6e5d68757c70767c337c7e337479\\" target=\\"_blank\\"><span class=\\"__cf_email__\\" data-cfemail=\\"fb999e969d9d88bb8e939a96909ad59a98d5929f\\">[email&nbsp;protected]</span></a><br>\\n<br>\\nBillahifisabillilhaq Fastabiqul Khoirot<br>\\n📢 𝘞𝘢𝘴𝘴𝘢𝘭𝘢𝘮𝘶𝘢𝘭𝘢𝘪𝘬𝘶𝘮 𝘞𝘢𝘳𝘢𝘩𝘮𝘢𝘵𝘶𝘭𝘭𝘢𝘩𝘪 𝘞𝘢𝘣𝘢𝘳𝘢𝘬𝘢𝘵𝘶𝘩📢</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>#Eventkampuscom #eventkampuscom</p>", "tipeHarga": "paid", "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "• Dana   (a.n Meinisa Rofiqah)", "detailLokasi": "Zoom", "tanggalMulai": "2022-04-09T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4268/seminar-nasional-sains-dan-teknologi-informasi", "tanggalMentah": "10  - 10 Apr 2022", "teleponKontak": "082193336945", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://wa.me/+6282193336945", "tanggalSelesai": "2022-04-09T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.882482	processed
47	https://eventkampus.com	https://eventkampus.com/event/detail/4267/the-51st-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 51st MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 51st MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 09 April 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Padang Wicaksono, S.E., Ph.D - Direktur Vokasi Universitas Indonesia<br>\\n2. Dr. Tri Mardjoko, S.E., M.A - Rektor Universitas Darma Persada</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: &nbsp; &nbsp;<br>\\nhttps://bit.ly/MGTC51</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4267/the-51st-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "09  - 09 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC51"}, "harga": 0, "judul": "The 51st MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.824Z", "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 51st MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 09 April 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Padang Wicaksono, S.E., Ph.D - Direktur Vokasi Universitas Indonesia<br>\\n2. Dr. Tri Mardjoko, S.E., M.A - Rektor Universitas Darma Persada</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: &nbsp; &nbsp;<br>\\nhttps://bit.ly/MGTC51</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-04-08T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4267/the-51st-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "09  - 09 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC51", "tanggalSelesai": "2022-04-08T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.890584	processed
49	https://eventkampus.com	https://eventkampus.com/event/detail/4265/pekan-milenial-naik-kelas	{"_raw": {"harga": 0, "judul": "Pekan Milenial Naik Kelas", "kuota": null, "deskripsi": "<p>Info untuk kamu semua!<br>\\nBisnis Indonesia – Bank BNI mengundang kamu untuk ikutan Pekan Milenial Naik Kelas , acara ini dimulai dari tanggal 5 hingga 7 April 2022 secara hybrid lho!<br>\\n-<br>\\nAkan ada banyak talkshow menarik bersama narasumber yang kredibel dan keren di bidangnya,seperti Rivan Kurniawan, Darmawan Prasodjo, Denni Puspa Purbasari, Prof. Arif Satria, Bryan Octavianus, Jakarta Creative Hub, Yunus Halim, Faiz Ghifari, dan Leontinus Alpha Edison.<br>\\n-<br>\\nAcara ini akan dibuka oleh Presiden Joko Widodo dan Menteri BUMN Erick Thohir lho!<br>\\n-<br>\\nYuk, daftar dan langsung klik link berikut ini bit.ly/milenialnaikkelas akan ada sertifikat khusus buat Mahasiswa.&nbsp;<br>\\n-<br>\\nUntuk info lebih lanjut silahkan cek slide diatas atau dapat menghubungi WA 0815-7467-8001 (Milea) maupun email ke <a href=\\"/cdn-cgi/l/email-protection\\" class=\\"__cf_email__\\" data-cfemail=\\"1d6d78767c737074717873747c71737c74767678717c6e5d7a707c7471337e7270\\">[email&nbsp;protected]</a><br>\\n#bisniscom #eventbisniscom #ekonomi #bisnis #event #internasional #pmn #PekanMilenialNaikkelas</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "", "linkEksternal": "https://eventkampus.com/event/detail/4265/pekan-milenial-naik-kelas", "tanggalMentah": "05  - 07 Apr 2022", "teleponKontak": "081574678001", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "Pekan Milenial Naik Kelas", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.921Z", "deskripsi": "<p>Info untuk kamu semua!<br>\\nBisnis Indonesia – Bank BNI mengundang kamu untuk ikutan Pekan Milenial Naik Kelas , acara ini dimulai dari tanggal 5 hingga 7 April 2022 secara hybrid lho!<br>\\n-<br>\\nAkan ada banyak talkshow menarik bersama narasumber yang kredibel dan keren di bidangnya,seperti Rivan Kurniawan, Darmawan Prasodjo, Denni Puspa Purbasari, Prof. Arif Satria, Bryan Octavianus, Jakarta Creative Hub, Yunus Halim, Faiz Ghifari, dan Leontinus Alpha Edison.<br>\\n-<br>\\nAcara ini akan dibuka oleh Presiden Joko Widodo dan Menteri BUMN Erick Thohir lho!<br>\\n-<br>\\nYuk, daftar dan langsung klik link berikut ini bit.ly/milenialnaikkelas akan ada sertifikat khusus buat Mahasiswa.&nbsp;<br>\\n-<br>\\nUntuk info lebih lanjut silahkan cek slide diatas atau dapat menghubungi WA 0815-7467-8001 (Milea) maupun email ke <a href=\\"/cdn-cgi/l/email-protection\\" class=\\"__cf_email__\\" data-cfemail=\\"1d6d78767c737074717873747c71737c74767678717c6e5d7a707c7471337e7270\\">[email&nbsp;protected]</a><br>\\n#bisniscom #eventbisniscom #ekonomi #bisnis #event #internasional #pmn #PekanMilenialNaikkelas</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "daftar dan langsung klik link berikut ini bit.ly/milenialnaikkelas akan ada sertifikat khusus buat Mahasiswa.&nbsp;<br>\\n-<br>\\nUntuk info lebih lanjut silahkan cek slide diatas atau dapat menghubungi WA 0815-7467-8001 (Milea) maupun email ke <a href=\\"/cdn-cgi/l/email-protection\\" class=\\"__cf_email__\\" data-cfemail=\\"1d6d78767c737074717873747c71737c74767678717c6e5d7a707c7471337e7270\\">[email&nbsp;protected]</a><br>\\n#bisniscom #eventbisniscom #ekonomi #bisnis #event #internasional #pmn #PekanMilenialNaikkelas</p>", "tanggalMulai": "2022-04-04T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4265/pekan-milenial-naik-kelas", "tanggalMentah": "05  - 07 Apr 2022", "teleponKontak": "081574678001", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-04-04T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-27 17:31:56.897955	processed
55	https://eventkampus.com	https://eventkampus.com/event/detail/4248/webinar-nasional-artificial-intelligence	{"_raw": {"harga": 0, "judul": "Webinar Nasional Artificial Intelligence", "kuota": null, "deskripsi": "<p>Hallo semuanyaaaaa 👋🏻</p>\\n\\n<p>📣 HM Sisfo Universitas Dian Nuswantoro Semarang Proudly Present 📣</p>\\n\\n<p>Wahh HM Sisfo balik lagi nih! Yuk gabung bersama kami dalam acara Webinar Nasional Artificial Intelligence 🥳</p>\\n\\n<p>📌 TEMA 📌<br>\\n\\"Toward A Better Future With Artifical Intelligence In New Era\\".</p>\\n\\n<p>Kenapa Webinar ini penting banget buat kalian ikuti?<br>\\nArtificial Intelligence merupakan sebuah program yang memungkinkan komputer untuk berpikir cerdas seperti melakukan analisis, mengambil keputusan, hingga memecahkan masalah seperti atau lebih dari manusia. Karena itu, webinar ini harus banget kalian ikuti untuk dapat mengetahui lebih dalam mengenai teknologi Artificial Intelligence yang dapat menunjang dunia bisnis di Era Baru berbasis teknologi! ✨</p>\\n\\n<p>Save the date ‼️ :<br>\\n📅 : Kamis, 31 Maret 2022<br>\\n⏰ : 09.00 WIB - selesai<br>\\n📍 : Zoom Meeting</p>\\n\\n<p>✨Narasumber ✨ :<br>\\n▪ Prof. Zainal Arifin Hasibuan, Ph.D (Guru Besar Fakultas Ilmu Komputer, Universitas Dian Nuswantoro dan Ketua Umum APTIKOM).<br>\\n▪ Sidik Soleman (AI/ML Engineer di LinkAja).</p>\\n\\n<p>Benefits 🎉 :<br>\\n▪ E-Certificate<br>\\n▪ Soft file materi<br>\\n▪ Relasi</p>\\n\\n<p>Dibuka untuk Umum ‼️<br>\\nHTM Free<br>\\nLink Pendaftaran 🏷️ : https://bit.ly/PendaftaranWebinarAI2022</p>\\n\\n<p>Contact Person<br>\\n👤Fatahillah — 0812-2791-6560<br>\\n👤Indah Anggie — 0877-9776-8458</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": "👤Fatahillah —", "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4248/webinar-nasional-artificial-intelligence", "tanggalMentah": "31  - 31 Mar 2022", "teleponKontak": "081227916560", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/PendaftaranWebinarAI2022"}, "harga": 0, "judul": "Webinar Nasional Artificial Intelligence", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.939Z", "deskripsi": "<p>Hallo semuanyaaaaa 👋🏻</p>\\n\\n<p>📣 HM Sisfo Universitas Dian Nuswantoro Semarang Proudly Present 📣</p>\\n\\n<p>Wahh HM Sisfo balik lagi nih! Yuk gabung bersama kami dalam acara Webinar Nasional Artificial Intelligence 🥳</p>\\n\\n<p>📌 TEMA 📌<br>\\n\\"Toward A Better Future With Artifical Intelligence In New Era\\".</p>\\n\\n<p>Kenapa Webinar ini penting banget buat kalian ikuti?<br>\\nArtificial Intelligence merupakan sebuah program yang memungkinkan komputer untuk berpikir cerdas seperti melakukan analisis, mengambil keputusan, hingga memecahkan masalah seperti atau lebih dari manusia. Karena itu, webinar ini harus banget kalian ikuti untuk dapat mengetahui lebih dalam mengenai teknologi Artificial Intelligence yang dapat menunjang dunia bisnis di Era Baru berbasis teknologi! ✨</p>\\n\\n<p>Save the date ‼️ :<br>\\n📅 : Kamis, 31 Maret 2022<br>\\n⏰ : 09.00 WIB - selesai<br>\\n📍 : Zoom Meeting</p>\\n\\n<p>✨Narasumber ✨ :<br>\\n▪ Prof. Zainal Arifin Hasibuan, Ph.D (Guru Besar Fakultas Ilmu Komputer, Universitas Dian Nuswantoro dan Ketua Umum APTIKOM).<br>\\n▪ Sidik Soleman (AI/ML Engineer di LinkAja).</p>\\n\\n<p>Benefits 🎉 :<br>\\n▪ E-Certificate<br>\\n▪ Soft file materi<br>\\n▪ Relasi</p>\\n\\n<p>Dibuka untuk Umum ‼️<br>\\nHTM Free<br>\\nLink Pendaftaran 🏷️ : https://bit.ly/PendaftaranWebinarAI2022</p>\\n\\n<p>Contact Person<br>\\n👤Fatahillah — 0812-2791-6560<br>\\n👤Indah Anggie — 0877-9776-8458</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "👤Fatahillah —", "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-03-30T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4248/webinar-nasional-artificial-intelligence", "tanggalMentah": "31  - 31 Mar 2022", "teleponKontak": "081227916560", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/PendaftaranWebinarAI2022", "tanggalSelesai": "2022-03-30T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.921252	processed
76	https://eventkampus.com	https://eventkampus.com/event/detail/4493/seminar-nasional-pharmacy-informatics	{"_raw": {"harga": 0, "judul": "SEMINAR NASIONAL Pharmacy Informatics", "kuota": null, "deskripsi": "<p>✨ HIMAFA UNIMMA MEMPERSEMBAHKAN ✨</p><p><br></p><p>Hai, sobat farma!</p><p>HIMAFA UNIMMA mengadakan Seminar Nasional nih, Pada hari Sabtu, 02 Maret 2024 (08.00-Selesai) baik secara offline maupun online.</p><p><br></p><p>💫 SEMINAR NASIONAL 💫</p><p>Dengan Tema \\"Pharmacy Informatics : Developing pharmaceutical service and drug discovery and their use in the era of the industrial revolution 4.0\\"</p><p>&nbsp;</p><p>Tentunya Sobat Farma yang ikut berpartisipasi akan mendapatkan Sertifikat ber-SKP IAI dan PAFI .</p><p>Tunggu apa lagi sobat? Yok segera daftar 🫵🏻</p><p><br></p><p>🗣️ Pemateri :</p><p>1. Apt. Lalu Muhammad Irham M.Farm., Ph.D</p><p>2. Apt.Nadia Saptarina M.Pharm</p><p>3. Arief Kusuma Wardani M.Pharm.S.ci</p><p><br></p><p>👤 Moderator :</p><p>Apt. Herma Fanani Agusta, M.Sc</p><p><br></p><p>&nbsp;OFFLINE&nbsp;</p><p>🏫 Lokasi :</p><p>Auditorium Kampus 1 Unimma</p><p>Jl. Tidar No.21, Magersari, Kec. Magelang Sel., Kota Magelang, Jawa Tengah 59214</p><p><br></p><p>&nbsp;ONLINE&nbsp;</p><p>🖥️Via Zoom Meeting (premium)</p><p><br></p><p>📁 Link pendaftaran :</p><p>https://forms.gle/ctqSbTxKezTtNW2C9</p><p><br></p><p>📞 CP Pendaftaran Seminar Nasional&nbsp;</p><p>🙍‍♀️Annisa Sabila</p><p>+62 859-4368-1140</p><p>🙍‍♀️Tia Meisagita</p><p>+62 887-4004-6524</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Auditorium Kampus 1 Unimma", "linkEksternal": "https://eventkampus.com/event/detail/4493/seminar-nasional-pharmacy-informatics", "tanggalMentah": "02  - 02 Mar 2024", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://forms.gle/ctqSbTxKezTtNW2C9📞"}, "harga": 0, "judul": "SEMINAR NASIONAL Pharmacy Informatics", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:19.862Z", "deskripsi": "<p>✨ HIMAFA UNIMMA MEMPERSEMBAHKAN ✨</p><p><br></p><p>Hai, sobat farma!</p><p>HIMAFA UNIMMA mengadakan Seminar Nasional nih, Pada hari Sabtu, 02 Maret 2024 (08.00-Selesai) baik secara offline maupun online.</p><p><br></p><p>💫 SEMINAR NASIONAL 💫</p><p>Dengan Tema \\"Pharmacy Informatics : Developing pharmaceutical service and drug discovery and their use in the era of the industrial revolution 4.0\\"</p><p>&nbsp;</p><p>Tentunya Sobat Farma yang ikut berpartisipasi akan mendapatkan Sertifikat ber-SKP IAI dan PAFI .</p><p>Tunggu apa lagi sobat? Yok segera daftar 🫵🏻</p><p><br></p><p>🗣️ Pemateri :</p><p>1. Apt. Lalu Muhammad Irham M.Farm., Ph.D</p><p>2. Apt.Nadia Saptarina M.Pharm</p><p>3. Arief Kusuma Wardani M.Pharm.S.ci</p><p><br></p><p>👤 Moderator :</p><p>Apt. Herma Fanani Agusta, M.Sc</p><p><br></p><p>&nbsp;OFFLINE&nbsp;</p><p>🏫 Lokasi :</p><p>Auditorium Kampus 1 Unimma</p><p>Jl. Tidar No.21, Magersari, Kec. Magelang Sel., Kota Magelang, Jawa Tengah 59214</p><p><br></p><p>&nbsp;ONLINE&nbsp;</p><p>🖥️Via Zoom Meeting (premium)</p><p><br></p><p>📁 Link pendaftaran :</p><p>https://forms.gle/ctqSbTxKezTtNW2C9</p><p><br></p><p>📞 CP Pendaftaran Seminar Nasional&nbsp;</p><p>🙍‍♀️Annisa Sabila</p><p>+62 859-4368-1140</p><p>🙍‍♀️Tia Meisagita</p><p>+62 887-4004-6524</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Auditorium Kampus 1 Unimma", "tanggalMulai": "2024-03-01T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4493/seminar-nasional-pharmacy-informatics", "tanggalMentah": "02  - 02 Mar 2024", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://forms.gle/ctqSbTxKezTtNW2C9📞", "tanggalSelesai": "2024-03-01T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-29 01:26:17.530962	processed
54	https://eventkampus.com	https://eventkampus.com/event/detail/4250/hr-competency-regular-class	{"_raw": {"harga": 0, "judul": "HR Competency Regular Class", "kuota": null, "deskripsi": "<p>🔥 DAFTAR 1 DAPAT 4 🔥</p>\\n\\n<p>Hallo Generasi Hebat...<br>\\nAda info baru buat kalian nih&nbsp;</p>\\n\\n<p>HR Competency Regular Class sudah memasuki Batch 29 loh!</p>\\n\\n<p>✍️ INI NIH INFONYA&nbsp;<br>\\nKhusus pendaftaran HR Competency Regular Class 2022 Dapatkan Gratis 3 Pelatihan Workshop kami (Pilih 3) yakni :<br>\\n1. Workshop Recruitment Spesialist<br>\\n2.Workshop Compensation and Benefit<br>\\n3. Workshop Hubungan Industrial<br>\\n4.Workshop OD<br>\\n5. Workshop GA HSE<br>\\n6. Workshop Training &amp; Development</p>\\n\\n<p><br>\\nBenefit Yang didapatkan :<br>\\n1. E-Certificate ✅<br>\\n2. Materi Pelatihan dan Dokumen Pendukungnya ✅<br>\\n3. Gratis Konsultasi materi dan karir ✅<br>\\n4. Program Link and match (Loker HRD di WAG) ✅<br>\\n5. Dapat Mengulang Materi di Batch Selanjutnya ✅</p>\\n\\n<p>Tidak hanya itu,kini<br>\\nJuga bekerjasama dengan BNSP untuk bisa melakukan Uji Sertifikasi Profesi loo 😊😊😊</p>\\n\\n<p>💎Investasi Pelatihan&nbsp;<br>\\n☑️ Mahasiswa 1000k<br>\\n☑️ Umum &nbsp;1250k</p>\\n\\n<p>💎 Investasi Uji Sertifikasi<br>\\nLevel Staff Rp. 850,000<br>\\nLevel Sertifikasi Rp. 1,750,000<br>\\nLevel Manager Rp. 2,700,000</p>\\n\\n<p><br>\\nKapan lagi dapat promo bayar 1 dapat 4 pelatihan 🤗🤗<br>\\nJadi, tunggu apalagi<br>\\nDaftarkan diri anda dan dapatkan manfaatnya ☺️</p>\\n\\n<p>Pendaftaran:<br>\\nTransfer Via BRI 1592.01.000218.30.0 a/n CV AR GENERASI UNGGUL</p>\\n\\n<p>📲: 0857-7274-6073/https://wa.link/5rl0hz (informasi dan pendaftaran)</p>\\n\\n<p>#seleksi #lamarankerja #HRD #PelatihaHRD #biroconsulting #pelatihangratis #pelatihan #consulting #HRDindonesia #Online #psikologi #alattes &nbsp;#pelatihan #workshop #workshoponline #psikolog #HR #perusahaan #lamarankerja #lokerhrd #lokerhrdstaff#workshop#workshophrd#lokerpsikologi#lowonganhukum#lowonganpsikologibalikpapan</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4250/hr-competency-regular-class", "tanggalMentah": "18  - 20 Mar 2022", "teleponKontak": "085772746073", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "HR Competency Regular Class", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.930Z", "deskripsi": "<p>🔥 DAFTAR 1 DAPAT 4 🔥</p>\\n\\n<p>Hallo Generasi Hebat...<br>\\nAda info baru buat kalian nih&nbsp;</p>\\n\\n<p>HR Competency Regular Class sudah memasuki Batch 29 loh!</p>\\n\\n<p>✍️ INI NIH INFONYA&nbsp;<br>\\nKhusus pendaftaran HR Competency Regular Class 2022 Dapatkan Gratis 3 Pelatihan Workshop kami (Pilih 3) yakni :<br>\\n1. Workshop Recruitment Spesialist<br>\\n2.Workshop Compensation and Benefit<br>\\n3. Workshop Hubungan Industrial<br>\\n4.Workshop OD<br>\\n5. Workshop GA HSE<br>\\n6. Workshop Training &amp; Development</p>\\n\\n<p><br>\\nBenefit Yang didapatkan :<br>\\n1. E-Certificate ✅<br>\\n2. Materi Pelatihan dan Dokumen Pendukungnya ✅<br>\\n3. Gratis Konsultasi materi dan karir ✅<br>\\n4. Program Link and match (Loker HRD di WAG) ✅<br>\\n5. Dapat Mengulang Materi di Batch Selanjutnya ✅</p>\\n\\n<p>Tidak hanya itu,kini<br>\\nJuga bekerjasama dengan BNSP untuk bisa melakukan Uji Sertifikasi Profesi loo 😊😊😊</p>\\n\\n<p>💎Investasi Pelatihan&nbsp;<br>\\n☑️ Mahasiswa 1000k<br>\\n☑️ Umum &nbsp;1250k</p>\\n\\n<p>💎 Investasi Uji Sertifikasi<br>\\nLevel Staff Rp. 850,000<br>\\nLevel Sertifikasi Rp. 1,750,000<br>\\nLevel Manager Rp. 2,700,000</p>\\n\\n<p><br>\\nKapan lagi dapat promo bayar 1 dapat 4 pelatihan 🤗🤗<br>\\nJadi, tunggu apalagi<br>\\nDaftarkan diri anda dan dapatkan manfaatnya ☺️</p>\\n\\n<p>Pendaftaran:<br>\\nTransfer Via BRI 1592.01.000218.30.0 a/n CV AR GENERASI UNGGUL</p>\\n\\n<p>📲: 0857-7274-6073/https://wa.link/5rl0hz (informasi dan pendaftaran)</p>\\n\\n<p>#seleksi #lamarankerja #HRD #PelatihaHRD #biroconsulting #pelatihangratis #pelatihan #consulting #HRDindonesia #Online #psikologi #alattes &nbsp;#pelatihan #workshop #workshoponline #psikolog #HR #perusahaan #lamarankerja #lokerhrd #lokerhrdstaff#workshop#workshophrd#lokerpsikologi#lowonganhukum#lowonganpsikologibalikpapan</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-03-17T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4250/hr-competency-regular-class", "tanggalMentah": "18  - 20 Mar 2022", "teleponKontak": "085772746073", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-03-17T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.917744	processed
52	https://eventkampus.com	https://eventkampus.com/event/detail/4259/pasarind-talk-2022	{"_raw": {"harga": 0, "judul": "PASARIND TALK 2022", "kuota": null, "deskripsi": "<p>Ramadhan adalah momen spesial yang ditunggu kehadirannya oleh umat muslim. Selain itu, perayaan hari lebaran juga menjadi momen emas bagi para pebisnis untuk omset yang lebih banyak.</p>\\n\\n<p>Namun, tingkat penjualan akan sangat bergantung pada persiapan dan strategi yang baik agar produk yang dijual mampu menarik perhatian pasar.</p>\\n\\n<p>Seperti apa persiapan dan strategi yang bisa dilakukan para pebisnis agar bisa meningkatkan omzet di momen lebaran? Simak tipsnya di webinar PASARIND POS kali ini bersama @deliaseptianti</p>\\n\\n<p>Catat tanggalnya, ya!<br>\\n📆 Kamis, 31 Maret 2022<br>\\n⏰ 15.00-16.30 WIB</p>\\n\\n<p>Dapatkan berbagai hadiah menarik TOTAL 3 juta rupiah. Acara ini GRATIS &amp; Registrasi sekarang klik link di BIO atau daftar di bayarind.co/JoinPasarindTalksEps3</p>\\n\\n<p>#Pasarindtalks #tipsbisnis #bisnisonline #bisnisonlineshop #bisnispraktis #Eventkampuscom #eventkampuscom</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom", "linkEksternal": "https://eventkampus.com/event/detail/4259/pasarind-talk-2022", "tanggalMentah": "31  - 31 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "PASARIND TALK 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.029Z", "deskripsi": "<p>Ramadhan adalah momen spesial yang ditunggu kehadirannya oleh umat muslim. Selain itu, perayaan hari lebaran juga menjadi momen emas bagi para pebisnis untuk omset yang lebih banyak.</p>\\n\\n<p>Namun, tingkat penjualan akan sangat bergantung pada persiapan dan strategi yang baik agar produk yang dijual mampu menarik perhatian pasar.</p>\\n\\n<p>Seperti apa persiapan dan strategi yang bisa dilakukan para pebisnis agar bisa meningkatkan omzet di momen lebaran? Simak tipsnya di webinar PASARIND POS kali ini bersama @deliaseptianti</p>\\n\\n<p>Catat tanggalnya, ya!<br>\\n📆 Kamis, 31 Maret 2022<br>\\n⏰ 15.00-16.30 WIB</p>\\n\\n<p>Dapatkan berbagai hadiah menarik TOTAL 3 juta rupiah. Acara ini GRATIS &amp; Registrasi sekarang klik link di BIO atau daftar di bayarind.co/JoinPasarindTalksEps3</p>\\n\\n<p>#Pasarindtalks #tipsbisnis #bisnisonline #bisnisonlineshop #bisnispraktis #Eventkampuscom #eventkampuscom</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom", "tanggalMulai": "2022-03-30T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4259/pasarind-talk-2022", "tanggalMentah": "31  - 31 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-03-30T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.90771	processed
98	https://eventkampus.com	https://eventkampus.com/event/detail/4360/the-62nd-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 62nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 62nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 6 Agustus 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Dr. Zahara Tussoleha Rony.M.M., - Wakil Rektor IV Universitas Bhayangkara Jakarta Raya</p><p>2. Dr. Yitno Puguh Martono, S.Sos., M.Si - Dekan FISIP Universitas Surakarta</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC62</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom & Youtube", "linkEksternal": "https://eventkampus.com/event/detail/4360/the-62nd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "06  - 06 Agu 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC62Terima"}, "harga": 0, "judul": "The 62nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.015Z", "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 62nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 6 Agustus 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Dr. Zahara Tussoleha Rony.M.M., - Wakil Rektor IV Universitas Bhayangkara Jakarta Raya</p><p>2. Dr. Yitno Puguh Martono, S.Sos., M.Si - Dekan FISIP Universitas Surakarta</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC62</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom & Youtube", "tanggalMulai": "2022-08-05T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4360/the-62nd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "06  - 06 Agu 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC62Terima", "tanggalSelesai": "2022-08-05T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.753159	processed
77	https://eventkampus.com	https://eventkampus.com/event/detail/4486/tech-outlook-2024-elevating-recruitment-in-the-cloud-era	{"_raw": {"harga": 0, "judul": "Tech Outlook 2024 - Elevating Recruitment in the Cloud Era", "kuota": null, "deskripsi": "<p>Seminar Tech Outlook 2024&nbsp;</p><p><br></p><p>Tahun 2024 akan menjadi tahun yang penuh ketidakpastian dalam perekrutan talenta. Tekanan yang tinggi di pasar kerja mendorong pemimpin bisnis untuk mencari solusi inovatif seperti perekrutan dengan kecerdasan buatan (AI) atau menggunakan platform komputasi awan yang efisien.</p><p>Alibaba Cloud &amp; Jobstreet by SEEK mengundang kamu bergabung di Seminar Tech Outlook 2024 yang akan diisi narasumber : Muhammad Rohibun ( Solution Architect Alibaba Cloud Indonesia )</p><p><br></p><p>Acara :&nbsp;Kamis, 14 Des 2023</p><p>Jam : 12.00 – 16.00 WIB</p><p>Tempat : Bandung</p><p>Link RSVP 👉️ https://zfrmz.com/PVNqoQ7n7WBKTQMq9k4N</p><p><br></p><p>Kuota terbatas, segera daftarkan diri kamu di acara ini ( FREE ).</p><p><br></p><p>#seminarIT #seminarbandung&nbsp;#techoutlook2024 #AlibabaCloud #Jobstreet</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Bandung", "linkEksternal": "https://eventkampus.com/event/detail/4486/tech-outlook-2024-elevating-recruitment-in-the-cloud-era", "tanggalMentah": "14  - 14 Des 2023", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://zfrmz.com/PVNqoQ7n7WBKTQMq9k4NKuota"}, "harga": 0, "judul": "Tech Outlook 2024 - Elevating Recruitment in the Cloud Era", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.060Z", "deskripsi": "<p>Seminar Tech Outlook 2024&nbsp;</p><p><br></p><p>Tahun 2024 akan menjadi tahun yang penuh ketidakpastian dalam perekrutan talenta. Tekanan yang tinggi di pasar kerja mendorong pemimpin bisnis untuk mencari solusi inovatif seperti perekrutan dengan kecerdasan buatan (AI) atau menggunakan platform komputasi awan yang efisien.</p><p>Alibaba Cloud &amp; Jobstreet by SEEK mengundang kamu bergabung di Seminar Tech Outlook 2024 yang akan diisi narasumber : Muhammad Rohibun ( Solution Architect Alibaba Cloud Indonesia )</p><p><br></p><p>Acara :&nbsp;Kamis, 14 Des 2023</p><p>Jam : 12.00 – 16.00 WIB</p><p>Tempat : Bandung</p><p>Link RSVP 👉️ https://zfrmz.com/PVNqoQ7n7WBKTQMq9k4N</p><p><br></p><p>Kuota terbatas, segera daftarkan diri kamu di acara ini ( FREE ).</p><p><br></p><p>#seminarIT #seminarbandung&nbsp;#techoutlook2024 #AlibabaCloud #Jobstreet</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Bandung", "tanggalMulai": "2023-12-13T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4486/tech-outlook-2024-elevating-recruitment-in-the-cloud-era", "tanggalMentah": "14  - 14 Des 2023", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://zfrmz.com/PVNqoQ7n7WBKTQMq9k4NKuota", "tanggalSelesai": "2023-12-13T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-29 01:26:17.671966	processed
59	https://eventkampus.com	https://eventkampus.com/event/detail/4239/the-47th-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 47th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 47th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 12 Maret 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. (Hon.) Jonathan L. Parapak, M.Eng.Sc. - Rektor - Universitas Pelita Harapan (UPH)<br>\\n2. Prof. Dr. Ir. Asep Saefuddin, M.Sc. - Rektor - Universitas Al-Azhar Indonesia</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC47 &nbsp;&nbsp;</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4239/the-47th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "12  - 12 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC47"}, "harga": 0, "judul": "The 47th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.058Z", "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 47th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 12 Maret 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. (Hon.) Jonathan L. Parapak, M.Eng.Sc. - Rektor - Universitas Pelita Harapan (UPH)<br>\\n2. Prof. Dr. Ir. Asep Saefuddin, M.Sc. - Rektor - Universitas Al-Azhar Indonesia</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC47 &nbsp;&nbsp;</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-03-11T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4239/the-47th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "12  - 12 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC47", "tanggalSelesai": "2022-03-11T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.941255	processed
5	https://eventkampus.com	https://eventkampus.com/event/detail/4432/webinar-kesenian-dan-kesehatan-endorfin	{"_raw": {"harga": 0, "judul": "WEBINAR KESENIAN DAN KESEHATAN \\"ENDORFIN\\"", "kuota": null, "deskripsi": "<p>❗️📢[Kementrian Kesenian dan Olahraga BEM FK Universitas Hang Tuah, mempersembahkan]📢❗️</p><p><br></p><p>🎨WEBINAR KESENIAN DAN KESEHATAN \\"ENDORFIN\\" 🎨</p><p><br></p><p>Dengan tema \\"The End of Stressed-Out, The Beginning of Innovation\\" 🧠💡</p><p><br></p><p>Webinar akan diselenggarakan pada:</p><p>📅 : Minggu, 11 Desember 2022</p><p>⏰ : 08.45 - selesai</p><p>📍 : Zoom Meeting</p><p>💸 : Free HTM</p><p><br></p><p>‼️Terbuka untuk Umum‼️</p><p><br></p><p>⬇️Link Pendaftaran ⬇️</p><p>bit.ly/REGISTRASIENDORFIN2022</p><p><br></p><p>Pemateri 1: </p><p>🗣️dr. Ida Rochmawati, M.Sc, Sp.KJ(K)</p><p>(Psikiater dan Penggiat Suicide Prevention, Founder 'Rumah Singgah Matahati')</p><p>🎤Topik: 'Aspek Neurobiologi Berkesenian sebagai Salah Satu Alternatif Kelola Stress'</p><p><br></p><p>Pemateri 2: </p><p>🗣️Mila Rosinta Totoatmojo</p><p>(Influencer Seni Tari, Founder @milaartdanceschool @gaiabymilaro @margariaenomxmilaro)</p><p>🎤Topik: 'Inspirasi Berkarya dari Refleksi Kehidupan'</p><p><br></p><p>‼️FREE REGISTRATION &amp; GET E-CERTIFICATE‼️</p><p><br></p><p>Yuk, Daftarkan segera dirimu!</p><p>Kami tunggu di ENDORFIN 2022 👋</p><p><br></p><p>CP📱</p><p>1. [WA] 0821 3905 8302 [LINE] khairunnisacca -Caca</p><p>2. [WA] 0857 8484 6813 [LINE] kelvinawow -Kelvin</p><p>_______________</p><p><br></p><p>#ENDORFIN2022</p><p>#Kemenkorakopaja</p><p>#BEMFKUHT</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom meeting", "linkEksternal": "https://eventkampus.com/event/detail/4432/webinar-kesenian-dan-kesehatan-endorfin", "tanggalMentah": "11  - 11 Des 2022", "teleponKontak": "082139058302", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "WEBINAR KESENIAN DAN KESEHATAN \\"ENDORFIN\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.209Z", "deskripsi": "<p>❗️📢[Kementrian Kesenian dan Olahraga BEM FK Universitas Hang Tuah, mempersembahkan]📢❗️</p><p><br></p><p>🎨WEBINAR KESENIAN DAN KESEHATAN \\"ENDORFIN\\" 🎨</p><p><br></p><p>Dengan tema \\"The End of Stressed-Out, The Beginning of Innovation\\" 🧠💡</p><p><br></p><p>Webinar akan diselenggarakan pada:</p><p>📅 : Minggu, 11 Desember 2022</p><p>⏰ : 08.45 - selesai</p><p>📍 : Zoom Meeting</p><p>💸 : Free HTM</p><p><br></p><p>‼️Terbuka untuk Umum‼️</p><p><br></p><p>⬇️Link Pendaftaran ⬇️</p><p>bit.ly/REGISTRASIENDORFIN2022</p><p><br></p><p>Pemateri 1: </p><p>🗣️dr. Ida Rochmawati, M.Sc, Sp.KJ(K)</p><p>(Psikiater dan Penggiat Suicide Prevention, Founder 'Rumah Singgah Matahati')</p><p>🎤Topik: 'Aspek Neurobiologi Berkesenian sebagai Salah Satu Alternatif Kelola Stress'</p><p><br></p><p>Pemateri 2: </p><p>🗣️Mila Rosinta Totoatmojo</p><p>(Influencer Seni Tari, Founder @milaartdanceschool @gaiabymilaro @margariaenomxmilaro)</p><p>🎤Topik: 'Inspirasi Berkarya dari Refleksi Kehidupan'</p><p><br></p><p>‼️FREE REGISTRATION &amp; GET E-CERTIFICATE‼️</p><p><br></p><p>Yuk, Daftarkan segera dirimu!</p><p>Kami tunggu di ENDORFIN 2022 👋</p><p><br></p><p>CP📱</p><p>1. [WA] 0821 3905 8302 [LINE] khairunnisacca -Caca</p><p>2. [WA] 0857 8484 6813 [LINE] kelvinawow -Kelvin</p><p>_______________</p><p><br></p><p>#ENDORFIN2022</p><p>#Kemenkorakopaja</p><p>#BEMFKUHT</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom meeting", "tanggalMulai": "2022-12-10T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4432/webinar-kesenian-dan-kesehatan-endorfin", "tanggalMentah": "11  - 11 Des 2022", "teleponKontak": "082139058302", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-12-10T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.653399	processed
82	https://eventkampus.com	https://eventkampus.com/event/detail/4425/the-art-of-arranging-music-with	{"_raw": {"harga": 0, "judul": "The Art of Arranging Music with", "kuota": null, "deskripsi": "<p>[TUNING MASTERCLASS: Abraham Gustavito]</p><p><br></p><p>🤷‍♀️ : Gues Starnya siapa sih, Kak?</p><p><br></p><p>JENG JENG JENGG 🥁🥁</p><p><br></p><p>Guest Star kita adalah... Abraham Gustavito! 🎉🎉</p><p>Hayoloo, siapa yang sering liat beliau di TikTok atau Youtube? Sekarang Luciers bisa ngerasain rasanya diajarin langsung sama sosok satu ini, loh! 😍</p><p><br></p><p>The Art of Arranging Music with ✨Abraham Gustavito✨</p><p><br></p><p>❗SAVE THE DATE❗</p><p>📆19 November 2022</p><p>⏱️11:00 WIB - Selesai&nbsp;</p><p>📍Zoom Meeting</p><p><br></p><p>Benefit:</p><p>- E-Voucher</p><p>- 2 SKKM Ilmiah dan Penalaran&nbsp;</p><p>- 2 SKKM Minat dan Bakat</p><p>*S&amp;K Berlaku</p><p><br></p><p>Regist yourself now!! https://bit.ly/3Nmyvhp</p><p><br></p><p>LINE:</p><p>CP 1: carlaeleanor11&nbsp;</p><p>CP 2: aurelliagl_23</p><p><br></p><p>See you there, Luciers! 😍🙌</p><p>Semoga bisa cepet ketemu Kak Abraham Gustavito, ya~ 🤭</p><p><br></p><p>#Luciole2022</p><p>#VivaLaMusica</p><p>#UMNSymphonyOrchestra #Tuning&nbsp;</p><p>#Masterclass</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4425/the-art-of-arranging-music-with", "tanggalMentah": "19  - 19 Nov 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/3NmyvhpLINE:CP"}, "harga": 0, "judul": "The Art of Arranging Music with", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.373Z", "deskripsi": "<p>[TUNING MASTERCLASS: Abraham Gustavito]</p><p><br></p><p>🤷‍♀️ : Gues Starnya siapa sih, Kak?</p><p><br></p><p>JENG JENG JENGG 🥁🥁</p><p><br></p><p>Guest Star kita adalah... Abraham Gustavito! 🎉🎉</p><p>Hayoloo, siapa yang sering liat beliau di TikTok atau Youtube? Sekarang Luciers bisa ngerasain rasanya diajarin langsung sama sosok satu ini, loh! 😍</p><p><br></p><p>The Art of Arranging Music with ✨Abraham Gustavito✨</p><p><br></p><p>❗SAVE THE DATE❗</p><p>📆19 November 2022</p><p>⏱️11:00 WIB - Selesai&nbsp;</p><p>📍Zoom Meeting</p><p><br></p><p>Benefit:</p><p>- E-Voucher</p><p>- 2 SKKM Ilmiah dan Penalaran&nbsp;</p><p>- 2 SKKM Minat dan Bakat</p><p>*S&amp;K Berlaku</p><p><br></p><p>Regist yourself now!! https://bit.ly/3Nmyvhp</p><p><br></p><p>LINE:</p><p>CP 1: carlaeleanor11&nbsp;</p><p>CP 2: aurelliagl_23</p><p><br></p><p>See you there, Luciers! 😍🙌</p><p>Semoga bisa cepet ketemu Kak Abraham Gustavito, ya~ 🤭</p><p><br></p><p>#Luciole2022</p><p>#VivaLaMusica</p><p>#UMNSymphonyOrchestra #Tuning&nbsp;</p><p>#Masterclass</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-11-18T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4425/the-art-of-arranging-music-with", "tanggalMentah": "19  - 19 Nov 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/3NmyvhpLINE:CP", "tanggalSelesai": "2022-11-18T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.716341	processed
62	https://eventkampus.com	https://eventkampus.com/event/detail/4231/departement-pendidikan-kesehatan-dan-ilmu-perilaku-proudly-presents-seminar-nasional-online	{"_raw": {"harga": 0, "judul": "✨ DEPARTEMENT PENDIDIKAN KESEHATAN DAN ILMU PERILAKU PROUDLY PRESENTS :📣🎉🎉  SEMINAR NASIONAL (ONL", "kuota": null, "deskripsi": "<p>Assalamu'alaikum Wr. Wb.</p>\\n\\n<p>Hello, guys!🙌🏻🙌🏻</p>\\n\\n<p>✨ DEPARTEMENT PENDIDIKAN KESEHATAN DAN ILMU PERILAKU PROUDLY PRESENTS :📣🎉🎉</p>\\n\\n<p>SEMINAR NASIONAL (ONLINE)</p>\\n\\n<p>📌Tema :&nbsp;<br>\\n“Kupas Tuntas : Strategi Promosi Kesehatan Untuk Mencegah Hoax dan Infodemik Mengenai Vaksinasi di Media Sosial”</p>\\n\\n<p>📌Narasumber :&nbsp;<br>\\n1. Dr. dra. Rita Damayanti, MSPH (Ketua Umum Perkumpulan Promotor dan Pendidik Kesehatan<br>\\nMasyarakat Indonesia)<br>\\n2. Atik Qurrota A'Yunin (CPO Jago Preventif)<br>\\n3. drg. Pratiwi, M.Kes (Kepala Dinas Kesehatan Kota Cimahi)</p>\\n\\n<p>📌Keynote Speaker :&nbsp;<br>\\ndr. R. Nina Susana Dewi, SP.PK(K)., M.Kes., MMRS</p>\\n\\n<p>📌Sambutan &nbsp;:<br>\\n1. Letkol Inf. (Purn) Ngatiyana (PLT. Walikota Cimahi)<br>\\n2. Prof. Hikmahanto Juwana, SH, LL.M., Ph.D<br>\\n3. Gunawan Irianto dr.,M.Kes MARS</p>\\n\\n<p>Dilaksanakan pada :&nbsp;<br>\\n🗓️ Sabtu, 05 Maret 2022<br>\\n🕗 08.00 WIB - selesai<br>\\n📱 Via zoom meeting</p>\\n\\n<p>📌Benefits :<br>\\n✔️ Ilmu yang bermanfaat<br>\\n✔️ e-Sertifikat<br>\\n✔️ SKP PPPKMI</p>\\n\\n<p>📌Pendaftaran :&nbsp;<br>\\n26 Februari - 3 Maret 2022<br>\\nbit.ly/PENDAFTARANSEMNASPKIP2022</p>\\n\\n<p>📌 Pembayaran :<br>\\nRekening BNI 0749772158 an Putri Gita</p>\\n\\n<p>📌Contact Person :&nbsp;<br>\\n• 089512385754 (Magna Salsabila)</p>\\n\\n<p>📌 Sosial Media :<br>\\nIg : semnas_pkipunjani&nbsp;</p>\\n\\n<p>UNTUK UMUM DAN MAHASISWA!✨✨</p>\\n\\n<p>Yuk segera daftarkan diri kamu dan dapatkan ilmu serta benefits lainnya!✨🙌🏻🙌🏻</p>\\n\\n<p>#SEMINARNASIONAL<br>\\n#SEMNASPKIPUNJANI<br>\\n#SEMNAS2022<br>\\n#FITKESUNJANICIMAHI</p>", "tipeHarga": "paid", "urlBanner": "", "namaKontak": "•  (Magna Salsabila)", "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4231/departement-pendidikan-kesehatan-dan-ilmu-perilaku-proudly-presents-seminar-nasional-online", "tanggalMentah": "05  - 05 Mar 2022", "teleponKontak": "089512385754", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "✨ DEPARTEMENT PENDIDIKAN KESEHATAN DAN ILMU PERILAKU PROUDLY PRESENTS :📣🎉🎉 SEMINAR NASIONAL (ONL", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.123Z", "deskripsi": "<p>Assalamu'alaikum Wr. Wb.</p>\\n\\n<p>Hello, guys!🙌🏻🙌🏻</p>\\n\\n<p>✨ DEPARTEMENT PENDIDIKAN KESEHATAN DAN ILMU PERILAKU PROUDLY PRESENTS :📣🎉🎉</p>\\n\\n<p>SEMINAR NASIONAL (ONLINE)</p>\\n\\n<p>📌Tema :&nbsp;<br>\\n“Kupas Tuntas : Strategi Promosi Kesehatan Untuk Mencegah Hoax dan Infodemik Mengenai Vaksinasi di Media Sosial”</p>\\n\\n<p>📌Narasumber :&nbsp;<br>\\n1. Dr. dra. Rita Damayanti, MSPH (Ketua Umum Perkumpulan Promotor dan Pendidik Kesehatan<br>\\nMasyarakat Indonesia)<br>\\n2. Atik Qurrota A'Yunin (CPO Jago Preventif)<br>\\n3. drg. Pratiwi, M.Kes (Kepala Dinas Kesehatan Kota Cimahi)</p>\\n\\n<p>📌Keynote Speaker :&nbsp;<br>\\ndr. R. Nina Susana Dewi, SP.PK(K)., M.Kes., MMRS</p>\\n\\n<p>📌Sambutan &nbsp;:<br>\\n1. Letkol Inf. (Purn) Ngatiyana (PLT. Walikota Cimahi)<br>\\n2. Prof. Hikmahanto Juwana, SH, LL.M., Ph.D<br>\\n3. Gunawan Irianto dr.,M.Kes MARS</p>\\n\\n<p>Dilaksanakan pada :&nbsp;<br>\\n🗓️ Sabtu, 05 Maret 2022<br>\\n🕗 08.00 WIB - selesai<br>\\n📱 Via zoom meeting</p>\\n\\n<p>📌Benefits :<br>\\n✔️ Ilmu yang bermanfaat<br>\\n✔️ e-Sertifikat<br>\\n✔️ SKP PPPKMI</p>\\n\\n<p>📌Pendaftaran :&nbsp;<br>\\n26 Februari - 3 Maret 2022<br>\\nbit.ly/PENDAFTARANSEMNASPKIP2022</p>\\n\\n<p>📌 Pembayaran :<br>\\nRekening BNI 0749772158 an Putri Gita</p>\\n\\n<p>📌Contact Person :&nbsp;<br>\\n• 089512385754 (Magna Salsabila)</p>\\n\\n<p>📌 Sosial Media :<br>\\nIg : semnas_pkipunjani&nbsp;</p>\\n\\n<p>UNTUK UMUM DAN MAHASISWA!✨✨</p>\\n\\n<p>Yuk segera daftarkan diri kamu dan dapatkan ilmu serta benefits lainnya!✨🙌🏻🙌🏻</p>\\n\\n<p>#SEMINARNASIONAL<br>\\n#SEMNASPKIPUNJANI<br>\\n#SEMNAS2022<br>\\n#FITKESUNJANICIMAHI</p>", "tipeHarga": "paid", "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "•  (Magna Salsabila)", "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-03-04T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4231/departement-pendidikan-kesehatan-dan-ilmu-perilaku-proudly-presents-seminar-nasional-online", "tanggalMentah": "05  - 05 Mar 2022", "teleponKontak": "089512385754", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-03-04T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.955736	processed
67	https://eventkampus.com	https://eventkampus.com/event/detail/4214/time-to-share-coklat-festival-2022	{"_raw": {"harga": 0, "judul": "🍫🍫 Time to Share Coklat Festival 2022 🍫🍫", "kuota": null, "deskripsi": "<p>🍫🍫 Time to Share Coklat Festival 2022 🍫🍫</p>\\n\\n<p><br>\\nHALLO EVERYONE‼️✨</p>\\n\\n<p>🔖Mau mengembangkan diri?&nbsp;<br>\\n🔖Mau tau kunci kesuksesan?&nbsp;<br>\\n🔖Mau tanya ke narasumber inspiratif?<br>\\n🔖Mau dapat relasi baru?&nbsp;</p>\\n\\n<p>JAWABANYA ADA DI Time to Share ✨</p>\\n\\n<p>Community of Klaten UNS mempersembahkan Time to Share dengan tema \\"Self Improvement : Penguatan Kompetensi Diri dalam Menciptakan Goals Realistis dan Rasional\\"</p>\\n\\n<p>Event ini menggabungkan &nbsp;talkshow dan webinar nasional, sehingga selain materi juga ada tanya jawab untuk menjawab keresahan remaja saat ini.</p>\\n\\n<p>Catat Tanggalnya‼️<br>\\n🗓️ Minggu, 13 Februari 2022<br>\\n⏰ 08.30 WIB - selesai<br>\\n📍 Zoom Cloud Meeting</p>\\n\\n<p>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️<br>\\n🤵🏼‍♀Moderator<br>\\nHana Aulia<br>\\n- BoD of UNS MUN Club<br>\\n- HRD of BEM FEB UNS</p>\\n\\n<p>🤵🏼Pembicara&nbsp;<br>\\nKayyis Hawari<br>\\n- Mahasiswa Fakultas Kedokteran UNS 2017<br>\\n- Menteri Pengembangan Sumberdaya Mahasiswa BEM UNS 2021</p>\\n\\n<p>🗣️ GUEST STAR 🌟<br>\\nAndovi da Lopez</p>\\n\\n<p>🎟️Harga Tiket<br>\\nGelombang 1 : Rp 15.000&nbsp;<br>\\n(06 Januari 2022 - 25 Januari 2022)<br>\\nBuy 10 get 1 free ticket</p>\\n\\n<p>Gelombang 2 : Rp 20.000<br>\\n( 20 Januari 2022 - 10 Februari 2022)<br>\\nBuy 5 get 1 free ticket</p>\\n\\n<p>💌 Benefit<br>\\n- Ilmu yang bermanfaat<br>\\n- E-sertifikat peserta<br>\\n- Relasi<br>\\n- Hadiah Menarik</p>\\n\\n<p>🔗 Link Pendaftaran<br>\\nhttps://rebrand.ly/WebinarSelfImprovement-COKFEST2022</p>\\n\\n<p><br>\\n📱Contact Person<br>\\nArfan : +62 896-6975-3322<br>\\nSasa : +62 858-7790-6783<br>\\nFine : +62 895-3590-30068</p>\\n\\n<p>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</p>\\n\\n<p>More information<br>\\nInstagram : @coklatfest</p>\\n\\n<p><br>\\n#coklatuns<br>\\n#communityofklatenuns<br>\\n#cokfest2022<br>\\n#CoklatFestival2022<br>\\n#seminarnasional<br>\\n#webinarnasional<br>\\n#webinaruns<br>\\n#seminaruns</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4214/time-to-share-coklat-festival-2022", "tanggalMentah": "13  - 13 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "🍫🍫 Time to Share Coklat Festival 2022 🍫🍫", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.172Z", "deskripsi": "<p>🍫🍫 Time to Share Coklat Festival 2022 🍫🍫</p>\\n\\n<p><br>\\nHALLO EVERYONE‼️✨</p>\\n\\n<p>🔖Mau mengembangkan diri?&nbsp;<br>\\n🔖Mau tau kunci kesuksesan?&nbsp;<br>\\n🔖Mau tanya ke narasumber inspiratif?<br>\\n🔖Mau dapat relasi baru?&nbsp;</p>\\n\\n<p>JAWABANYA ADA DI Time to Share ✨</p>\\n\\n<p>Community of Klaten UNS mempersembahkan Time to Share dengan tema \\"Self Improvement : Penguatan Kompetensi Diri dalam Menciptakan Goals Realistis dan Rasional\\"</p>\\n\\n<p>Event ini menggabungkan &nbsp;talkshow dan webinar nasional, sehingga selain materi juga ada tanya jawab untuk menjawab keresahan remaja saat ini.</p>\\n\\n<p>Catat Tanggalnya‼️<br>\\n🗓️ Minggu, 13 Februari 2022<br>\\n⏰ 08.30 WIB - selesai<br>\\n📍 Zoom Cloud Meeting</p>\\n\\n<p>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️<br>\\n🤵🏼‍♀Moderator<br>\\nHana Aulia<br>\\n- BoD of UNS MUN Club<br>\\n- HRD of BEM FEB UNS</p>\\n\\n<p>🤵🏼Pembicara&nbsp;<br>\\nKayyis Hawari<br>\\n- Mahasiswa Fakultas Kedokteran UNS 2017<br>\\n- Menteri Pengembangan Sumberdaya Mahasiswa BEM UNS 2021</p>\\n\\n<p>🗣️ GUEST STAR 🌟<br>\\nAndovi da Lopez</p>\\n\\n<p>🎟️Harga Tiket<br>\\nGelombang 1 : Rp 15.000&nbsp;<br>\\n(06 Januari 2022 - 25 Januari 2022)<br>\\nBuy 10 get 1 free ticket</p>\\n\\n<p>Gelombang 2 : Rp 20.000<br>\\n( 20 Januari 2022 - 10 Februari 2022)<br>\\nBuy 5 get 1 free ticket</p>\\n\\n<p>💌 Benefit<br>\\n- Ilmu yang bermanfaat<br>\\n- E-sertifikat peserta<br>\\n- Relasi<br>\\n- Hadiah Menarik</p>\\n\\n<p>🔗 Link Pendaftaran<br>\\nhttps://rebrand.ly/WebinarSelfImprovement-COKFEST2022</p>\\n\\n<p><br>\\n📱Contact Person<br>\\nArfan : +62 896-6975-3322<br>\\nSasa : +62 858-7790-6783<br>\\nFine : +62 895-3590-30068</p>\\n\\n<p>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</p>\\n\\n<p>More information<br>\\nInstagram : @coklatfest</p>\\n\\n<p><br>\\n#coklatuns<br>\\n#communityofklatenuns<br>\\n#cokfest2022<br>\\n#CoklatFestival2022<br>\\n#seminarnasional<br>\\n#webinarnasional<br>\\n#webinaruns<br>\\n#seminaruns</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-02-12T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4214/time-to-share-coklat-festival-2022", "tanggalMentah": "13  - 13 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-02-12T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.978111	processed
70	https://eventkampus.com	https://eventkampus.com/event/detail/4209/the-42nd-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 42nd MarkPlus Goes to Campus \\"Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Ikuti The 42nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 5 Februari 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Iwan Surjawan, S.TP., M.Sc., Ph.D - Rektor i3L<br>\\n2. Dr. Prakrisno Satrio, S.Psi., M.Si., Psikolog - Wakil Rektor Bidang Akademik dan Kemahasiswaan - Universitas 45 Surabaya</p>\\n\\n<p>Moderator : Taufik – Deputy Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC42 &nbsp;&nbsp;</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4209/the-42nd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "05  - 05 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC42"}, "harga": 0, "judul": "The 42nd MarkPlus Goes to Campus \\"Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.184Z", "deskripsi": "<p>Ikuti The 42nd MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 5 Februari 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Iwan Surjawan, S.TP., M.Sc., Ph.D - Rektor i3L<br>\\n2. Dr. Prakrisno Satrio, S.Psi., M.Si., Psikolog - Wakil Rektor Bidang Akademik dan Kemahasiswaan - Universitas 45 Surabaya</p>\\n\\n<p>Moderator : Taufik – Deputy Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC42 &nbsp;&nbsp;</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-02-04T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4209/the-42nd-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "05  - 05 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC42", "tanggalSelesai": "2022-02-04T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.990858	processed
74	https://eventkampus.com	https://eventkampus.com/event/detail/4200/cokfest-2022-webinar-nasional-self-improvement-penguatan-kompetensi-diri-dalam-menciptakan-goals-realistis-dan-rasional	{"_raw": {"harga": 0, "judul": "COKFEST 2022 WEBINAR NASIONAL \\"Self Improvement : Penguatan Kompetensi Diri dalam Menciptakan Goals ", "kuota": null, "deskripsi": "<p>🍫🍫 Time to Share Coklat Festival 2022 🍫🍫</p><p>&nbsp;</p><p>&nbsp;</p><p>HALLO EVERYONE‼️✨</p><p>&nbsp;</p><p>🔖Mau mengembangkan diri?&nbsp;</p><p>🔖Mau tau kunci kesuksesan?&nbsp;</p><p>🔖Mau tanya ke narasumber inspiratif?</p><p>🔖Mau dapat relasi baru?&nbsp;</p><p>&nbsp;</p><p>JAWABANYA ADA DI Time to Share ✨</p><p>&nbsp;</p><p>Community of Klaten UNS mempersembahkan Time to Share dengan tema \\"Self Improvement : Penguatan Kompetensi Diri dalam Menciptakan Goals Realistis dan Rasional\\"</p><p>&nbsp;</p><p>Event ini menggabungkan&nbsp;talkshow dan webinar nasional, sehingga selain materi juga ada tanya jawab untuk menjawab keresahan remaja saat ini.</p><p>&nbsp;</p><p>Catat Tanggalnya‼️</p><p>🗓️ Minggu, 13 Februari 2022</p><p>⏰ 08.30 WIB - selesai</p><p>📍 Zoom Cloud Meeting</p><p>&nbsp;</p><p>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</p><p>🤵🏼‍♀Moderator</p><p>Hana Aulia</p><p>- BoD of UNS MUN Club</p><p>- HRD of BEM FEB UNS</p><p>&nbsp;</p><p>🤵🏼Pembicara&nbsp;</p><p>Kayyis Hawari</p><p>- Mahasiswa Fakultas Kedokteran UNS 2017</p><p>- Menteri Pengembangan Sumberdaya Mahasiswa BEM UNS 2021</p><p>&nbsp;</p><p>🗣️ GUEST STAR 🌟</p><p>Andovi da Lopez</p><p>&nbsp;</p><p>🎟️Harga Tiket</p><p>Gelombang 1 : Rp 15.000&nbsp;</p><p>(06 Januari 2022 - 25 Januari 2022)</p><p>Buy 10 get 1 free ticket</p><p>&nbsp;</p><p>Gelombang 2 : Rp 20.000</p><p>( 20 Januari 2022 - 10 Februari 2022)</p><p>Buy 5 get 1 free ticket</p><p>&nbsp;</p><p>💌 Benefit</p><p>- Ilmu yang bermanfaat</p><p>- E-sertifikat peserta</p><p>- Relasi</p><p>- Hadiah Menarik</p><p>&nbsp;</p><p>&nbsp;</p><p>📱Contact Person</p><p>Arfan : +62 896-6975-3322</p><p>Sasa : +62 858-7790-6783</p><p>Fine : +62 895-3590-30068</p><p>&nbsp;</p><p>&nbsp;</p><p>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</p><p>&nbsp;</p><p>More information</p><p>Instagram : @coklatfest</p><p>&nbsp;</p><p>&nbsp;</p><p>#coklatuns</p><p>#communityofklatenuns</p><p>#cokfest2022</p><p>#CoklatFestival2022</p><p>#seminarnasional</p><p>#webinarnasional</p><p>#webinaruns</p><p>#seminaruns</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Via Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4200/cokfest-2022-webinar-nasional-self-improvement-penguatan-kompetensi-diri-dalam-menciptakan-goals-realistis-dan-rasional", "tanggalMentah": "13  - 13 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "COKFEST 2022 WEBINAR NASIONAL \\"Self Improvement : Penguatan Kompetensi Diri dalam Menciptakan Goals", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.192Z", "deskripsi": "<p>🍫🍫 Time to Share Coklat Festival 2022 🍫🍫</p><p>&nbsp;</p><p>&nbsp;</p><p>HALLO EVERYONE‼️✨</p><p>&nbsp;</p><p>🔖Mau mengembangkan diri?&nbsp;</p><p>🔖Mau tau kunci kesuksesan?&nbsp;</p><p>🔖Mau tanya ke narasumber inspiratif?</p><p>🔖Mau dapat relasi baru?&nbsp;</p><p>&nbsp;</p><p>JAWABANYA ADA DI Time to Share ✨</p><p>&nbsp;</p><p>Community of Klaten UNS mempersembahkan Time to Share dengan tema \\"Self Improvement : Penguatan Kompetensi Diri dalam Menciptakan Goals Realistis dan Rasional\\"</p><p>&nbsp;</p><p>Event ini menggabungkan&nbsp;talkshow dan webinar nasional, sehingga selain materi juga ada tanya jawab untuk menjawab keresahan remaja saat ini.</p><p>&nbsp;</p><p>Catat Tanggalnya‼️</p><p>🗓️ Minggu, 13 Februari 2022</p><p>⏰ 08.30 WIB - selesai</p><p>📍 Zoom Cloud Meeting</p><p>&nbsp;</p><p>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</p><p>🤵🏼‍♀Moderator</p><p>Hana Aulia</p><p>- BoD of UNS MUN Club</p><p>- HRD of BEM FEB UNS</p><p>&nbsp;</p><p>🤵🏼Pembicara&nbsp;</p><p>Kayyis Hawari</p><p>- Mahasiswa Fakultas Kedokteran UNS 2017</p><p>- Menteri Pengembangan Sumberdaya Mahasiswa BEM UNS 2021</p><p>&nbsp;</p><p>🗣️ GUEST STAR 🌟</p><p>Andovi da Lopez</p><p>&nbsp;</p><p>🎟️Harga Tiket</p><p>Gelombang 1 : Rp 15.000&nbsp;</p><p>(06 Januari 2022 - 25 Januari 2022)</p><p>Buy 10 get 1 free ticket</p><p>&nbsp;</p><p>Gelombang 2 : Rp 20.000</p><p>( 20 Januari 2022 - 10 Februari 2022)</p><p>Buy 5 get 1 free ticket</p><p>&nbsp;</p><p>💌 Benefit</p><p>- Ilmu yang bermanfaat</p><p>- E-sertifikat peserta</p><p>- Relasi</p><p>- Hadiah Menarik</p><p>&nbsp;</p><p>&nbsp;</p><p>📱Contact Person</p><p>Arfan : +62 896-6975-3322</p><p>Sasa : +62 858-7790-6783</p><p>Fine : +62 895-3590-30068</p><p>&nbsp;</p><p>&nbsp;</p><p>〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️</p><p>&nbsp;</p><p>More information</p><p>Instagram : @coklatfest</p><p>&nbsp;</p><p>&nbsp;</p><p>#coklatuns</p><p>#communityofklatenuns</p><p>#cokfest2022</p><p>#CoklatFestival2022</p><p>#seminarnasional</p><p>#webinarnasional</p><p>#webinaruns</p><p>#seminaruns</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Via Zoom Meeting", "tanggalMulai": "2022-02-12T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4200/cokfest-2022-webinar-nasional-self-improvement-penguatan-kompetensi-diri-dalam-menciptakan-goals-realistis-dan-rasional", "tanggalMentah": "13  - 13 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-02-12T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:57.003455	processed
26	https://eventkampus.com	https://eventkampus.com/event/detail/4340/talkshow-fourtyfive-station-2022	{"_raw": {"harga": 35000, "judul": "TALKSHOW FOURTYFIVE STATION 2022", "kuota": null, "deskripsi": "<p>[TALKSHOW FOURTYFIVE STATION 2022]</p><p><br></p><p>Sobat Muda mau tau peran Radio terhadap industri kreatif berbasis audio di era digital? Dengan pembicara yang sudah berpengalaman di bidangnya?!</p><p><br></p><p>‼️HADIRI &amp; CATAT TANGGALNYA‼️</p><p><br></p><p>🗓: Sabtu, 16 Juli 2022</p><p>⏰: 08.30 - 11.00 WIB</p><p>📍: UPN Veteran Jakarta</p><p><br></p><p>📣 TERBUKA UNTUK UMUM 📣</p><p><br></p><p>PEMBICARA:</p><p>🎙 Imam Darto - Ex Announcer Prambors Radio dan Podcaster “PODKESMAS”</p><p>🎙 Bobby Mandela - Ex Announcer Hard Rock FM dan Podcaster “BKR Brothers”</p><p><br></p><p>Ditemani La Ode Wahid sebagai Moderator dan Hafizh bersama Adi sebagai MC.</p><p><br></p><p>💰HTM: Rp35.000,-</p><p><br></p><p>Segera daftar disini! 👇🏼</p><p>bit.ly/TalkshowFS2022</p><p><br></p><p>Info lebih lanjut, harap hubungi:</p><p>📲 Hitana Thafa&nbsp;</p><p>Whatsapp: 082113181352</p><p>ID Line: hitanathaf&nbsp;</p><p>📲 Marsya Alifia</p><p>Whatsapp: 081282102653</p><p>ID Line: alifiamarsyaa</p>", "tipeHarga": "paid", "urlBanner": "", "namaKontak": null, "detailLokasi": "UPN Veteran Jakarta", "linkEksternal": "https://eventkampus.com/event/detail/4340/talkshow-fourtyfive-station-2022", "tanggalMentah": "16  - 16 Jul 2022", "teleponKontak": "082113181352", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 35000, "judul": "TALKSHOW FOURTYFIVE STATION 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.297Z", "deskripsi": "<p>[TALKSHOW FOURTYFIVE STATION 2022]</p><p><br></p><p>Sobat Muda mau tau peran Radio terhadap industri kreatif berbasis audio di era digital? Dengan pembicara yang sudah berpengalaman di bidangnya?!</p><p><br></p><p>‼️HADIRI &amp; CATAT TANGGALNYA‼️</p><p><br></p><p>🗓: Sabtu, 16 Juli 2022</p><p>⏰: 08.30 - 11.00 WIB</p><p>📍: UPN Veteran Jakarta</p><p><br></p><p>📣 TERBUKA UNTUK UMUM 📣</p><p><br></p><p>PEMBICARA:</p><p>🎙 Imam Darto - Ex Announcer Prambors Radio dan Podcaster “PODKESMAS”</p><p>🎙 Bobby Mandela - Ex Announcer Hard Rock FM dan Podcaster “BKR Brothers”</p><p><br></p><p>Ditemani La Ode Wahid sebagai Moderator dan Hafizh bersama Adi sebagai MC.</p><p><br></p><p>💰HTM: Rp35.000,-</p><p><br></p><p>Segera daftar disini! 👇🏼</p><p>bit.ly/TalkshowFS2022</p><p><br></p><p>Info lebih lanjut, harap hubungi:</p><p>📲 Hitana Thafa&nbsp;</p><p>Whatsapp: 082113181352</p><p>ID Line: hitanathaf&nbsp;</p><p>📲 Marsya Alifia</p><p>Whatsapp: 081282102653</p><p>ID Line: alifiamarsyaa</p>", "tipeHarga": "paid", "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "UPN Veteran Jakarta", "tanggalMulai": "2022-07-15T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4340/talkshow-fourtyfive-station-2022", "tanggalMentah": "16  - 16 Jul 2022", "teleponKontak": "082113181352", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-07-15T17:00:00.000Z", "confidenceScore": 60, "fieldConfidence": {"harga": 10, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-27 17:31:56.772261	processed
35	https://eventkampus.com	https://eventkampus.com/event/detail/4317/digital-literacy-talkshow-keeping-up-with-digital-transformation-why-not	{"_raw": {"harga": 0, "judul": "Digital Literacy Talkshow: \\"Keeping Up with Digital Transformation, WHY NOT?\\"", "kuota": null, "deskripsi": "<p>✨DIGITAL LITERACY TALKSHOW✨</p><p>Presented by: MercuFest 2022</p><p><br></p><p>Hai MercuFriends!</p><p>Yuk ikutan Talkshow Digital Literacy, kamu akan mendapatkan banyak pengetahuan baru dan benefit lainnya di acara ini. Tentunya akan sangat bermanfaat buat teman-teman semua...</p><p><br></p><p>Digital Literacy Talkshow: \\"Keeping Up with Digital Transformation, WHY NOT?\\"</p><p><br></p><p>Pembicara:</p><p>• Gabrielle L. Evans (Influencers &amp; Social Media Specialist at USS Networks)</p><p>• Dian Agustine N (Founder &amp; Principal Consultant NAGARU Communication)</p><p><br></p><p>Special Performance:</p><p>• Sandy Yehezkiel (Pianist)</p><p><br></p><p>Host:</p><p>• Afifah Khairunnisa</p><p><br></p><p>Benefit:</p><p>✅ E-Certificate</p><p>✅ Giveaway/Doorprize</p><p>✅ Merchandise</p><p><br></p><p>📢Save the date and don't miss it!📢</p><p>🗓️ Minggu, 5 Juni 2022</p><p>🕑 13.00-15.00 WIB</p><p>📍Live Via ZOOM</p><p>💸 HTM FREE</p><p><br></p><p>Yuk segera daftarkan dirimu di link berikut,</p><p>https://bit.ly/DaftarTalkshowMercuFest2022</p><p><br></p><p>Nanti juga akan ada pengumuman pemenang kompetisi vidio dan poster🥳</p><p><br></p><p>Jangan lupa juga untuk follow Instagram @mercu_fest yaa..</p><p><br></p><p>📞Contac Person:</p><p>Arfan: 0878-0939-7306</p><p>Nina: 0812-9387-9225</p><p><br></p><p>See you... Kita tunggu kehadiran kalian yaaa✨</p><p><br></p><p>#MercuFest2022 #UMBSupportG20 #webinar2022 #UMB #WebinarSertifikatMercuFest2022 #kamibanggaumb #universitasmercubuana #eventkampus #seminar</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4317/digital-literacy-talkshow-keeping-up-with-digital-transformation-why-not", "tanggalMentah": "05  - 05 Jun 2022", "teleponKontak": "087809397306", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/DaftarTalkshowMercuFest2022Nanti"}, "harga": 0, "judul": "Digital Literacy Talkshow: \\"Keeping Up with Digital Transformation, WHY NOT?\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.460Z", "deskripsi": "<p>✨DIGITAL LITERACY TALKSHOW✨</p><p>Presented by: MercuFest 2022</p><p><br></p><p>Hai MercuFriends!</p><p>Yuk ikutan Talkshow Digital Literacy, kamu akan mendapatkan banyak pengetahuan baru dan benefit lainnya di acara ini. Tentunya akan sangat bermanfaat buat teman-teman semua...</p><p><br></p><p>Digital Literacy Talkshow: \\"Keeping Up with Digital Transformation, WHY NOT?\\"</p><p><br></p><p>Pembicara:</p><p>• Gabrielle L. Evans (Influencers &amp; Social Media Specialist at USS Networks)</p><p>• Dian Agustine N (Founder &amp; Principal Consultant NAGARU Communication)</p><p><br></p><p>Special Performance:</p><p>• Sandy Yehezkiel (Pianist)</p><p><br></p><p>Host:</p><p>• Afifah Khairunnisa</p><p><br></p><p>Benefit:</p><p>✅ E-Certificate</p><p>✅ Giveaway/Doorprize</p><p>✅ Merchandise</p><p><br></p><p>📢Save the date and don't miss it!📢</p><p>🗓️ Minggu, 5 Juni 2022</p><p>🕑 13.00-15.00 WIB</p><p>📍Live Via ZOOM</p><p>💸 HTM FREE</p><p><br></p><p>Yuk segera daftarkan dirimu di link berikut,</p><p>https://bit.ly/DaftarTalkshowMercuFest2022</p><p><br></p><p>Nanti juga akan ada pengumuman pemenang kompetisi vidio dan poster🥳</p><p><br></p><p>Jangan lupa juga untuk follow Instagram @mercu_fest yaa..</p><p><br></p><p>📞Contac Person:</p><p>Arfan: 0878-0939-7306</p><p>Nina: 0812-9387-9225</p><p><br></p><p>See you... Kita tunggu kehadiran kalian yaaa✨</p><p><br></p><p>#MercuFest2022 #UMBSupportG20 #webinar2022 #UMB #WebinarSertifikatMercuFest2022 #kamibanggaumb #universitasmercubuana #eventkampus #seminar</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-06-04T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4317/digital-literacy-talkshow-keeping-up-with-digital-transformation-why-not", "tanggalMentah": "05  - 05 Jun 2022", "teleponKontak": "087809397306", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/DaftarTalkshowMercuFest2022Nanti", "tanggalSelesai": "2022-06-04T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.815323	processed
29	https://eventkampus.com	https://eventkampus.com/event/detail/4327/the-56th-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 56th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 56th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 11 Juni 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Prof. Dr. H. Maskuri, M.Si -&nbsp;</p><p>Rektor Universitas Islam Malang</p><p>2. Prof. Dr. Garuda Wiko ,S.H., M.Si.- Rektor Universitas Tanjungpura</p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC56</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4327/the-56th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "11  - 11 Jun 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC56Terima"}, "harga": 0, "judul": "The 56th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.485Z", "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 56th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 11 Juni 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Prof. Dr. H. Maskuri, M.Si -&nbsp;</p><p>Rektor Universitas Islam Malang</p><p>2. Prof. Dr. Garuda Wiko ,S.H., M.Si.- Rektor Universitas Tanjungpura</p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC56</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-06-10T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4327/the-56th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "11  - 11 Jun 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC56Terima", "tanggalSelesai": "2022-06-10T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.782204	processed
51	https://eventkampus.com	https://eventkampus.com/event/detail/4264/the-50th-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 50th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 50th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 02 April 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. Ednawan Prihana M.Si - Wakil Rektor I - Universitas Pramita Indonesia&nbsp;<br>\\n2. Dr. Jozef R Raco, M. Sc - Wakil Rektor Bidang Penelitian dan Kerjasama - Unika De La Salle Manado&nbsp;</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: &nbsp; &nbsp;<br>\\nhttps://bit.ly/MGTC50</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4264/the-50th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "02  - 02 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC50"}, "harga": 0, "judul": "The 50th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.460Z", "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 50th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 02 April 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. Ednawan Prihana M.Si - Wakil Rektor I - Universitas Pramita Indonesia&nbsp;<br>\\n2. Dr. Jozef R Raco, M. Sc - Wakil Rektor Bidang Penelitian dan Kerjasama - Unika De La Salle Manado&nbsp;</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: &nbsp; &nbsp;<br>\\nhttps://bit.ly/MGTC50</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-04-01T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4264/the-50th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "02  - 02 Apr 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC50", "tanggalSelesai": "2022-04-01T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.902617	processed
38	https://eventkampus.com	https://eventkampus.com/event/detail/4301/webinar-himdi-01-compact-living	{"_raw": {"harga": 0, "judul": "Webinar HIMDI 0.1 “Compact Living”", "kuota": null, "deskripsi": "<p>Hello Young Designers ‼️</p><p><br></p><p>HIMDI Binus University proudly present Webinar HIMDI 0.1 “Compact Living”</p><p><br></p><p>Webinar ini bertujuan untuk memberikan wawasan tambahan bagi para mahasiswa/i desain interior dan sekitarnya tentang bagaimana cara mengembagkan ruangan yang berfokus pada keseimbangan, keharmonian, dan relaksasi pada designnya untuk menghadirkan suasana ketenangan dan meningkatkan kualitas hidup melalui kesederhanaan.</p><p>&nbsp;</p><p>🗣: Budi Setiawan</p><p>Interior Designer and Lecturer</p><p>&nbsp;</p><p>🗣: Josephine Glenis</p><p>Founder/Principle at Bikin Betah</p><p><br></p><p><br></p><p>🗓 : Sabtu, 21 Mei 2022</p><p>⏰ : 13.00 WIB - 15.30 WIB</p><p>📍: Zoom Meeting</p><p><br></p><p>Benefits :</p><p>✅Knowledge from Expert</p><p>✅SAT Points</p><p>✅E-Certificate</p><p><br></p><p>This webinar is open for public❗️</p><p><br></p><p>💸 Prices :</p><p>BINUSIAN : 15K/person</p><p>NON BINUSIAN : 20K/person</p><p><br></p><p>For Registration :</p><p>https://bit.ly/SeminarHIMDI</p><p><br></p><p>For Further Information :</p><p>📱Kennan: kennan.go /&nbsp;089601428500</p><p>📱Felita :&nbsp;felitaas31 /</p><p>081288393855</p><p><br></p><p>SEE YOU THERE ‼️</p><p><br></p><p>#eventkampus #seminar #webinar</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4301/webinar-himdi-01-compact-living", "tanggalMentah": "21  - 21 Mei 2022", "teleponKontak": "089601428500", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/SeminarHIMDIFor"}, "harga": 0, "judul": "Webinar HIMDI 0.1 “Compact Living”", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.611Z", "deskripsi": "<p>Hello Young Designers ‼️</p><p><br></p><p>HIMDI Binus University proudly present Webinar HIMDI 0.1 “Compact Living”</p><p><br></p><p>Webinar ini bertujuan untuk memberikan wawasan tambahan bagi para mahasiswa/i desain interior dan sekitarnya tentang bagaimana cara mengembagkan ruangan yang berfokus pada keseimbangan, keharmonian, dan relaksasi pada designnya untuk menghadirkan suasana ketenangan dan meningkatkan kualitas hidup melalui kesederhanaan.</p><p>&nbsp;</p><p>🗣: Budi Setiawan</p><p>Interior Designer and Lecturer</p><p>&nbsp;</p><p>🗣: Josephine Glenis</p><p>Founder/Principle at Bikin Betah</p><p><br></p><p><br></p><p>🗓 : Sabtu, 21 Mei 2022</p><p>⏰ : 13.00 WIB - 15.30 WIB</p><p>📍: Zoom Meeting</p><p><br></p><p>Benefits :</p><p>✅Knowledge from Expert</p><p>✅SAT Points</p><p>✅E-Certificate</p><p><br></p><p>This webinar is open for public❗️</p><p><br></p><p>💸 Prices :</p><p>BINUSIAN : 15K/person</p><p>NON BINUSIAN : 20K/person</p><p><br></p><p>For Registration :</p><p>https://bit.ly/SeminarHIMDI</p><p><br></p><p>For Further Information :</p><p>📱Kennan: kennan.go /&nbsp;089601428500</p><p>📱Felita :&nbsp;felitaas31 /</p><p>081288393855</p><p><br></p><p>SEE YOU THERE ‼️</p><p><br></p><p>#eventkampus #seminar #webinar</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-05-20T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4301/webinar-himdi-01-compact-living", "tanggalMentah": "21  - 21 Mei 2022", "teleponKontak": "089601428500", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/SeminarHIMDIFor", "tanggalSelesai": "2022-05-20T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.8391	processed
71	https://eventkampus.com	https://eventkampus.com/event/detail/4206/webinar-series-keyfest-2022-safe-financially-smooth-career	{"_raw": {"harga": 0, "judul": "WEBINAR SERIES KEYFEST 2022 \\"Safe Financially Smooth Career\\"", "kuota": null, "deskripsi": "<p>[ WEBINAR SERIES KEYFEST 2022 ]&nbsp;</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Hai guys!!</p>\\n\\n<p>Yang ditunggu-tunggu telah tiba nihh🥳🥳</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Webinar Series Keyfest 2022!!!</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Pada webinar kali ini kita mengangkat tema \\"Safe Financially Smooth Career\\".</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Bagi kalian yang ingin mendapatkan pengalaman lebih dalam bidang finansial, wajib bangettt ikutan Webinar Series dari Keyfest 2022 kali ini. Karena Pembicara yang akan mengisi materi pada kesempatan kali ini tentunya berpengalaman dalam bidang nya lohhh 🤩</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Open Registration : 24 Januari - 10 Februari 2022</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Jika terdapat pertanyaan dapat melalui Contact Person dibawah ini.</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>- Muthia</p>\\n\\n<p>whatsapp : 085899002091</p>\\n\\n<p>ID line : shafiracems</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>- Siska Setiawati</p>\\n\\n<p>Whatsapp : +62 877-1026-2316</p>\\n\\n<p>Id line : siskasetiawati14</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>See You🤗</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>For more information :</p>\\n\\n<p>Instagram : @keyfest2022</p>\\n\\n<p>Line : @556hmxsc</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>#KEYFEST2022</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": "whatsapp", "detailLokasi": "Via Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4206/webinar-series-keyfest-2022-safe-financially-smooth-career", "tanggalMentah": "05  - 19 Feb 2022", "teleponKontak": "085899002091", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "WEBINAR SERIES KEYFEST 2022 \\"Safe Financially Smooth Career\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.567Z", "deskripsi": "<p>[ WEBINAR SERIES KEYFEST 2022 ]&nbsp;</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Hai guys!!</p>\\n\\n<p>Yang ditunggu-tunggu telah tiba nihh🥳🥳</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Webinar Series Keyfest 2022!!!</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Pada webinar kali ini kita mengangkat tema \\"Safe Financially Smooth Career\\".</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Bagi kalian yang ingin mendapatkan pengalaman lebih dalam bidang finansial, wajib bangettt ikutan Webinar Series dari Keyfest 2022 kali ini. Karena Pembicara yang akan mengisi materi pada kesempatan kali ini tentunya berpengalaman dalam bidang nya lohhh 🤩</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Open Registration : 24 Januari - 10 Februari 2022</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>Jika terdapat pertanyaan dapat melalui Contact Person dibawah ini.</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>- Muthia</p>\\n\\n<p>whatsapp : 085899002091</p>\\n\\n<p>ID line : shafiracems</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>- Siska Setiawati</p>\\n\\n<p>Whatsapp : +62 877-1026-2316</p>\\n\\n<p>Id line : siskasetiawati14</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>See You🤗</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>For more information :</p>\\n\\n<p>Instagram : @keyfest2022</p>\\n\\n<p>Line : @556hmxsc</p>\\n\\n<p>&nbsp;</p>\\n\\n<p>#KEYFEST2022</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "whatsapp", "detailLokasi": "Via Zoom Meeting", "tanggalMulai": "2022-02-04T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4206/webinar-series-keyfest-2022-safe-financially-smooth-career", "tanggalMentah": "05  - 19 Feb 2022", "teleponKontak": "085899002091", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-02-04T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.994111	processed
81	https://eventkampus.com	https://eventkampus.com/event/detail/4429/devfest-bogor-2022-move-together-for-further	{"_raw": {"harga": 0, "judul": "Devfest Bogor 2022 “Move Together for Further”", "kuota": null, "deskripsi": "<p>Here it is !</p><p><br></p><p>GDG Bogor is proud to present Devfest Bogor 2022 “Move Together for Further”</p><p>Connects Professional developers, Google Developer Experts, Technical leaders, Freelancers, Students, and Tech enthusiasts.</p><p><br></p><p>🗓 Saturday, December 3rd 2022</p><p>📍 GD, Poetri Ballroom, Bogor&nbsp;</p><p><br></p><p>Let’s learn, get inspired, and connect by registering for Free !!</p><p>The event detail and registration link :&nbsp;</p><p><br></p><p>https://bit.ly/devfest-bogor-2022</p><p><br></p><p>#devfestbogor #technology #gdg #gdgbogor #wtm #womentechmakers</p><p>#technology #development #networking #devfest #gdgdevfest&nbsp;#devfestbogor2022 #devfest2022</p><p><br></p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "GD, Poetri Ballroom, Bogor", "linkEksternal": "https://eventkampus.com/event/detail/4429/devfest-bogor-2022-move-together-for-further", "tanggalMentah": "03  - 03 Des 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/devfest-bogor-2022#devfestbogor"}, "harga": 0, "judul": "Devfest Bogor 2022 “Move Together for Further”", "kuota": null, "kotaId": 161, "cleanedAt": "2026-06-28T18:30:20.354Z", "deskripsi": "<p>Here it is !</p><p><br></p><p>GDG Bogor is proud to present Devfest Bogor 2022 “Move Together for Further”</p><p>Connects Professional developers, Google Developer Experts, Technical leaders, Freelancers, Students, and Tech enthusiasts.</p><p><br></p><p>🗓 Saturday, December 3rd 2022</p><p>📍 GD, Poetri Ballroom, Bogor&nbsp;</p><p><br></p><p>Let’s learn, get inspired, and connect by registering for Free !!</p><p>The event detail and registration link :&nbsp;</p><p><br></p><p>https://bit.ly/devfest-bogor-2022</p><p><br></p><p>#devfestbogor #technology #gdg #gdgbogor #wtm #womentechmakers</p><p>#technology #development #networking #devfest #gdgdevfest&nbsp;#devfestbogor2022 #devfest2022</p><p><br></p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "GD, Poetri Ballroom, Bogor", "tanggalMulai": "2022-12-02T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4429/devfest-bogor-2022-move-together-for-further", "tanggalMentah": "03  - 03 Des 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/devfest-bogor-2022#devfestbogor", "tanggalSelesai": "2022-12-02T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 15, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-29 01:26:17.713551	processed
58	https://eventkampus.com	https://eventkampus.com/event/detail/4242/kognisi-youth-learning-festival-2022	{"_raw": {"judul": "Kognisi Youth Learning Festival 2022", "urlBanner": "", "detailLokasi": "Virtual Land Kumospace", "linkEksternal": "https://eventkampus.com/event/detail/4242/kognisi-youth-learning-festival-2022", "tanggalMentah": "11  - 13 Mar 2022", "websiteSumber": "https://eventkampus.com"}, "harga": 0, "judul": "Kognisi Youth Learning Festival 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.662Z", "deskripsi": "", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Virtual Land Kumospace", "tanggalMulai": "2022-03-10T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4242/kognisi-youth-learning-festival-2022", "tanggalMentah": "11  - 13 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-03-10T17:00:00.000Z", "confidenceScore": 35, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 0, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.935603	processed
64	https://eventkampus.com	https://eventkampus.com/event/detail/4223/virtual-ireland-education-fair	{"_raw": {"harga": 0, "judul": "Virtual Ireland Education Fair!🎉", "kuota": null, "deskripsi": "<p>Virtual Ireland Education Fair!🎉</p>\\n\\n<p>Jembatan kamu untuk kuliah ke Irlandia, Eropa. Dihadiri oleh Top Universitas dan Institute of Teknologi Irlandia!</p>\\n\\n<p>Only at the fair:<br>\\n🗣️1 on 1 Consultation with University Staff<br>\\n✅ FREE IELTS Preparation*<br>\\n💰Partial &amp; Full Scholarships<br>\\n🔎 Free University Application Guide!</p>\\n\\n<p>Save the date!<br>\\n🗓Sunday, 20 February 2022<br>\\n⏰3-5 PM WIB<br>\\n🖥 Zoom Online</p>\\n\\n<p>acara ini GRATIS dan didukung resmi oleh Education Ireland.</p>\\n\\n<p>kuy daftar NOW ⤵️<br>\\nbit.ly/ERVF22</p>\\n\\n<p>Info lebih lanjut bisa hubungi kita via DM or WA<br>\\n📞 : 0821 3333 6363 (hotline for Batam and Kepri)<br>\\n📞 : 0819 4675 8555 (hotline for Bali and Lombok area)<br>\\n📞 : 0811 6399 985 (hotline for Medan)<br>\\n📞 : 0852 3600 6363 (hotline for Pekanbaru)</p>\\n\\n<p>#educationrepublic #educationrepublicbali #educationrepublicmedan #educationrepublicpekanbaru #eventbatam #baliindonesia #medanhits #pekanbarustory #event2022 #kuliahdiirlandia #ireland🍀 #studyabroad #irelandeducationfair</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": "📞   (hotline for Batam and Kepri)", "detailLokasi": "Zoom", "linkEksternal": "https://eventkampus.com/event/detail/4223/virtual-ireland-education-fair", "tanggalMentah": "20  - 20 Feb 2022", "teleponKontak": "082133336363", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "Virtual Ireland Education Fair!🎉", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.670Z", "deskripsi": "<p>Virtual Ireland Education Fair!🎉</p>\\n\\n<p>Jembatan kamu untuk kuliah ke Irlandia, Eropa. Dihadiri oleh Top Universitas dan Institute of Teknologi Irlandia!</p>\\n\\n<p>Only at the fair:<br>\\n🗣️1 on 1 Consultation with University Staff<br>\\n✅ FREE IELTS Preparation*<br>\\n💰Partial &amp; Full Scholarships<br>\\n🔎 Free University Application Guide!</p>\\n\\n<p>Save the date!<br>\\n🗓Sunday, 20 February 2022<br>\\n⏰3-5 PM WIB<br>\\n🖥 Zoom Online</p>\\n\\n<p>acara ini GRATIS dan didukung resmi oleh Education Ireland.</p>\\n\\n<p>kuy daftar NOW ⤵️<br>\\nbit.ly/ERVF22</p>\\n\\n<p>Info lebih lanjut bisa hubungi kita via DM or WA<br>\\n📞 : 0821 3333 6363 (hotline for Batam and Kepri)<br>\\n📞 : 0819 4675 8555 (hotline for Bali and Lombok area)<br>\\n📞 : 0811 6399 985 (hotline for Medan)<br>\\n📞 : 0852 3600 6363 (hotline for Pekanbaru)</p>\\n\\n<p>#educationrepublic #educationrepublicbali #educationrepublicmedan #educationrepublicpekanbaru #eventbatam #baliindonesia #medanhits #pekanbarustory #event2022 #kuliahdiirlandia #ireland🍀 #studyabroad #irelandeducationfair</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "📞   (hotline for Batam and Kepri)", "detailLokasi": "Zoom", "tanggalMulai": "2022-02-19T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4223/virtual-ireland-education-fair", "tanggalMentah": "20  - 20 Feb 2022", "teleponKontak": "082133336363", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-02-19T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.964722	processed
56	https://eventkampus.com	https://eventkampus.com/event/detail/4246/the-48th-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 48th MarkPlus Goes to Campus “Entrepreneurial Marketing\\".", "kuota": null, "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 48th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 19 Maret 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Agustien Zulaidah, S.T, M.T - Rektor Universitas Pandanaran<br>\\n2. Dr.Taofik Hidajat.,SE.,M.Si.,CRBC.,WPPE.,WMI - Ketua STIE BPD Jateng</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC48</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4246/the-48th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "19  - 19 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC48"}, "harga": 0, "judul": "The 48th MarkPlus Goes to Campus “Entrepreneurial Marketing\\".", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.639Z", "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 48th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 19 Maret 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Agustien Zulaidah, S.T, M.T - Rektor Universitas Pandanaran<br>\\n2. Dr.Taofik Hidajat.,SE.,M.Si.,CRBC.,WPPE.,WMI - Ketua STIE BPD Jateng</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: https://bit.ly/MGTC48</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-03-18T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4246/the-48th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "19  - 19 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC48", "tanggalSelesai": "2022-03-18T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.925017	processed
45	https://eventkampus.com	https://eventkampus.com/event/detail/4270/webinar-memulai-personal-branding-di-linkedin-your-linkedin-your-future-power	{"_raw": {"harga": 0, "judul": "WEBINAR MEMULAI PERSONAL BRANDING DI LINKEDIN ~ YOUR LINKEDIN YOUR FUTURE POWER", "kuota": null, "deskripsi": "<p>[☀️WEBINAR MEMULAI PERSONAL BRANDING DI LINKEDIN ~ YOUR LINKEDIN YOUR FUTURE POWER ☀️]</p>\\n\\n<p>Hi Fellas!✨</p>\\n\\n<p>Tahukah kamu penelitian BPS menyatakan bahwa sarjana yang menganggur hampir 1 juta orang pada Februari 2021, banyak hal yang sudah berubah dalam mendapatkan pekerjaan dimasa depan. Kamu sudah yakin cv konvensional saja bisa langsung mendapatkan pekerjaan? Webinar ini mengajak temen-temen menambambah wawasan tentang peluang di social media Linkedin dimana para pencari kerja (jobseeker) dapat terhubung dan bertemu denga para recruiter perusahaan ternama. Pelajari bagaimana memulai personal branding dan memikat para recruiter di platform Linkedin untuk mendapatkan perkaan yang kamu inginkan.</p>\\n\\n<p>Penasaran⁉️Yuk join di webinar kita yang akan di selenggarakan pada: &nbsp;</p>\\n\\n<p>🗓: Jumat, 8 April 2022<br>\\n🕕: 13.00 - 15.00 WIB<br>\\n📍: Zoom Meeting (Live)</p>\\n\\n<p>Banyak benefit yang akan kamu dapatkan dari webinar ini loh, diantaranya :&nbsp;</p>\\n\\n<p>✅Pengetahuan Baru<br>\\n✅E-sertifikat<br>\\n✅Hadiah<br>\\n✅Relasi Baru</p>\\n\\n<p>Ayo tunggu apalagi? daftarkan dirimu segera melalui link registrasi dibawah ini👇👇</p>\\n\\n<p>https://bit.ly/linkedinpower2022</p>\\n\\n<p>Atau melalui link berikut:</p>\\n\\n<p>https://forms.gle/Y4HHouy8Ph1xgVWPA</p>\\n\\n<p>Jika terdapat pertanyaan seputar webinar, jangan ragu untuk menghubungi contact person:</p>\\n\\n<p>👤 Bayu : &nbsp;085156943643<br>\\n👤 Raditya : 087888798579</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": "👤 Bayu", "detailLokasi": "Zoom", "linkEksternal": "https://eventkampus.com/event/detail/4270/webinar-memulai-personal-branding-di-linkedin-your-linkedin-your-future-power", "tanggalMentah": "08  - 08 Apr 2022", "teleponKontak": "085156943643", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/linkedinpower2022"}, "harga": 0, "judul": "WEBINAR MEMULAI PERSONAL BRANDING DI LINKEDIN ~ YOUR LINKEDIN YOUR FUTURE POWER", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.908Z", "deskripsi": "<p>[☀️WEBINAR MEMULAI PERSONAL BRANDING DI LINKEDIN ~ YOUR LINKEDIN YOUR FUTURE POWER ☀️]</p>\\n\\n<p>Hi Fellas!✨</p>\\n\\n<p>Tahukah kamu penelitian BPS menyatakan bahwa sarjana yang menganggur hampir 1 juta orang pada Februari 2021, banyak hal yang sudah berubah dalam mendapatkan pekerjaan dimasa depan. Kamu sudah yakin cv konvensional saja bisa langsung mendapatkan pekerjaan? Webinar ini mengajak temen-temen menambambah wawasan tentang peluang di social media Linkedin dimana para pencari kerja (jobseeker) dapat terhubung dan bertemu denga para recruiter perusahaan ternama. Pelajari bagaimana memulai personal branding dan memikat para recruiter di platform Linkedin untuk mendapatkan perkaan yang kamu inginkan.</p>\\n\\n<p>Penasaran⁉️Yuk join di webinar kita yang akan di selenggarakan pada: &nbsp;</p>\\n\\n<p>🗓: Jumat, 8 April 2022<br>\\n🕕: 13.00 - 15.00 WIB<br>\\n📍: Zoom Meeting (Live)</p>\\n\\n<p>Banyak benefit yang akan kamu dapatkan dari webinar ini loh, diantaranya :&nbsp;</p>\\n\\n<p>✅Pengetahuan Baru<br>\\n✅E-sertifikat<br>\\n✅Hadiah<br>\\n✅Relasi Baru</p>\\n\\n<p>Ayo tunggu apalagi? daftarkan dirimu segera melalui link registrasi dibawah ini👇👇</p>\\n\\n<p>https://bit.ly/linkedinpower2022</p>\\n\\n<p>Atau melalui link berikut:</p>\\n\\n<p>https://forms.gle/Y4HHouy8Ph1xgVWPA</p>\\n\\n<p>Jika terdapat pertanyaan seputar webinar, jangan ragu untuk menghubungi contact person:</p>\\n\\n<p>👤 Bayu : &nbsp;085156943643<br>\\n👤 Raditya : 087888798579</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "👤 Bayu", "detailLokasi": "Zoom", "tanggalMulai": "2022-04-07T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4270/webinar-memulai-personal-branding-di-linkedin-your-linkedin-your-future-power", "tanggalMentah": "08  - 08 Apr 2022", "teleponKontak": "085156943643", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/linkedinpower2022", "tanggalSelesai": "2022-04-07T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.877304	processed
61	https://eventkampus.com	https://eventkampus.com/event/detail/4233/webinar-mental-health	{"_raw": {"harga": 0, "judul": "[WEBINAR MENTAL HEALTH]", "kuota": null, "deskripsi": "<p>[WEBINAR MENTAL HEALTH]</p>\\n\\n<p>Hallo Sobat Millenial 🙌</p>\\n\\n<p>Dengan bangga forum KJMU UNNES mempersembahkan webinar \\"Webinar Mental Health: Pembelajaran Jarak Jauh vs Mental Health\\"</p>\\n\\n<p>Meski berada di masa-masa yang menantang, seperti pembelajaran jarak jauh yang berkepanjangan dan kurangnya kontak fisik dengan teman dan keluarga, menjaga kesehatan mental dan kesehatan fisik sangatlah penting.&nbsp;</p>\\n\\n<p>Yuk bergabung dalam Webinar Mental Health dengan judul \\"Pembelajaran Jarak Jauh vs Mental Health\\" yang akan dilaksanakan pada:&nbsp;</p>\\n\\n<p>📆 19 Maret 2022<br>\\n🕒 09.30 - Selesai<br>\\n📍Zoom Meeting</p>\\n\\n<p>Pembicara:<br>\\n👤Ruang Dengar</p>\\n\\n<p>‼️FREE‼️</p>\\n\\n<p>Benefit:<br>\\n- E-certificate<br>\\n- Ilmu yang bermanfaat<br>\\n- Relasi<br>\\n- Jodoh bila beruntung</p>\\n\\n<p>Link Pendaftaran: https://bit.ly/WebinarPendaftaran2022</p>\\n\\n<p>☎️ Contact person<br>\\n088213373678 (Gisella Auryn)</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": "(Gisella Auryn)", "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4233/webinar-mental-health", "tanggalMentah": "19  - 19 Mar 2022", "teleponKontak": "088213373678", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/WebinarPendaftaran2022"}, "harga": 0, "judul": "[WEBINAR MENTAL HEALTH]", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.996Z", "deskripsi": "<p>[WEBINAR MENTAL HEALTH]</p>\\n\\n<p>Hallo Sobat Millenial 🙌</p>\\n\\n<p>Dengan bangga forum KJMU UNNES mempersembahkan webinar \\"Webinar Mental Health: Pembelajaran Jarak Jauh vs Mental Health\\"</p>\\n\\n<p>Meski berada di masa-masa yang menantang, seperti pembelajaran jarak jauh yang berkepanjangan dan kurangnya kontak fisik dengan teman dan keluarga, menjaga kesehatan mental dan kesehatan fisik sangatlah penting.&nbsp;</p>\\n\\n<p>Yuk bergabung dalam Webinar Mental Health dengan judul \\"Pembelajaran Jarak Jauh vs Mental Health\\" yang akan dilaksanakan pada:&nbsp;</p>\\n\\n<p>📆 19 Maret 2022<br>\\n🕒 09.30 - Selesai<br>\\n📍Zoom Meeting</p>\\n\\n<p>Pembicara:<br>\\n👤Ruang Dengar</p>\\n\\n<p>‼️FREE‼️</p>\\n\\n<p>Benefit:<br>\\n- E-certificate<br>\\n- Ilmu yang bermanfaat<br>\\n- Relasi<br>\\n- Jodoh bila beruntung</p>\\n\\n<p>Link Pendaftaran: https://bit.ly/WebinarPendaftaran2022</p>\\n\\n<p>☎️ Contact person<br>\\n088213373678 (Gisella Auryn)</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "(Gisella Auryn)", "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-03-18T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4233/webinar-mental-health", "tanggalMentah": "19  - 19 Mar 2022", "teleponKontak": "088213373678", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/WebinarPendaftaran2022", "tanggalSelesai": "2022-03-18T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.952435	processed
57	https://eventkampus.com	https://eventkampus.com/event/detail/4244/kognisi-youth-learning-festival-2022	{"_raw": {"judul": "Kognisi Youth Learning Festival 2022", "urlBanner": "", "detailLokasi": "Virtual Land Kumospace", "linkEksternal": "https://eventkampus.com/event/detail/4244/kognisi-youth-learning-festival-2022", "tanggalMentah": "12  - 12 Mar 2022", "websiteSumber": "https://eventkampus.com"}, "harga": 0, "judul": "Kognisi Youth Learning Festival 2022", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.163Z", "deskripsi": "", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Virtual Land Kumospace", "tanggalMulai": "2022-03-11T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4244/kognisi-youth-learning-festival-2022", "tanggalMentah": "12  - 12 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-03-11T17:00:00.000Z", "confidenceScore": 35, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 0, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.929129	processed
63	https://eventkampus.com	https://eventkampus.com/event/detail/4228/marketeers-goes-to-campus-episode-45-special-launch-edition	{"_raw": {"harga": 0, "judul": "Marketeers Goes to Campus Episode 45 - Special Launch Edition", "kuota": null, "deskripsi": "<p>Salam Marketing,&nbsp;</p>\\n\\n<p>Bersama ini kami mengundang Bapak/Ibu untuk hadir secara virtual dalam acara Marketeers Goes to Campus Episode 45 - Special Launch Edition&nbsp;</p>\\n\\n<p>Launching of ENMARK MBA - Entrepreneurial Marketing MBA<br>\\nThe brand new MBA program, for young professionals that focuses on building capabilities in business management, marketing and entrepreneurship with a world-class MBA learning approach, &nbsp;including business immersion to increase business sustainability in divergent</p>\\n\\n<p>Program kolaborasi antara SBM-ITB dan MarkPlus Institute</p>\\n\\n<p>Stadium Generale<br>\\nEntrepreneurial Marketing<br>\\nHermawan Kartajaya<br>\\nFounder &amp; Chairman of MarkPlus, Inc.</p>\\n\\n<p>🗓 : Sabtu, 26 Februari 2022<br>\\n🕰 : 10.00 – 11.30 WIB&nbsp;<br>\\n🖥 : ZOOM &amp; MarkPlus Channel</p>\\n\\n<p>Pembicara Tamu:<br>\\n1. Prof. Ir. Nizam, M. Sc., DIC, Ph.D., IPU, ASEAN Eng - Plt. Direktur Jenderal Pendidikan Tinggi, Riset, dan Teknologi<br>\\n2. Dr. Yudo Anggoro - Director of MBA Program-Jakarta Campus at Scchool of Business and Management ITB<br>\\n3. Dr. Ir. Arief Yahya, MSc - Direktur Utama PT Intermedia Capital TBK<br>\\n4. Jacky Mussry - CEO MarkPlus, Inc.</p>\\n\\n<p>Regristration: https://bit.ly/MGTC45</p>\\n\\n<p>Stay Safe, Stay Productive</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "linkEksternal": "https://eventkampus.com/event/detail/4228/marketeers-goes-to-campus-episode-45-special-launch-edition", "tanggalMentah": "26  - 26 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC45"}, "harga": 0, "judul": "Marketeers Goes to Campus Episode 45 - Special Launch Edition", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.225Z", "deskripsi": "<p>Salam Marketing,&nbsp;</p>\\n\\n<p>Bersama ini kami mengundang Bapak/Ibu untuk hadir secara virtual dalam acara Marketeers Goes to Campus Episode 45 - Special Launch Edition&nbsp;</p>\\n\\n<p>Launching of ENMARK MBA - Entrepreneurial Marketing MBA<br>\\nThe brand new MBA program, for young professionals that focuses on building capabilities in business management, marketing and entrepreneurship with a world-class MBA learning approach, &nbsp;including business immersion to increase business sustainability in divergent</p>\\n\\n<p>Program kolaborasi antara SBM-ITB dan MarkPlus Institute</p>\\n\\n<p>Stadium Generale<br>\\nEntrepreneurial Marketing<br>\\nHermawan Kartajaya<br>\\nFounder &amp; Chairman of MarkPlus, Inc.</p>\\n\\n<p>🗓 : Sabtu, 26 Februari 2022<br>\\n🕰 : 10.00 – 11.30 WIB&nbsp;<br>\\n🖥 : ZOOM &amp; MarkPlus Channel</p>\\n\\n<p>Pembicara Tamu:<br>\\n1. Prof. Ir. Nizam, M. Sc., DIC, Ph.D., IPU, ASEAN Eng - Plt. Direktur Jenderal Pendidikan Tinggi, Riset, dan Teknologi<br>\\n2. Dr. Yudo Anggoro - Director of MBA Program-Jakarta Campus at Scchool of Business and Management ITB<br>\\n3. Dr. Ir. Arief Yahya, MSc - Direktur Utama PT Intermedia Capital TBK<br>\\n4. Jacky Mussry - CEO MarkPlus, Inc.</p>\\n\\n<p>Regristration: https://bit.ly/MGTC45</p>\\n\\n<p>Stay Safe, Stay Productive</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "ZOOM & Youtube MarketeersTV", "tanggalMulai": "2022-02-25T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4228/marketeers-goes-to-campus-episode-45-special-launch-edition", "tanggalMentah": "26  - 26 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC45", "tanggalSelesai": "2022-02-25T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.961522	processed
111	https://eventkampus.com	https://eventkampus.com/event/detail/4308/webinar-nasional-accer-x-e-summit-green-lifestyle	{"_raw": {"harga": 0, "judul": "WEBINAR NASIONAL ACCER X E-SUMMIT: Green Lifestyle", "kuota": null, "deskripsi": "<p>🌱[WEBINAR NASIONAL ACCER X E-SUMMIT: Green Lifestyle]🌱</p><p><br></p><p>Haloo Ecologist 🌱!</p><p><br></p><p>Dalam rangka memperingati Hari Lingkungan Hidup Nasional. BEM FEMA IPB dan BEM FATETA IPB akan mengadakan acara Webinar Nasional Accer X E-Summit dengan tema \\"ECO-TECH (Ecology vs Technology): How Technology Can Be a Problem and a Solution for Climate Change\\"</p><p><br></p><p>Yuk catat tanggalnya ✨</p><p>Webinar akan dilaksanakan pada :</p><p>🗓️ : Minggu, 5 Juni 2022</p><p>🕐 : 09.00 WIB -Selesai</p><p>📍: Zoom Meeting</p><p><br></p><p>🗣️ Special Speaker 🗣️</p><p>1. Tasya Kamila (Public figure dan Environment ambassador in Indonesia)</p><p>2. Dino Fitriza (Climate Reality Leader)</p><p><br></p><p>🎗️Benefit 🎗️</p><p>- Doorprize</p><p>- E-certificate</p><p>- Knowledge</p><p>- Hadiah pemenang Challenge</p><p><br></p><p>&nbsp;💸FREE HTM 💸&nbsp;</p><p><br></p><p>Jangan lupa daftarkan dirimu di:</p><p>https://ipb.link/webinar-accerxe-summit2022</p><p><br></p><p>Kami tunggu kehadirannya 🙌</p><p><br></p><p>Contact Person:</p><p>+62821-2369-1745 (Shinta)</p><p>+62 819-4506-6501 (Naufal)</p><p><br></p><p>#ACCERXESUMMIT2022</p><p>#WebinarNasional</p><p>#HariLingkunganHidup</p><p>#eventkampus</p><p>#webinar</p><p>#seminar</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4308/webinar-nasional-accer-x-e-summit-green-lifestyle", "tanggalMentah": "05  - 05 Jun 2022", "teleponKontak": "+6282123691745", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "WEBINAR NASIONAL ACCER X E-SUMMIT: Green Lifestyle", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.348Z", "deskripsi": "<p>🌱[WEBINAR NASIONAL ACCER X E-SUMMIT: Green Lifestyle]🌱</p><p><br></p><p>Haloo Ecologist 🌱!</p><p><br></p><p>Dalam rangka memperingati Hari Lingkungan Hidup Nasional. BEM FEMA IPB dan BEM FATETA IPB akan mengadakan acara Webinar Nasional Accer X E-Summit dengan tema \\"ECO-TECH (Ecology vs Technology): How Technology Can Be a Problem and a Solution for Climate Change\\"</p><p><br></p><p>Yuk catat tanggalnya ✨</p><p>Webinar akan dilaksanakan pada :</p><p>🗓️ : Minggu, 5 Juni 2022</p><p>🕐 : 09.00 WIB -Selesai</p><p>📍: Zoom Meeting</p><p><br></p><p>🗣️ Special Speaker 🗣️</p><p>1. Tasya Kamila (Public figure dan Environment ambassador in Indonesia)</p><p>2. Dino Fitriza (Climate Reality Leader)</p><p><br></p><p>🎗️Benefit 🎗️</p><p>- Doorprize</p><p>- E-certificate</p><p>- Knowledge</p><p>- Hadiah pemenang Challenge</p><p><br></p><p>&nbsp;💸FREE HTM 💸&nbsp;</p><p><br></p><p>Jangan lupa daftarkan dirimu di:</p><p>https://ipb.link/webinar-accerxe-summit2022</p><p><br></p><p>Kami tunggu kehadirannya 🙌</p><p><br></p><p>Contact Person:</p><p>+62821-2369-1745 (Shinta)</p><p>+62 819-4506-6501 (Naufal)</p><p><br></p><p>#ACCERXESUMMIT2022</p><p>#WebinarNasional</p><p>#HariLingkunganHidup</p><p>#eventkampus</p><p>#webinar</p><p>#seminar</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-06-04T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4308/webinar-nasional-accer-x-e-summit-green-lifestyle", "tanggalMentah": "05  - 05 Jun 2022", "teleponKontak": "+6282123691745", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-06-04T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.791156	processed
114	https://eventkampus.com	https://eventkampus.com/event/detail/4299/seminar-nasional-apoteker-uhamka-xxxvi	{"_raw": {"harga": 0, "judul": "SEMINAR NASIONAL APOTEKER UHAMKA XXXVI", "kuota": null, "deskripsi": "<p>📢 SEMINAR NASIONAL APOTEKER UHAMKA XXXVI.</p><p>DIBUKA UNTUK UMUM 📢</p><p><br></p><p>-SAPA 36 UHAMKA-</p><p><br></p><p>📖 TEMA</p><p>Inovasi Pelayanan Kefarmasian Berbasis Telefarmasi Pada Era Digital</p><p>- Materi 1 : Implementasi Regulasi Terkait Telefarmasi Beserta Aspek Legal</p><p>Pemateri : ɑpt. Dina Sintia Pamela, S.Si, M.Farm</p><p>- Materi 2 : Inovasi Praktik Apoteker Berbasis Telefarmasi Dalam Peningkatan Pelayanan Kefarmasian&nbsp;</p><p>Pemateri : Dr. apt. Rina Mutiara, M.Pharm</p><p>- Materi 3 : Potensi Sistem Digital dan Media Telefarmasi Dalam Peningkatan Branding Apotek&nbsp;</p><p>Pemateri : apt. OT Ponangsera, MM</p><p>- Materi 4 : Pengelolaan Sistem IT Serta Peningkatan SDM Farmasi Dalam Adaptasi Digital&nbsp;</p><p>Pemateri : DR. Teuku Noerman, BSc, MM, SH, MH</p><p><br></p><p>📌 PELAKSANAAN</p><p>📅 Minggu, 29 Mei 2022</p><p>⏰ 08.00 WIB s/d Selesɑi</p><p>💻 Online Viɑ Zoom Meeting</p><p><br></p><p>💡FASILITAS</p><p>📄 E-Sertifikɑt</p><p>📄 SKP IAI (In Confirmation)</p><p>📄 SKP PAFI (In Confirmation)</p><p>📒 Ilmu yɑng Bermɑnfɑɑt</p><p>🎁 Dorprize</p><p><br></p><p>💰Investɑsi Biɑyɑ</p><p>Gel 1 : Rp. 40.000,- (15 - 21 Mei)</p><p>Gel 2 : Rp. 50.000,- (22 - 28 Mei)</p><p><br></p><p>📱REGISTRASI</p><p><br></p><p>📲 Mɑsuk ke Link :</p><p>https://forms.gle/uVNm5EgKFzpzjqnh9</p><p>💵 Lɑkukɑn Pembɑyɑrɑn ke :</p><p>Rek BCA : 6331110687</p><p>ɑ.n Mauidhah</p><p><br></p><p>📞 Informɑsi Lebih Lɑnjut (WA)</p><p>- Galih 089643608887</p><p>- Ega 081324370779</p><p><br></p><p>📍 SOCIAL MEDIA</p><p>@sapa_uhamka</p><p>@apotekeruhamka36</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Online", "linkEksternal": "https://eventkampus.com/event/detail/4299/seminar-nasional-apoteker-uhamka-xxxvi", "tanggalMentah": "29  - 29 Mei 2022", "teleponKontak": "089643608887", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://forms.gle/uVNm5EgKFzpzjqnh9💵"}, "harga": 0, "judul": "SEMINAR NASIONAL APOTEKER UHAMKA XXXVI", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.390Z", "deskripsi": "<p>📢 SEMINAR NASIONAL APOTEKER UHAMKA XXXVI.</p><p>DIBUKA UNTUK UMUM 📢</p><p><br></p><p>-SAPA 36 UHAMKA-</p><p><br></p><p>📖 TEMA</p><p>Inovasi Pelayanan Kefarmasian Berbasis Telefarmasi Pada Era Digital</p><p>- Materi 1 : Implementasi Regulasi Terkait Telefarmasi Beserta Aspek Legal</p><p>Pemateri : ɑpt. Dina Sintia Pamela, S.Si, M.Farm</p><p>- Materi 2 : Inovasi Praktik Apoteker Berbasis Telefarmasi Dalam Peningkatan Pelayanan Kefarmasian&nbsp;</p><p>Pemateri : Dr. apt. Rina Mutiara, M.Pharm</p><p>- Materi 3 : Potensi Sistem Digital dan Media Telefarmasi Dalam Peningkatan Branding Apotek&nbsp;</p><p>Pemateri : apt. OT Ponangsera, MM</p><p>- Materi 4 : Pengelolaan Sistem IT Serta Peningkatan SDM Farmasi Dalam Adaptasi Digital&nbsp;</p><p>Pemateri : DR. Teuku Noerman, BSc, MM, SH, MH</p><p><br></p><p>📌 PELAKSANAAN</p><p>📅 Minggu, 29 Mei 2022</p><p>⏰ 08.00 WIB s/d Selesɑi</p><p>💻 Online Viɑ Zoom Meeting</p><p><br></p><p>💡FASILITAS</p><p>📄 E-Sertifikɑt</p><p>📄 SKP IAI (In Confirmation)</p><p>📄 SKP PAFI (In Confirmation)</p><p>📒 Ilmu yɑng Bermɑnfɑɑt</p><p>🎁 Dorprize</p><p><br></p><p>💰Investɑsi Biɑyɑ</p><p>Gel 1 : Rp. 40.000,- (15 - 21 Mei)</p><p>Gel 2 : Rp. 50.000,- (22 - 28 Mei)</p><p><br></p><p>📱REGISTRASI</p><p><br></p><p>📲 Mɑsuk ke Link :</p><p>https://forms.gle/uVNm5EgKFzpzjqnh9</p><p>💵 Lɑkukɑn Pembɑyɑrɑn ke :</p><p>Rek BCA : 6331110687</p><p>ɑ.n Mauidhah</p><p><br></p><p>📞 Informɑsi Lebih Lɑnjut (WA)</p><p>- Galih 089643608887</p><p>- Ega 081324370779</p><p><br></p><p>📍 SOCIAL MEDIA</p><p>@sapa_uhamka</p><p>@apotekeruhamka36</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Online", "tanggalMulai": "2022-05-28T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4299/seminar-nasional-apoteker-uhamka-xxxvi", "tanggalMentah": "29  - 29 Mei 2022", "teleponKontak": "089643608887", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://forms.gle/uVNm5EgKFzpzjqnh9💵", "tanggalSelesai": "2022-05-28T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-29 01:26:17.800518	processed
66	https://eventkampus.com	https://eventkampus.com/event/detail/4218/stop-sex-talk-out-of-prejudice	{"_raw": {"harga": 0, "judul": "STOP‼️ Sex Talk Out of Prejudice", "kuota": null, "deskripsi": "<p>STOP‼️<br>\\nSex Talk Out of Prejudice</p>\\n\\n<p>Halo, semua!<br>\\nKami mengundang kalian untuk mengikuti acara webinar dan talkshow dengan judul “STOP” yang akan memberikan informasi mengenai pendidikan seksual dalam rangka mengatasi kasus pelecehan dan kekerasan seksual yang sedang marak terjadi saat ini.</p>\\n\\n<p>📍SAVE THE DATE📍<br>\\n🗓: 19 febuari 2022<br>\\n🕐: 09.00-13.00 WIB<br>\\nVia Zoom Meeting</p>\\n\\n<p>🔊Narasumber&nbsp;<br>\\n1. Agata Ika Paskarista, M.Psi.,CPS<br>\\n2. dr. Dyana Safitri Velies, SpOG(K),Mkes&nbsp;</p>\\n\\n<p>Acara ini bersifat GRATIS, terbuka untuk UMUM, dan seluruh peserta akan mendapat E-Certificate!</p>\\n\\n<p>📩REGISTER YOURSELF NOW📩<br>\\nbit.ly/STOPRegistrationForm</p>\\n\\n<p>📞Further information<br>\\n+62 813-8307-7610 (Syifa Atsiila)</p>\\n\\n<p>Final Project 2021<br>\\nSCARTERIA</p>\\n\\n<p>Fakultas Kedokteran UIN Syarif Hidayatullah Jakarta</p>\\n\\n<p>#finprofkuin #finprofkuin21 #finproSTOP2022</p>\\n\\n<p>#eventkampuscom #Eventkampuscom</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4218/stop-sex-talk-out-of-prejudice", "tanggalMentah": "19  - 19 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "STOP‼️ Sex Talk Out of Prejudice", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.493Z", "deskripsi": "<p>STOP‼️<br>\\nSex Talk Out of Prejudice</p>\\n\\n<p>Halo, semua!<br>\\nKami mengundang kalian untuk mengikuti acara webinar dan talkshow dengan judul “STOP” yang akan memberikan informasi mengenai pendidikan seksual dalam rangka mengatasi kasus pelecehan dan kekerasan seksual yang sedang marak terjadi saat ini.</p>\\n\\n<p>📍SAVE THE DATE📍<br>\\n🗓: 19 febuari 2022<br>\\n🕐: 09.00-13.00 WIB<br>\\nVia Zoom Meeting</p>\\n\\n<p>🔊Narasumber&nbsp;<br>\\n1. Agata Ika Paskarista, M.Psi.,CPS<br>\\n2. dr. Dyana Safitri Velies, SpOG(K),Mkes&nbsp;</p>\\n\\n<p>Acara ini bersifat GRATIS, terbuka untuk UMUM, dan seluruh peserta akan mendapat E-Certificate!</p>\\n\\n<p>📩REGISTER YOURSELF NOW📩<br>\\nbit.ly/STOPRegistrationForm</p>\\n\\n<p>📞Further information<br>\\n+62 813-8307-7610 (Syifa Atsiila)</p>\\n\\n<p>Final Project 2021<br>\\nSCARTERIA</p>\\n\\n<p>Fakultas Kedokteran UIN Syarif Hidayatullah Jakarta</p>\\n\\n<p>#finprofkuin #finprofkuin21 #finproSTOP2022</p>\\n\\n<p>#eventkampuscom #Eventkampuscom</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-02-18T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4218/stop-sex-talk-out-of-prejudice", "tanggalMentah": "19  - 19 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-02-18T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.973909	processed
24	https://eventkampus.com	https://eventkampus.com/event/detail/4358/lawference	{"_raw": {"harga": 0, "judul": "LAWFERENCE", "kuota": null, "deskripsi": "<p>[KSM DEBATE AND MOOTCOURT SOCIETY FAKULTAS HUKUM UNIVERSITAS SURABAYA x PSEUDORECHTSPRAAK FAKULTAS HUKUM UNIVERSITAS DIPONEGORO]&nbsp;</p><p><br></p><p>⚖ LAWFERENCE ⚖&nbsp;</p><p><br></p><p>WEBINAR NASIONAL KOLABORATIF HIMPUNAN KOMUNITAS PERADILAN SEMU WILAYAH JAWA II INDONESIA UBAYA x UNDIP&nbsp;</p><p><br></p><p>LAWFERENCE 2022 kembali mengadakan webinar dengan tema \\"Kelam-Kabut Indonesia dalam Mempersiapkan Net-Zero Carbon Emission 2060 : Menakar Rezim Anti Pencucian Uang sebagai Upaya Mewujudkan Green Economy Melalui Penerapan Pajak Karbon\\". Yang mana akan dibawakan oleh :&nbsp;</p><p>👤 Keynote Speaker&nbsp;</p><p>\\"Prof. Dr. Poltak Maruli John Liberty Hutagaol, S. E., Ak., C. A., M. Acc., M. Ec (Hons), CA.\\"&nbsp;&nbsp;</p><p>[Kepala Kompartemen Akuntan Pajak Ikatan Akuntan Indonesia ( IAI-KAPj)]&nbsp;</p><p><br></p><p>Selain itu, juga ada beberapa narasumber-narasumber hebat, sebagai berikut :&nbsp;</p><p>👤 Prof. Dr. FX. Adji Samekto S.H., M. Hum.&nbsp;</p><p>[Guru Besar Fakultas Hukum Universitas Diponegoro]</p><p>👤 Dr. Go Lisanawati, S. H., M. Hum.&nbsp;</p><p>[Dosen Fakultas Hukum Universitas Surabaya]</p><p>👤 Fithriadi Muslim, S. H., M. H.&nbsp;</p><p>[Direktur Hukum dan Regulasi Pusat Pelaporan dan Analisis Transaksi Keuangan]&nbsp;</p><p><br></p><p>👤 Moderator :&nbsp;</p><p>Gwyneth Eugenia Keisya Howard&nbsp;</p><p><br></p><p>Dengan mengikuti Lawference ini, akan mendapatkan beberapa hal, sebagai berikut :&nbsp;</p><p>✅ E-Sertifikat&nbsp;</p><p>✅ Tidak dipungut biaya pendaftaran&nbsp;</p><p>✅ Point Kemahasiswaan (khusus mahasiswa UBAYA)&nbsp;</p><p><br></p><p>Come and join us on Lawference 2022 :&nbsp;</p><p>🗓 : Kamis, 11 Agustus 2022</p><p>⏰ : 09.30 WIB - selesai</p><p>💻 : Zoom Meeting / Live Youtube&nbsp;</p><p><br></p><p>📌 Open Registration :&nbsp;</p><p>3 Agustus - 10 Agustus 2022&nbsp;</p><p>Melalui Link Pendafataran di bawah ini:</p><p>/<a href=\\"https://tinyurl.com/Lawference2022\\" rel=\\"nofollow\\" target=\\"_blank\\">tinyurl.com/Lawference2022</a>&nbsp;</p><p><br></p><p>Berkaitan dengan ID dan Password Zoom Meeting sekaligus informasi lainnya,&nbsp;akan dibagikan melalui Group Chat Whatsapp.</p><p><br></p><p><br></p><p>☎️ Contact Person :&nbsp;</p><p>Agnes Sinta : 0895383176040&nbsp;</p><p>Zahwa Tannisa : 082137664452&nbsp;</p><p><br></p><p>Sincerely from youngster passion for knwoledge, LAWFERENCE 2022 💫</p>", "tipeHarga": "paid", "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "linkEksternal": "https://eventkampus.com/event/detail/4358/lawference", "tanggalMentah": "11  - 11 Agu 2022", "teleponKontak": "0895383176040", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "LAWFERENCE", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:20.742Z", "deskripsi": "<p>[KSM DEBATE AND MOOTCOURT SOCIETY FAKULTAS HUKUM UNIVERSITAS SURABAYA x PSEUDORECHTSPRAAK FAKULTAS HUKUM UNIVERSITAS DIPONEGORO]&nbsp;</p><p><br></p><p>⚖ LAWFERENCE ⚖&nbsp;</p><p><br></p><p>WEBINAR NASIONAL KOLABORATIF HIMPUNAN KOMUNITAS PERADILAN SEMU WILAYAH JAWA II INDONESIA UBAYA x UNDIP&nbsp;</p><p><br></p><p>LAWFERENCE 2022 kembali mengadakan webinar dengan tema \\"Kelam-Kabut Indonesia dalam Mempersiapkan Net-Zero Carbon Emission 2060 : Menakar Rezim Anti Pencucian Uang sebagai Upaya Mewujudkan Green Economy Melalui Penerapan Pajak Karbon\\". Yang mana akan dibawakan oleh :&nbsp;</p><p>👤 Keynote Speaker&nbsp;</p><p>\\"Prof. Dr. Poltak Maruli John Liberty Hutagaol, S. E., Ak., C. A., M. Acc., M. Ec (Hons), CA.\\"&nbsp;&nbsp;</p><p>[Kepala Kompartemen Akuntan Pajak Ikatan Akuntan Indonesia ( IAI-KAPj)]&nbsp;</p><p><br></p><p>Selain itu, juga ada beberapa narasumber-narasumber hebat, sebagai berikut :&nbsp;</p><p>👤 Prof. Dr. FX. Adji Samekto S.H., M. Hum.&nbsp;</p><p>[Guru Besar Fakultas Hukum Universitas Diponegoro]</p><p>👤 Dr. Go Lisanawati, S. H., M. Hum.&nbsp;</p><p>[Dosen Fakultas Hukum Universitas Surabaya]</p><p>👤 Fithriadi Muslim, S. H., M. H.&nbsp;</p><p>[Direktur Hukum dan Regulasi Pusat Pelaporan dan Analisis Transaksi Keuangan]&nbsp;</p><p><br></p><p>👤 Moderator :&nbsp;</p><p>Gwyneth Eugenia Keisya Howard&nbsp;</p><p><br></p><p>Dengan mengikuti Lawference ini, akan mendapatkan beberapa hal, sebagai berikut :&nbsp;</p><p>✅ E-Sertifikat&nbsp;</p><p>✅ Tidak dipungut biaya pendaftaran&nbsp;</p><p>✅ Point Kemahasiswaan (khusus mahasiswa UBAYA)&nbsp;</p><p><br></p><p>Come and join us on Lawference 2022 :&nbsp;</p><p>🗓 : Kamis, 11 Agustus 2022</p><p>⏰ : 09.30 WIB - selesai</p><p>💻 : Zoom Meeting / Live Youtube&nbsp;</p><p><br></p><p>📌 Open Registration :&nbsp;</p><p>3 Agustus - 10 Agustus 2022&nbsp;</p><p>Melalui Link Pendafataran di bawah ini:</p><p>/<a href=\\"https://tinyurl.com/Lawference2022\\" rel=\\"nofollow\\" target=\\"_blank\\">tinyurl.com/Lawference2022</a>&nbsp;</p><p><br></p><p>Berkaitan dengan ID dan Password Zoom Meeting sekaligus informasi lainnya,&nbsp;akan dibagikan melalui Group Chat Whatsapp.</p><p><br></p><p><br></p><p>☎️ Contact Person :&nbsp;</p><p>Agnes Sinta : 0895383176040&nbsp;</p><p>Zahwa Tannisa : 082137664452&nbsp;</p><p><br></p><p>Sincerely from youngster passion for knwoledge, LAWFERENCE 2022 💫</p>", "tipeHarga": "paid", "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting / Live Youtube", "tanggalMulai": "2022-08-10T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4358/lawference", "tanggalMentah": "11  - 11 Agu 2022", "teleponKontak": "0895383176040", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-08-10T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.761359	processed
27	https://eventkampus.com	https://eventkampus.com/event/detail/4336/the-58th-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 58th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 58th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 25 Juni 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Prof. Dr . Dwiza Riana, S.Si, MM, M.Kom - Rektor Universitas Nusa Mandiri</p><p>2. H. Umar Natuna, S. Ag., M. Pd. I - Ketua Sekolah Tinggi Agama Islam Natuna</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC58</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4336/the-58th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "25  - 25 Jun 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC58Terima"}, "harga": 0, "judul": "The 58th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.401Z", "deskripsi": "<p>Dear Sobat MI,</p><p><br></p><p>Ikuti The 58th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p><p><br></p><p>🗓 : Sabtu, 25 Juni 2022</p><p>🕰 : 10.00 – 11.30 WIB</p><p>🖥 : ZOOM &amp; Youtube MarkPlus Channel</p><p><br></p><p>Pembicara Tamu :</p><p>1. Prof. Dr . Dwiza Riana, S.Si, MM, M.Kom - Rektor Universitas Nusa Mandiri</p><p>2. H. Umar Natuna, S. Ag., M. Pd. I - Ketua Sekolah Tinggi Agama Islam Natuna</p><p><br></p><p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p><p><br></p><p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut : https://bit.ly/MGTC58</p><p><br></p><p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-06-24T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4336/the-58th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "25  - 25 Jun 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC58Terima", "tanggalSelesai": "2022-06-24T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.77592	processed
31	https://eventkampus.com	https://eventkampus.com/event/detail/4323/webinar-knock-out	{"_raw": {"harga": 0, "judul": "Webinar \\"KNOCK OUT\\"!", "kuota": null, "deskripsi": "<p>If you were to choose, would you rather Win or Lose your Personality? 🥊</p><p><br></p><p>Tentunya, kita semua akan memilih yang pertama dong! Karena personality kita merupakan identitas kita!</p><p><br></p><p>Pastinya dalam menjalani hubungan dengan orang - orang, kita semua punya identitas yang membedakan kita semua. Buat kamu yang ingin tahu lebih banyak lagi tentang Personal Branding, yuk kita sama - sama belajar tentang Personal Branding melalui Webinar \\"KNOCK OUT\\"!&nbsp;</p><p><br></p><p>Webinar ini akan diselenggarakan pada:</p><p>🗓️ Sabtu, 4 Juni 2022&nbsp;</p><p>🕐13:00 - 15:00</p><p>📍Zoom Meeting</p><p><br></p><p>Pendaftaran akan ditutup tanggal 3 Juni 2022.</p><p><br></p><p>Untuk informasi lebih lanjut, anda dapat menghubungi kami melalui contact persons dibawah ini:</p><p>+62 822-1313-0813 (Mayentha)</p><p>+62 878-0887-1166 (Rachel)</p><p><br></p><p>Jadi, tunggu apa lagi? Segera daftarkan dirimu untuk pengetahuan yang lebih luas lagi!&nbsp;</p><p>We are more than excited to see you WIN! 🏅</p><p><br></p><p>See you on KNOCK OUT !!! 🔥</p><p><br></p><p>@bellzky16 @mateo_jubileo @sheilanandara</p><p><br></p><p>#eventkampus #seminar #webinar&nbsp;</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4323/webinar-knock-out", "tanggalMentah": "04  - 04 Jun 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "Webinar \\"KNOCK OUT\\"!", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:21.440Z", "deskripsi": "<p>If you were to choose, would you rather Win or Lose your Personality? 🥊</p><p><br></p><p>Tentunya, kita semua akan memilih yang pertama dong! Karena personality kita merupakan identitas kita!</p><p><br></p><p>Pastinya dalam menjalani hubungan dengan orang - orang, kita semua punya identitas yang membedakan kita semua. Buat kamu yang ingin tahu lebih banyak lagi tentang Personal Branding, yuk kita sama - sama belajar tentang Personal Branding melalui Webinar \\"KNOCK OUT\\"!&nbsp;</p><p><br></p><p>Webinar ini akan diselenggarakan pada:</p><p>🗓️ Sabtu, 4 Juni 2022&nbsp;</p><p>🕐13:00 - 15:00</p><p>📍Zoom Meeting</p><p><br></p><p>Pendaftaran akan ditutup tanggal 3 Juni 2022.</p><p><br></p><p>Untuk informasi lebih lanjut, anda dapat menghubungi kami melalui contact persons dibawah ini:</p><p>+62 822-1313-0813 (Mayentha)</p><p>+62 878-0887-1166 (Rachel)</p><p><br></p><p>Jadi, tunggu apa lagi? Segera daftarkan dirimu untuk pengetahuan yang lebih luas lagi!&nbsp;</p><p>We are more than excited to see you WIN! 🏅</p><p><br></p><p>See you on KNOCK OUT !!! 🔥</p><p><br></p><p>@bellzky16 @mateo_jubileo @sheilanandara</p><p><br></p><p>#eventkampus #seminar #webinar&nbsp;</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-06-03T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4323/webinar-knock-out", "tanggalMentah": "04  - 04 Jun 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-06-03T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.795264	processed
65	https://eventkampus.com	https://eventkampus.com/event/detail/4220/permisitel-u-2022-proudly-present-free-webinar-navy-tel-u-2022	{"_raw": {"judul": "📣 PERMISI.TEL-U 2022 PROUDLY PRESENT 📣  🌊 FREE WEBINAR NAVY TEL-U 2022 🌊", "urlBanner": "", "detailLokasi": "VIDEO CONVERECE", "linkEksternal": "https://eventkampus.com/event/detail/4220/permisitel-u-2022-proudly-present-free-webinar-navy-tel-u-2022", "tanggalMentah": "19  - 19 Feb 2022", "websiteSumber": "https://eventkampus.com"}, "harga": 0, "judul": "📣 PERMISI.TEL-U 2022 PROUDLY PRESENT 📣 🌊 FREE WEBINAR NAVY TEL-U 2022 🌊", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.067Z", "deskripsi": "", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "VIDEO CONVERECE", "tanggalMulai": "2022-02-18T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4220/permisitel-u-2022-proudly-present-free-webinar-navy-tel-u-2022", "tanggalMentah": "19  - 19 Feb 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-02-18T17:00:00.000Z", "confidenceScore": 20, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 0, "kotaId": 0, "deskripsi": 0, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-27 17:31:56.969918	processed
53	https://eventkampus.com	https://eventkampus.com/event/detail/4255/the-49th-markplus-goes-to-campus-entrepreneurial-marketing	{"_raw": {"harga": 0, "judul": "The 49th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 49th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 26 Maret 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. Budi Endarto, SH. M.Hum - Rektor - Universitas Wijaya Putra Surabaya&nbsp;<br>\\n2. Dr. Prihat Assih, SE., MSi., Ak., CSRS - Wakil Rektor II - Universitas Merdeka Malang</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: &nbsp; &nbsp;<br>\\nhttps://bit.ly/MGTC49</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": null, "detailLokasi": "", "linkEksternal": "https://eventkampus.com/event/detail/4255/the-49th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "26  - 26 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC49"}, "harga": 0, "judul": "The 49th MarkPlus Goes to Campus “Entrepreneurial Marketing\\"", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.097Z", "deskripsi": "<p>Dear Marketeers,</p>\\n\\n<p>Ikuti The 49th MarkPlus Goes to Campus “Entrepreneurial Marketing\\". MarkPlus Goes to Campus (MGTC) merupakan ajang bertemunya komunitas kampus di Indonesia, ajang saling sharing inspirasi, serta sudut pandang _Creativity, Innovation, Entrepreneurship, dan Leadership yang telah atau akan dilaksanakan oleh Lembaga Pendidikan tinggi di Indonesia.</p>\\n\\n<p>🗓 : Sabtu, 26 Maret 2022<br>\\n🕰 : 10.00 – 11.30 WIB<br>\\n🖥 : ZOOM &amp; Youtube MarkPlus TV</p>\\n\\n<p>Pembicara Tamu :<br>\\n1. Dr. Budi Endarto, SH. M.Hum - Rektor - Universitas Wijaya Putra Surabaya&nbsp;<br>\\n2. Dr. Prihat Assih, SE., MSi., Ak., CSRS - Wakil Rektor II - Universitas Merdeka Malang</p>\\n\\n<p>Moderator : Hermawan Kartajaya – Founder and Chairman of MarkPlus, Inc.&nbsp;</p>\\n\\n<p>Segera daftarkan diri Anda untuk bisa mendapatkan link dan E-Certificate melalui form berikut: &nbsp; &nbsp;<br>\\nhttps://bit.ly/MGTC49</p>\\n\\n<p>Terima kasih, kami tunggu kehadiran Bapak/Ibu untuk bergabung dalam acara ini, sampai jumpa dan stay safe.</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": null, "detailLokasi": "sampai jumpa dan stay safe.</p>", "tanggalMulai": "2022-03-25T17:00:00.000Z", "tipePlatform": null, "linkEksternal": "https://eventkampus.com/event/detail/4255/the-49th-markplus-goes-to-campus-entrepreneurial-marketing", "tanggalMentah": "26  - 26 Mar 2022", "teleponKontak": null, "websiteSumber": "https://eventkampus.com", "linkRegistrasi": "https://bit.ly/MGTC49", "tanggalSelesai": "2022-03-25T17:00:00.000Z", "confidenceScore": 50, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 0}}	t	2026-06-27 17:31:56.912075	processed
68	https://eventkampus.com	https://eventkampus.com/event/detail/4213/webinar-nasional-berpijak-pada-motivasi-meraih-beasiswa-dan-prestasi	{"_raw": {"harga": 0, "judul": "🔖 WEBINAR NASIONAL 🔖      Berpijak pada Motivasi                 Meraih Beasiswa         dan Prest", "kuota": null, "deskripsi": "<p>- IMAKA UNS PROUDLY PRESENT -<br>\\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🌊 KASEMARDIKA #8&nbsp;&nbsp;🌊<br>\\n¤¤¤¤¤¤¤¤°•°•°•°•°•°•°¤¤¤¤¤¤¤¤<br>\\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🔖 WEBINAR NASIONAL 🔖<br>\\n&nbsp; &nbsp; &nbsp;Berpijak pada Motivasi<br>\\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Meraih Beasiswa&nbsp;<br>\\n&nbsp; &nbsp; &nbsp; &nbsp;dan Prestasi&nbsp;</p>\\n\\n<p>Hi penerus masa depan bangsa 👋.&nbsp;<br>\\nYuk belajar dan berdiskusi bersama dengan para ahli dibidangnya. Dalam serangkaian acara KASEMARDIKA #8 akan mengadakan webinar nasional yang akan dilaksanakan pada🥳&nbsp;</p>\\n\\n<p>📆 : Minggu, 13 Februari 2022<br>\\n🕰 : 08.30 - selesai<br>\\n📍 : Zoom Meeting, Streaming Youtube&nbsp;</p>\\n\\n<p>🧑‍💼 PEMBICARA<br>\\n1. Raditya Yoke Pratama<br>\\n2. Shoffan Mujahid&nbsp;</p>\\n\\n<p>💸 FREE 💸<br>\\n🦩 BENEFIT 🦩<br>\\n1. Ilmu bermanfaat<br>\\n2. Relasi<br>\\n3. E- Sertifikat<br>\\n4. Doorprize&nbsp;</p>\\n\\n<p>‼️ Pendaftaran dan infromasi‼️&nbsp;<br>\\nhttps://lynk.id/kasemardika8</p>\\n\\n<p>☎️ Contact Person<br>\\n📱 Deva: 0895349789979<br>\\n📱 Isna: 083857198257&nbsp;</p>\\n\\n<p>Yuk, tunggu apa lagi? Segera daftarkan dirimu sekarang jugaa!&nbsp;</p>\\n\\n<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🌊 KASEMARDIKA #8 🌊<br>\\n---------------------------------------------&nbsp;</p>\\n\\n<p>📷 Instagram: @kasemardika_imakauns<br>\\n🎶 Tiktok: @kasemardika8<br>\\n💬 Facebook: Kasemardika Imaka Uns<br>\\n---------------------------------------------<br>\\n📷 Instagram: @imakauns<br>\\n🐦 Twitter: @imaka_uns<br>\\n✨ YouTube: IMAKA UNS</p>\\n\\n<p>#kasemardika8 #kasemardikaimakauns #imakauns #webinar #webinargratis #infowebinar #WebinarWithInez</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": "📱 Deva", "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4213/webinar-nasional-berpijak-pada-motivasi-meraih-beasiswa-dan-prestasi", "tanggalMentah": "13  - 13 Feb 2022", "teleponKontak": "0895349789979", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "🔖 WEBINAR NASIONAL 🔖 Berpijak pada Motivasi Meraih Beasiswa dan Prest", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.517Z", "deskripsi": "<p>- IMAKA UNS PROUDLY PRESENT -<br>\\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🌊 KASEMARDIKA #8&nbsp;&nbsp;🌊<br>\\n¤¤¤¤¤¤¤¤°•°•°•°•°•°•°¤¤¤¤¤¤¤¤<br>\\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🔖 WEBINAR NASIONAL 🔖<br>\\n&nbsp; &nbsp; &nbsp;Berpijak pada Motivasi<br>\\n&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Meraih Beasiswa&nbsp;<br>\\n&nbsp; &nbsp; &nbsp; &nbsp;dan Prestasi&nbsp;</p>\\n\\n<p>Hi penerus masa depan bangsa 👋.&nbsp;<br>\\nYuk belajar dan berdiskusi bersama dengan para ahli dibidangnya. Dalam serangkaian acara KASEMARDIKA #8 akan mengadakan webinar nasional yang akan dilaksanakan pada🥳&nbsp;</p>\\n\\n<p>📆 : Minggu, 13 Februari 2022<br>\\n🕰 : 08.30 - selesai<br>\\n📍 : Zoom Meeting, Streaming Youtube&nbsp;</p>\\n\\n<p>🧑‍💼 PEMBICARA<br>\\n1. Raditya Yoke Pratama<br>\\n2. Shoffan Mujahid&nbsp;</p>\\n\\n<p>💸 FREE 💸<br>\\n🦩 BENEFIT 🦩<br>\\n1. Ilmu bermanfaat<br>\\n2. Relasi<br>\\n3. E- Sertifikat<br>\\n4. Doorprize&nbsp;</p>\\n\\n<p>‼️ Pendaftaran dan infromasi‼️&nbsp;<br>\\nhttps://lynk.id/kasemardika8</p>\\n\\n<p>☎️ Contact Person<br>\\n📱 Deva: 0895349789979<br>\\n📱 Isna: 083857198257&nbsp;</p>\\n\\n<p>Yuk, tunggu apa lagi? Segera daftarkan dirimu sekarang jugaa!&nbsp;</p>\\n\\n<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🌊 KASEMARDIKA #8 🌊<br>\\n---------------------------------------------&nbsp;</p>\\n\\n<p>📷 Instagram: @kasemardika_imakauns<br>\\n🎶 Tiktok: @kasemardika8<br>\\n💬 Facebook: Kasemardika Imaka Uns<br>\\n---------------------------------------------<br>\\n📷 Instagram: @imakauns<br>\\n🐦 Twitter: @imaka_uns<br>\\n✨ YouTube: IMAKA UNS</p>\\n\\n<p>#kasemardika8 #kasemardikaimakauns #imakauns #webinar #webinargratis #infowebinar #WebinarWithInez</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "📱 Deva", "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-02-12T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4213/webinar-nasional-berpijak-pada-motivasi-meraih-beasiswa-dan-prestasi", "tanggalMentah": "13  - 13 Feb 2022", "teleponKontak": "0895349789979", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-02-12T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.983279	processed
72	https://eventkampus.com	https://eventkampus.com/event/detail/4205	{"_raw": {"harga": 0, "judul": "[𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗧𝗔𝗟𝗞𝗦 : 𝗛𝗢𝗪 𝗧𝗢 𝗕𝗨𝗜𝗟𝗗 𝗬𝗢𝗨𝗥 𝗢𝗪𝗡 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦]", "kuota": null, "deskripsi": "<p>[𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗧𝗔𝗟𝗞𝗦 : 𝗛𝗢𝗪 𝗧𝗢 𝗕𝗨𝗜𝗟𝗗 𝗬𝗢𝗨𝗥 𝗢𝗪𝗡 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦]</p>\\n\\n<p>Dalam membangun sebuah bisnis, dibutuhkan persiapan secara matang agar mampu bertahan dalam menghadapi persaingan usaha. Kalian penasaran gak sih mengenai tahapan yang diperlukan untuk membangun sebuah usaha? 🤔</p>\\n\\n<p>Yuk, temukan jawabannya di acara webinar 𝗕𝘂𝘀𝗶𝗻𝗲𝘀𝘀 𝗧𝗮𝗹𝗸𝘀 dengan tema :<br>\\n✨𝗛𝗼𝘄 𝘁𝗼 𝗕𝘂𝗶𝗹𝗱 𝗬𝗼𝘂𝗿 𝗢𝘄𝗻 𝗕𝘂𝘀𝗶𝗻𝗲𝘀𝘀✨</p>\\n\\n<p>Acara ini akan dilaksanakan pada =<br>\\n📆 Jumat, 4 Februari 2022<br>\\n⏰ 16.00 - 17.30<br>\\n📍 Zoom Meeting</p>\\n\\n<p>BENEFITS =<br>\\n✅ Mendapatkan ilmu pengetahuan mengenai bisnis &amp; kewirausahaan<br>\\n✅ Sertifikat<br>\\n✅ Saldo E-Wallet bagi pemenang kuis</p>\\n\\n<p>LINK REGISTRASI =<br>\\nbit.ly/RegistBusinessTalks</p>\\n\\n<p>‼️FREE REGISTRATION &amp; OPEN FOR PUBLIC‼️</p>\\n\\n<p>Untuk informasi lebih lanjut, silahkan hubungi =<br>\\nMarsa (081584673599)<br>\\nCecil (081282295400)</p>\\n\\n<p>See you there! 😊</p>\\n\\n<p>#BusinessTalks<br>\\n#HowtoBuildYourOwnBusiness<br>\\n#KKNUNAIR<br>\\n#UNAIRHEBAT</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": "Marsa ()", "detailLokasi": "Zoom Meeting", "linkEksternal": "https://eventkampus.com/event/detail/4205", "tanggalMentah": "04  - 04 Feb 2022", "teleponKontak": "081584673599", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "[𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗧𝗔𝗟𝗞𝗦 : 𝗛𝗢𝗪 𝗧𝗢 𝗕𝗨𝗜𝗟𝗗 𝗬𝗢𝗨𝗥 𝗢𝗪𝗡 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦]", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:30:22.543Z", "deskripsi": "<p>[𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦 𝗧𝗔𝗟𝗞𝗦 : 𝗛𝗢𝗪 𝗧𝗢 𝗕𝗨𝗜𝗟𝗗 𝗬𝗢𝗨𝗥 𝗢𝗪𝗡 𝗕𝗨𝗦𝗜𝗡𝗘𝗦𝗦]</p>\\n\\n<p>Dalam membangun sebuah bisnis, dibutuhkan persiapan secara matang agar mampu bertahan dalam menghadapi persaingan usaha. Kalian penasaran gak sih mengenai tahapan yang diperlukan untuk membangun sebuah usaha? 🤔</p>\\n\\n<p>Yuk, temukan jawabannya di acara webinar 𝗕𝘂𝘀𝗶𝗻𝗲𝘀𝘀 𝗧𝗮𝗹𝗸𝘀 dengan tema :<br>\\n✨𝗛𝗼𝘄 𝘁𝗼 𝗕𝘂𝗶𝗹𝗱 𝗬𝗼𝘂𝗿 𝗢𝘄𝗻 𝗕𝘂𝘀𝗶𝗻𝗲𝘀𝘀✨</p>\\n\\n<p>Acara ini akan dilaksanakan pada =<br>\\n📆 Jumat, 4 Februari 2022<br>\\n⏰ 16.00 - 17.30<br>\\n📍 Zoom Meeting</p>\\n\\n<p>BENEFITS =<br>\\n✅ Mendapatkan ilmu pengetahuan mengenai bisnis &amp; kewirausahaan<br>\\n✅ Sertifikat<br>\\n✅ Saldo E-Wallet bagi pemenang kuis</p>\\n\\n<p>LINK REGISTRASI =<br>\\nbit.ly/RegistBusinessTalks</p>\\n\\n<p>‼️FREE REGISTRATION &amp; OPEN FOR PUBLIC‼️</p>\\n\\n<p>Untuk informasi lebih lanjut, silahkan hubungi =<br>\\nMarsa (081584673599)<br>\\nCecil (081282295400)</p>\\n\\n<p>See you there! 😊</p>\\n\\n<p>#BusinessTalks<br>\\n#HowtoBuildYourOwnBusiness<br>\\n#KKNUNAIR<br>\\n#UNAIRHEBAT</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "Marsa ()", "detailLokasi": "Zoom Meeting", "tanggalMulai": "2022-02-03T17:00:00.000Z", "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4205", "tanggalMentah": "04  - 04 Feb 2022", "teleponKontak": "081584673599", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": "2022-02-03T17:00:00.000Z", "confidenceScore": 65, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 10, "tipePlatform": 15}}	t	2026-06-27 17:31:56.996922	processed
303	https://eventkampus.com	https://eventkampus.com/event/detail/4204/script-2022-proudly-present	{"_raw": {"harga": 0, "judul": "[SCRIPT 2022 PROUDLY PRESENT]", "kuota": null, "deskripsi": "<p>[SCRIPT 2022 PROUDLY PRESENT]</p>\\n\\n<p>Ini dia event andalan kita, TryOut dan Webinar. TryOut dan Webinar yang kita adakan tahun ini sebagai sarana latihan dan berbagi pengalaman bagi murid-murid yang ingin melanjutkan studinya ke perguruan tinggi.</p>\\n\\n<p>Pendaftaran Webinar akan dilaksanakan : 16 Januari - 5 Februari<br>\\nFREE HTM</p>\\n\\n<p>Pendaftaran TryOut akan dilaksanakan : 16 Januari - 6 Februari<br>\\nHTM : 10k/orang</p>\\n\\n<p>ada HARGA PROMO khusus kalian yang langsung daftar bareng 2 orang teman kalian yaitu menjadi 20k/3 orang</p>\\n\\n<p>Benefit yang akan didapat :<br>\\n- E-Sertifikat<br>\\n- Menambah Wawasan<br>\\n- Sebagai sarana latihan soal UTBK<br>\\n- Door Prize<br>\\n- HADIAH UANG TUNAI BAGI PERINGKAT PERTAMA TRYOUT SAINTEK DAN SOSHUM</p>\\n\\n<p>Untuk pendaftarannya, kalian bisa menghubungi CP yang tertera terlebih dahulu ya atau bisa langsung klik link yang ada di bio @script_telu</p>\\n\\n<p>CP :<br>\\nAris : 0822 3053 6808<br>\\nGabriel : 0896 3558 4376</p>\\n\\n<p>Rugi banget kalo kalian ga ikutan nih, jangan lupa catat tanggalnya ya, jangan sampai terlewat!</p>\\n\\n<p>#tryout #tryoututbk #tryoutonline #webinargratis #webinar #mudikroadshow2022 #telkomuniversity #smbtelkom #telutizen #kampusswastaterbaik #BoloDeweRek</p>", "tipeHarga": null, "urlBanner": "", "namaKontak": "Aris", "detailLokasi": "Online", "linkEksternal": "https://eventkampus.com/event/detail/4204/script-2022-proudly-present", "tanggalMentah": "16 Jan 2022 - 06 Feb 2022", "teleponKontak": "082230536808", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null}, "harga": 0, "judul": "[SCRIPT 2022 PROUDLY PRESENT]", "kuota": null, "kotaId": null, "cleanedAt": "2026-06-28T18:53:00.579Z", "deskripsi": "<p>[SCRIPT 2022 PROUDLY PRESENT]</p>\\n\\n<p>Ini dia event andalan kita, TryOut dan Webinar. TryOut dan Webinar yang kita adakan tahun ini sebagai sarana latihan dan berbagi pengalaman bagi murid-murid yang ingin melanjutkan studinya ke perguruan tinggi.</p>\\n\\n<p>Pendaftaran Webinar akan dilaksanakan : 16 Januari - 5 Februari<br>\\nFREE HTM</p>\\n\\n<p>Pendaftaran TryOut akan dilaksanakan : 16 Januari - 6 Februari<br>\\nHTM : 10k/orang</p>\\n\\n<p>ada HARGA PROMO khusus kalian yang langsung daftar bareng 2 orang teman kalian yaitu menjadi 20k/3 orang</p>\\n\\n<p>Benefit yang akan didapat :<br>\\n- E-Sertifikat<br>\\n- Menambah Wawasan<br>\\n- Sebagai sarana latihan soal UTBK<br>\\n- Door Prize<br>\\n- HADIAH UANG TUNAI BAGI PERINGKAT PERTAMA TRYOUT SAINTEK DAN SOSHUM</p>\\n\\n<p>Untuk pendaftarannya, kalian bisa menghubungi CP yang tertera terlebih dahulu ya atau bisa langsung klik link yang ada di bio @script_telu</p>\\n\\n<p>CP :<br>\\nAris : 0822 3053 6808<br>\\nGabriel : 0896 3558 4376</p>\\n\\n<p>Rugi banget kalo kalian ga ikutan nih, jangan lupa catat tanggalnya ya, jangan sampai terlewat!</p>\\n\\n<p>#tryout #tryoututbk #tryoutonline #webinargratis #webinar #mudikroadshow2022 #telkomuniversity #smbtelkom #telutizen #kampusswastaterbaik #BoloDeweRek</p>", "tipeHarga": null, "urlBanner": "", "jenisEvent": "seminar", "kategoriId": null, "namaKontak": "Aris", "detailLokasi": "Online", "tanggalMulai": null, "tipePlatform": "online", "linkEksternal": "https://eventkampus.com/event/detail/4204/script-2022-proudly-present", "tanggalMentah": "16 Jan 2022 - 06 Feb 2022", "teleponKontak": "082230536808", "websiteSumber": "https://eventkampus.com", "linkRegistrasi": null, "tanggalSelesai": null, "confidenceScore": 55, "fieldConfidence": {"harga": 0, "judul": 10, "kontak": 15, "kotaId": 0, "deskripsi": 15, "kategoriId": 0, "tanggalMulai": 0, "tipePlatform": 15}}	t	2026-06-29 01:50:47.788952	processed
\.


--
-- TOC entry 5249 (class 0 OID 23712)
-- Dependencies: 261
-- Data for Name: scraping_auto_approval_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scraping_auto_approval_rules (id, rule_name, condition_type, threshold_value, auto_publish, enabled, created_at) FROM stdin;
1	High Confidence Auto-Publish	confidence_score	90	t	t	2026-06-25 07:57:44.652335
2	Medium Confidence Manual Review	confidence_score	70	f	t	2026-06-25 07:57:44.658963
3	High Confidence Auto-Publish	confidence_score	90	t	t	2026-06-28 09:34:13.286731
4	Medium Confidence Manual Review	confidence_score	70	f	t	2026-06-28 09:34:13.290985
5	High Confidence Auto-Publish	confidence_score	90	t	t	2026-06-28 18:49:23.718024
6	Medium Confidence Manual Review	confidence_score	70	f	t	2026-06-28 18:49:23.724283
7	High Confidence Auto-Publish	confidence_score	90	t	t	2026-06-29 13:38:55.460717
8	Medium Confidence Manual Review	confidence_score	70	f	t	2026-06-29 13:38:55.469642
\.


--
-- TOC entry 5251 (class 0 OID 23723)
-- Dependencies: 263
-- Data for Name: scraping_sources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scraping_sources (id, name, base_url, url_pattern, scraper_type, cron_schedule, max_results_per_run, rate_limit_delay_ms, max_concurrent_requests, is_active, last_scraped_at, last_successful_count, last_error_message, created_at, updated_at) FROM stdin;
6	InfoSeminar - Beranda	https://infoseminar.id	\N	crawlee_playwright	\N	100	2000	2	t	\N	\N	\N	2026-06-28 09:34:13.273453	2026-06-28 09:34:13.273453
9	InfoSeminar - Beranda	https://infoseminar.id	\N	crawlee_playwright	\N	100	2000	2	t	\N	\N	\N	2026-06-28 18:49:23.703258	2026-06-28 18:49:23.703258
4	Eventkampus - Seminar	https://eventkampus.com	/event/kategori/seminar	crawlee_playwright	\N	100	1000	2	t	2026-06-28 19:05:57.719	4	\N	2026-06-28 09:34:13.267901	2026-06-28 09:34:13.267901
2	Eventkampus - Conference	https://eventkampus.com	/event/kategori/conference	crawlee_playwright	\N	50	1500	2	t	2026-06-28 19:06:57.698	0	\N	2026-06-25 07:57:44.634635	2026-06-25 07:57:44.634635
8	Eventkampus - Conference	https://eventkampus.com	/event/kategori/conference	crawlee_playwright	\N	50	1500	2	t	2026-06-28 19:07:06.021	0	\N	2026-06-28 18:49:23.702114	2026-06-28 18:49:23.702114
5	Eventkampus - Conference	https://eventkampus.com	/event/kategori/conference	crawlee_playwright	\N	50	1500	2	t	2026-06-28 19:07:12.451	0	\N	2026-06-28 09:34:13.272551	2026-06-28 09:34:13.272551
3	InfoSeminar - Beranda	https://infoseminar.id	\N	crawlee_playwright	\N	100	2000	2	t	2026-06-28 19:07:29.143	0	\N	2026-06-25 07:57:44.635852	2026-06-25 07:57:44.635852
7	Eventkampus - Seminar	https://eventkampus.com	/event/kategori/seminar	crawlee_playwright	\N	100	1000	2	t	2026-06-28 19:12:52.131	3	\N	2026-06-28 18:49:23.694624	2026-06-28 18:49:23.694624
1	Eventkampus - Seminar	https://eventkampus.com	/event/kategori/seminar	crawlee_playwright	\N	100	1000	2	t	2026-06-28 19:17:34.518	0	\N	2026-06-25 07:57:44.626704	2026-06-25 07:57:44.626704
10	Eventkampus - Seminar	https://eventkampus.com	/event/kategori/seminar	crawlee_playwright	\N	100	1000	2	t	\N	\N	\N	2026-06-29 13:38:55.428544	2026-06-29 13:38:55.428544
11	Eventkampus - Conference	https://eventkampus.com	/event/kategori/conference	crawlee_playwright	\N	50	1500	2	t	\N	\N	\N	2026-06-29 13:38:55.438035	2026-06-29 13:38:55.438035
12	InfoSeminar - Beranda	https://infoseminar.id	\N	crawlee_playwright	\N	100	2000	2	t	\N	\N	\N	2026-06-29 13:38:55.439602	2026-06-29 13:38:55.439602
\.


--
-- TOC entry 5253 (class 0 OID 23739)
-- Dependencies: 265
-- Data for Name: scraping_validation_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scraping_validation_rules (id, field_name, is_required, min_length, max_length, regex_pattern, confidence_threshold, created_at) FROM stdin;
1	judul	t	3	255	\N	10	2026-06-25 07:57:44.637956
2	linkEksternal	t	\N	\N	\N	10	2026-06-25 07:57:44.64493
3	tanggalMentah	t	\N	\N	\N	10	2026-06-25 07:57:44.646135
6	deskripsi	f	20	\N	\N	15	2026-06-25 07:57:44.65038
4	detailLokasi	f	\N	500	\N	15	2026-06-25 07:57:44.647494
5	urlBanner	t	\N	\N	\N	0	2026-06-25 07:57:44.64904
19	judul	t	3	255	\N	10	2026-06-29 13:38:55.444345
20	linkEksternal	t	\N	\N	\N	10	2026-06-29 13:38:55.452396
21	tanggalMentah	t	\N	\N	\N	10	2026-06-29 13:38:55.45379
22	detailLokasi	f	\N	500	\N	15	2026-06-29 13:38:55.455002
23	urlBanner	f	\N	\N	\N	0	2026-06-29 13:38:55.456302
24	deskripsi	f	20	\N	\N	15	2026-06-29 13:38:55.457565
\.


--
-- TOC entry 5232 (class 0 OID 16588)
-- Dependencies: 244
-- Data for Name: tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tag (id, nama) FROM stdin;
1	#ArtificialIntelligence
2	#CyberSecurity
3	#DataScience
4	#InternetOfThings
5	#SoftwareEngineering
6	#CloudComputing
7	#Fisika
8	#Kimia
9	#Biologi
10	#MatematikaTerapan
11	#Biotehnologi
12	#Statistika
13	#TeknikSipil
14	#TeknikMesin
15	#TeknikElektro
16	#TeknikKimia
17	#TeknikIndustri
18	#Manajemen
19	#Akuntansi
20	#EkonomiPembangunan
21	#Keuangan
22	#Kewirausahaan
23	#PemasaranDigital
24	#Kedokteran
25	#Keperawatan
26	#KesehatanMasyarakat
27	#Farmasi
28	#Gizi
29	#Linguistik
30	#SastraIndonesia
31	#SastraInggris
32	#PembelajaranBahasa
33	#Penerjemahan
34	#SeniRupa
35	#DesainKomunikasiVisual
36	#SeniMusik
37	#AntropologiBudaya
38	#Sejarah
39	#Sosiologi
40	#IlmuPolitik
41	#HukumPerdata
42	#HukumPidana
43	#HubunganInternasional
44	#Agronomi
45	#Kehutanan
46	#TeknologiPangan
47	#PerubahanIklim
48	#PembangunanBerkelanjutan
49	#KurikulumMerdeka
50	#MetodePembelajaran
51	#ManajemenPendidikan
52	#PendidikanInklusi
53	#PendidikanKarakter
54	#AsesmenPembelajaran
55	#MetodologiPenelitian
56	#PenulisanKaryaIlmiah
57	#JurnalScopus
58	#JurnalSinta
59	#Mendeley
60	#PsikologiKlinis
61	#PsikologiPerkembangan
62	#PsikologiPendidikan
63	#KesehatanMental
64	#Konseling
65	#FilsafatIlmu
66	#StudiKeagamaan
67	#Etika
68	#PendidikanAgama
\.


--
-- TOC entry 5234 (class 0 OID 16597)
-- Dependencies: 246
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, nama_lengkap, email, nomor_telepon, institusi, password, email_terverifikasi, tanggal_lahir, jenis_kelamin, role, url_avatar, dibuat_pada, diperbarui_pada, dihapus_pada, pekerjaan, disetujui, diblokir, terakhir_aktif_pada) FROM stdin;
1	Admin	poliventsofficial@gmail.com	081234567890	Politeknik Negeri Semarang	$2b$10$BpA6YHieSbfwX1k5seWl3e7qw0yKqzutdaw6VDIYNeIkeLMS67Jry	2026-06-29 06:38:54.5	\N	\N	admin	https://picsum.photos/seed/avatar/200/200	2026-06-29 13:38:54.506366	\N	\N	\N	t	f	\N
2	Penyelenggara	organizer@gmail.com	081234567891	Politeknik Negeri Semarang	$2b$10$G5szPn2Im05JUExmHgSjbuMDZgn0IQ4OfSgRiFw7PLfcNfZbtCltG	2026-06-29 06:38:54.589	\N	\N	organizer	https://picsum.photos/seed/avatar/200/200	2026-06-29 13:38:54.593331	\N	\N	\N	t	f	\N
3	Pengunjung	visitor@gmail.com	081234567892	Politeknik Negeri Semarang	$2b$10$tOUCoX.W11mxjnzyLVzupeK93i1l580k0z/k/E9SD5PiKVsuQa7HS	2026-06-29 06:38:54.667	\N	\N	visitor	https://picsum.photos/seed/avatar/200/200	2026-06-29 13:38:54.671655	\N	\N	\N	t	f	\N
4	Ahmad Rizki Pratama	ahmad.rizki@gmail.com	082111222333	Universitas Diponegoro	$2b$10$YOQYg4FWDCUqBbXBcTi.tuKN7UiaN/IA5UuFt0lsEkyB.onklcbSa	2026-06-29 06:38:54.748	\N	Laki-laki	visitor	https://picsum.photos/seed/avatar/200/200	2026-06-29 13:38:54.752259	\N	\N	Mahasiswa	t	f	\N
5	Siti Nurhaliza	siti.nurhaliza@gmail.com	082111222334	Universitas Gadjah Mada	$2b$10$jpKBMYsO5EGf3zukAYrlTO/CkV6oPcT8DLB4SyUcwWrg4QrsbzQ.m	2026-06-29 06:38:54.83	\N	Perempuan	visitor	https://picsum.photos/seed/avatar/200/200	2026-06-29 13:38:54.833996	\N	\N	Mahasiswa	t	f	\N
6	Budi Santoso	budi.santoso@gmail.com	082111222335	Institut Teknologi Bandung	$2b$10$uU31xQ8TAV9b48oenKV3W.nVHomTVtxCAmi.j6zI6DVh6zf5aNL3e	2026-06-29 06:38:54.917	\N	Laki-laki	visitor	https://picsum.photos/seed/avatar/200/200	2026-06-29 13:38:54.921331	\N	\N	Mahasiswa	t	f	\N
7	Dewi Anggraini	dewi.anggraini@gmail.com	082111222336	Universitas Indonesia	$2b$10$ogqwtAQP69X3kq0e6Zx.KOJaq.bVMP4E52/w3FVMgFBVQRXGGt6yC	2026-06-29 06:38:55	\N	Perempuan	visitor	https://picsum.photos/seed/avatar/200/200	2026-06-29 13:38:55.004008	\N	\N	Mahasiswa	t	f	\N
8	Fajar Setiawan	fajar.setiawan@gmail.com	082111222337	Universitas Brawijaya	$2b$10$qIS5f3MQ6rfYjdy7OIxBq.fAi6CGCUixccHiD6CDS5PKDjy.5eDzW	2026-06-29 06:38:55.092	\N	Laki-laki	visitor	https://picsum.photos/seed/avatar/200/200	2026-06-29 13:38:55.096384	\N	\N	Dosen	t	f	\N
9	Mochamad Faqih Ardiansyah	mofaqihardiansyah@gmail.com	+6282327655735	Instana1	$2b$10$TffLVuL1/BO.aEV/fkSzVOOCQdCAyLYCq3tEEFoypNtBtbFhiZvG2	2026-06-29 07:06:07.505	2006-06-14 00:00:00	Laki-laki	visitor	/uploads/avatars/fotodummy.jpg	2026-06-29 14:05:43.210124	\N	\N	Mahasiswa	f	f	\N
\.


--
-- TOC entry 5282 (class 0 OID 0)
-- Dependencies: 248
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- TOC entry 5283 (class 0 OID 0)
-- Dependencies: 218
-- Name: event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_id_seq', 41, true);


--
-- TOC entry 5284 (class 0 OID 0)
-- Dependencies: 250
-- Name: info_pembayaran_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.info_pembayaran_id_seq', 1, false);


--
-- TOC entry 5285 (class 0 OID 0)
-- Dependencies: 221
-- Name: jadwal_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jadwal_event_id_seq', 1, false);


--
-- TOC entry 5286 (class 0 OID 0)
-- Dependencies: 223
-- Name: kategori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kategori_id_seq', 1, false);


--
-- TOC entry 5287 (class 0 OID 0)
-- Dependencies: 225
-- Name: kota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kota_id_seq', 1, false);


--
-- TOC entry 5288 (class 0 OID 0)
-- Dependencies: 227
-- Name: lampiran_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lampiran_event_id_seq', 1, false);


--
-- TOC entry 5289 (class 0 OID 0)
-- Dependencies: 229
-- Name: log_admin_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_admin_id_seq', 1, false);


--
-- TOC entry 5290 (class 0 OID 0)
-- Dependencies: 256
-- Name: log_scraping_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.log_scraping_id_seq', 16, true);


--
-- TOC entry 5291 (class 0 OID 0)
-- Dependencies: 231
-- Name: otp_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.otp_codes_id_seq', 1, true);


--
-- TOC entry 5292 (class 0 OID 0)
-- Dependencies: 233
-- Name: paper_submission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paper_submission_id_seq', 4, true);


--
-- TOC entry 5293 (class 0 OID 0)
-- Dependencies: 252
-- Name: pembicara_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pembicara_id_seq', 41, true);


--
-- TOC entry 5294 (class 0 OID 0)
-- Dependencies: 235
-- Name: pendaftaran_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pendaftaran_id_seq', 6, true);


--
-- TOC entry 5295 (class 0 OID 0)
-- Dependencies: 254
-- Name: penulis_paper_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.penulis_paper_id_seq', 9, true);


--
-- TOC entry 5296 (class 0 OID 0)
-- Dependencies: 237
-- Name: peserta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.peserta_id_seq', 6, true);


--
-- TOC entry 5297 (class 0 OID 0)
-- Dependencies: 239
-- Name: profil_penyelenggara_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profil_penyelenggara_id_seq', 1, true);


--
-- TOC entry 5298 (class 0 OID 0)
-- Dependencies: 241
-- Name: provinsi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provinsi_id_seq', 1, false);


--
-- TOC entry 5299 (class 0 OID 0)
-- Dependencies: 258
-- Name: raw_scraped_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.raw_scraped_data_id_seq', 307, true);


--
-- TOC entry 5300 (class 0 OID 0)
-- Dependencies: 260
-- Name: scraping_auto_approval_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scraping_auto_approval_rules_id_seq', 8, true);


--
-- TOC entry 5301 (class 0 OID 0)
-- Dependencies: 262
-- Name: scraping_sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scraping_sources_id_seq', 12, true);


--
-- TOC entry 5302 (class 0 OID 0)
-- Dependencies: 264
-- Name: scraping_validation_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scraping_validation_rules_id_seq', 24, true);


--
-- TOC entry 5303 (class 0 OID 0)
-- Dependencies: 243
-- Name: tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tag_id_seq', 68, true);


--
-- TOC entry 5304 (class 0 OID 0)
-- Dependencies: 245
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- TOC entry 5020 (class 2606 OID 22049)
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: postgres
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4968 (class 2606 OID 16468)
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (id);


--
-- TOC entry 4970 (class 2606 OID 16470)
-- Name: event event_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_slug_unique UNIQUE (slug);


--
-- TOC entry 4975 (class 2606 OID 16475)
-- Name: event_tag event_tag_event_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tag
    ADD CONSTRAINT event_tag_event_id_tag_id_pk PRIMARY KEY (event_id, tag_id);


--
-- TOC entry 5018 (class 2606 OID 20527)
-- Name: favorit favorit_user_id_event_id_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorit
    ADD CONSTRAINT favorit_user_id_event_id_pk PRIMARY KEY (user_id, event_id);


--
-- TOC entry 5022 (class 2606 OID 22796)
-- Name: info_pembayaran info_pembayaran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.info_pembayaran
    ADD CONSTRAINT info_pembayaran_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 16484)
-- Name: jadwal_event jadwal_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jadwal_event
    ADD CONSTRAINT jadwal_event_pkey PRIMARY KEY (id);


--
-- TOC entry 4979 (class 2606 OID 16493)
-- Name: kategori kategori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kategori
    ADD CONSTRAINT kategori_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 16495)
-- Name: kategori kategori_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kategori
    ADD CONSTRAINT kategori_slug_unique UNIQUE (slug);


--
-- TOC entry 4983 (class 2606 OID 16502)
-- Name: kota kota_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kota
    ADD CONSTRAINT kota_pkey PRIMARY KEY (id);


--
-- TOC entry 4986 (class 2606 OID 16511)
-- Name: lampiran_event lampiran_event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lampiran_event
    ADD CONSTRAINT lampiran_event_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 16521)
-- Name: log_admin log_admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_admin
    ADD CONSTRAINT log_admin_pkey PRIMARY KEY (id);


--
-- TOC entry 5028 (class 2606 OID 23296)
-- Name: log_scraping log_scraping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_scraping
    ADD CONSTRAINT log_scraping_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 16531)
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 4992 (class 2606 OID 16542)
-- Name: paper_submission paper_submission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paper_submission
    ADD CONSTRAINT paper_submission_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 22806)
-- Name: pembicara pembicara_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pembicara
    ADD CONSTRAINT pembicara_pkey PRIMARY KEY (id);


--
-- TOC entry 4994 (class 2606 OID 16553)
-- Name: pendaftaran pendaftaran_kode_pendaftaran_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_kode_pendaftaran_unique UNIQUE (kode_pendaftaran);


--
-- TOC entry 4996 (class 2606 OID 16551)
-- Name: pendaftaran pendaftaran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_pkey PRIMARY KEY (id);


--
-- TOC entry 5026 (class 2606 OID 22817)
-- Name: penulis_paper penulis_paper_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penulis_paper
    ADD CONSTRAINT penulis_paper_pkey PRIMARY KEY (id);


--
-- TOC entry 4998 (class 2606 OID 16565)
-- Name: peserta peserta_kode_peserta_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peserta
    ADD CONSTRAINT peserta_kode_peserta_unique UNIQUE (kode_peserta);


--
-- TOC entry 5000 (class 2606 OID 16563)
-- Name: peserta peserta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peserta
    ADD CONSTRAINT peserta_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 16575)
-- Name: profil_penyelenggara profil_penyelenggara_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profil_penyelenggara
    ADD CONSTRAINT profil_penyelenggara_pkey PRIMARY KEY (id);


--
-- TOC entry 5004 (class 2606 OID 16577)
-- Name: profil_penyelenggara profil_penyelenggara_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profil_penyelenggara
    ADD CONSTRAINT profil_penyelenggara_user_id_unique UNIQUE (user_id);


--
-- TOC entry 5006 (class 2606 OID 16586)
-- Name: provinsi provinsi_nama_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinsi
    ADD CONSTRAINT provinsi_nama_unique UNIQUE (nama);


--
-- TOC entry 5008 (class 2606 OID 16584)
-- Name: provinsi provinsi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinsi
    ADD CONSTRAINT provinsi_pkey PRIMARY KEY (id);


--
-- TOC entry 5030 (class 2606 OID 23307)
-- Name: raw_scraped_data raw_scraped_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.raw_scraped_data
    ADD CONSTRAINT raw_scraped_data_pkey PRIMARY KEY (id);


--
-- TOC entry 5034 (class 2606 OID 23721)
-- Name: scraping_auto_approval_rules scraping_auto_approval_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scraping_auto_approval_rules
    ADD CONSTRAINT scraping_auto_approval_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 5036 (class 2606 OID 23737)
-- Name: scraping_sources scraping_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scraping_sources
    ADD CONSTRAINT scraping_sources_pkey PRIMARY KEY (id);


--
-- TOC entry 5038 (class 2606 OID 23749)
-- Name: scraping_validation_rules scraping_validation_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scraping_validation_rules
    ADD CONSTRAINT scraping_validation_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 5010 (class 2606 OID 16595)
-- Name: tag tag_nama_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_nama_unique UNIQUE (nama);


--
-- TOC entry 5012 (class 2606 OID 16593)
-- Name: tag tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 16610)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 5016 (class 2606 OID 16608)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4971 (class 1259 OID 16703)
-- Name: kategori_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX kategori_idx ON public.event USING btree (kategori_id);


--
-- TOC entry 4984 (class 1259 OID 22843)
-- Name: kota_provinsi_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX kota_provinsi_idx ON public.kota USING btree (provinsi_id, nama);


--
-- TOC entry 4972 (class 1259 OID 16702)
-- Name: organizer_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX organizer_idx ON public.event USING btree (organizer_id);


--
-- TOC entry 5031 (class 1259 OID 23752)
-- Name: raw_scraped_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX raw_scraped_status_idx ON public.raw_scraped_data USING btree (status);


--
-- TOC entry 5032 (class 1259 OID 23751)
-- Name: raw_scraped_url_target_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX raw_scraped_url_target_idx ON public.raw_scraped_data USING btree (url_target);


--
-- TOC entry 4973 (class 1259 OID 16704)
-- Name: status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX status_idx ON public.event USING btree (status);


--
-- TOC entry 5039 (class 2606 OID 16626)
-- Name: event event_kategori_id_kategori_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_kategori_id_kategori_id_fk FOREIGN KEY (kategori_id) REFERENCES public.kategori(id);


--
-- TOC entry 5040 (class 2606 OID 16631)
-- Name: event event_kota_id_kota_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_kota_id_kota_id_fk FOREIGN KEY (kota_id) REFERENCES public.kota(id);


--
-- TOC entry 5041 (class 2606 OID 16621)
-- Name: event event_organizer_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_organizer_id_users_id_fk FOREIGN KEY (organizer_id) REFERENCES public.users(id);


--
-- TOC entry 5042 (class 2606 OID 16636)
-- Name: event_tag event_tag_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tag
    ADD CONSTRAINT event_tag_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 5043 (class 2606 OID 16641)
-- Name: event_tag event_tag_tag_id_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tag
    ADD CONSTRAINT event_tag_tag_id_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.tag(id);


--
-- TOC entry 5057 (class 2606 OID 20555)
-- Name: favorit favorit_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorit
    ADD CONSTRAINT favorit_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 5058 (class 2606 OID 20550)
-- Name: favorit favorit_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorit
    ADD CONSTRAINT favorit_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5044 (class 2606 OID 16646)
-- Name: jadwal_event jadwal_event_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jadwal_event
    ADD CONSTRAINT jadwal_event_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 5045 (class 2606 OID 16651)
-- Name: kota kota_provinsi_id_provinsi_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kota
    ADD CONSTRAINT kota_provinsi_id_provinsi_id_fk FOREIGN KEY (provinsi_id) REFERENCES public.provinsi(id);


--
-- TOC entry 5046 (class 2606 OID 16656)
-- Name: lampiran_event lampiran_event_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lampiran_event
    ADD CONSTRAINT lampiran_event_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 5047 (class 2606 OID 16661)
-- Name: log_admin log_admin_admin_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_admin
    ADD CONSTRAINT log_admin_admin_id_users_id_fk FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- TOC entry 5048 (class 2606 OID 16666)
-- Name: log_admin log_admin_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.log_admin
    ADD CONSTRAINT log_admin_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 5049 (class 2606 OID 16671)
-- Name: paper_submission paper_submission_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paper_submission
    ADD CONSTRAINT paper_submission_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 5050 (class 2606 OID 16676)
-- Name: paper_submission paper_submission_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paper_submission
    ADD CONSTRAINT paper_submission_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5059 (class 2606 OID 22823)
-- Name: pembicara pembicara_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pembicara
    ADD CONSTRAINT pembicara_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 5051 (class 2606 OID 16681)
-- Name: pendaftaran pendaftaran_event_id_event_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_event_id_event_id_fk FOREIGN KEY (event_id) REFERENCES public.event(id);


--
-- TOC entry 5052 (class 2606 OID 22833)
-- Name: pendaftaran pendaftaran_metode_pembayaran_id_info_pembayaran_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_metode_pembayaran_id_info_pembayaran_id_fk FOREIGN KEY (metode_pembayaran_id) REFERENCES public.info_pembayaran(id);


--
-- TOC entry 5053 (class 2606 OID 16686)
-- Name: pendaftaran pendaftaran_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pendaftaran
    ADD CONSTRAINT pendaftaran_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5060 (class 2606 OID 22828)
-- Name: penulis_paper penulis_paper_paper_submission_id_paper_submission_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.penulis_paper
    ADD CONSTRAINT penulis_paper_paper_submission_id_paper_submission_id_fk FOREIGN KEY (paper_submission_id) REFERENCES public.paper_submission(id);


--
-- TOC entry 5054 (class 2606 OID 16691)
-- Name: peserta peserta_pendaftaran_id_pendaftaran_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peserta
    ADD CONSTRAINT peserta_pendaftaran_id_pendaftaran_id_fk FOREIGN KEY (pendaftaran_id) REFERENCES public.pendaftaran(id);


--
-- TOC entry 5055 (class 2606 OID 22838)
-- Name: peserta peserta_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.peserta
    ADD CONSTRAINT peserta_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5056 (class 2606 OID 16696)
-- Name: profil_penyelenggara profil_penyelenggara_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.profil_penyelenggara
    ADD CONSTRAINT profil_penyelenggara_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2026-07-15 19:31:14

--
-- PostgreSQL database dump complete
--

\unrestrict dbCisCNr2xi2TfVPqpqhCMIJfJQMBUaaTRct9KfplKsxj5AlzeeXpBYIsOCcwXq

