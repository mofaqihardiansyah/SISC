import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const pengguna = pgTable('pengguna', {
  id: serial('id').primaryKey(),
  namaLengkap: varchar('nama_lengkap'),
  email: varchar('email').unique(),
  password: varchar('password'),
  noTelepon: varchar('no_telepon'),
  tanggalLahir: timestamp('tanggal_lahir'),
  jenisKelamin: varchar('jenis_kelamin'), // 'laki-laki', 'perempuan'
  nik: varchar('nik'), // NIK 
  peran: varchar('peran'), // admin, organizer, visitor
  urlAvatar: varchar('url_avatar'),
  terverifikasi: boolean('terverifikasi').default(false),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

export const provinsi = pgTable('provinsi', {
  id: serial('id').primaryKey(),
  nama: varchar('nama').unique(),
});

export const kota = pgTable('kota', {
  id: serial('id').primaryKey(),
  provinsiId: integer('provinsi_id').references(() => provinsi.id),
  nama: varchar('nama'),
});

export const kategori = pgTable('kategori', {
  id: serial('id').primaryKey(),
  nama: varchar('nama'), // IT, Medis, Ekonomi, dll
  slug: varchar('slug').unique(),
  urlIkon: varchar('url_ikon'),
});

export const tag = pgTable('tag', {
  id: serial('id').primaryKey(),
  nama: varchar('nama').unique(), // AI, Web3, Seminar Nasional
});

export const eventTag = pgTable('event_tag', {
  eventId: integer('event_id').references(() => event.id),
  tagId: integer('tag_id').references(() => tag.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.tagId] }),
}));

export const event = pgTable('event', {
  id: serial('id').primaryKey(),
  penyelenggaraId: integer('penyelenggara_id').references(() => pengguna.id), // Null jika scraping
  kategoriId: integer('kategori_id').references(() => kategori.id),
  kotaId: integer('kota_id').references(() => kota.id),
  judul: varchar('judul'),
  slug: varchar('slug').unique(),
  deskripsi: text('deskripsi'),
  syaratKetentuan: text('syarat_ketentuan'),
  urlBanner: varchar('url_banner'),
  tanggalMulai: timestamp('tanggal_mulai'),
  tanggalSelesai: timestamp('tanggal_selesai'),
  batasRegistrasi: timestamp('batas_registrasi'),
  
  // Event Classification
  isEventPolines: boolean('is_event_polines').default(false),
  tipePlatform: varchar('tipe_platform'), // 'online', 'offline', 'hybrid'
  tipeHarga: varchar('tipe_harga'), // 'free', 'paid'
  detailLokasi: text('detail_lokasi'), // Alamat spesifik/Gedung
  linkEksternal: varchar('link_eksternal'), // Link pendaftaran asli
  
  // Contact Info
  namaKontak: varchar('nama_kontak'),
  emailKontak: varchar('email_kontak'),
  teleponKontak: varchar('telepon_kontak'),
  
  // Registration Settings
  maksTiketPerTransaksi: integer('maks_tiket_per_transaksi'),
  satuAkunSatuTransaksi: boolean('satu_akun_satu_transaksi').default(false),
  
  status: varchar('status').default('pending'), // pending, published, rejected, unpublish_request
  hasilScraping: boolean('hasil_scraping').default(false),
  sumberWebsite: varchar('sumber_website'), // Asal scraping
  jumlahDilihat: integer('jumlah_dilihat').default(0),
  alasanPenolakan: text('alasan_penolakan'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
});

export const sosialMediaEvent = pgTable('sosial_media_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  platform: varchar('platform'), // whatsapp, instagram, website
  url: varchar('url'),
});

export const lampiranEvent = pgTable('lampiran_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  urlFile: varchar('url_file'),
  tipeFile: varchar('tipe_file'), // image, pdf
});

export const bookmark = pgTable('bookmark', {
  id: serial('id').primaryKey(),
  penggunaId: integer('pengguna_id').references(() => pengguna.id),
  eventId: integer('event_id').references(() => event.id),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

export const notifikasi = pgTable('notifikasi', {
  id: serial('id').primaryKey(),
  penggunaId: integer('pengguna_id').references(() => pengguna.id),
  judul: varchar('judul'),
  pesan: text('pesan'),
  sudahDibaca: boolean('sudah_dibaca').default(false),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

export const logAdmin = pgTable('log_admin', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => pengguna.id),
  eventId: integer('event_id').references(() => event.id),
  aksi: varchar('aksi'), // approved, rejected, edited
  dataSebelumnya: jsonb('data_sebelumnya'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

export const tiketEvent = pgTable('tiket_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  nama: varchar('nama'), // Reguler, VIP, Early Bird
  deskripsi: text('deskripsi'),
  harga: integer('harga').default(0),
  kuota: integer('kuota'),
  tanggalMulaiPenjualan: timestamp('tanggal_mulai_penjualan'),
  tanggalSelesaiPenjualan: timestamp('tanggal_selesai_penjualan'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

export const transaksi = pgTable('transaksi', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  penggunaId: integer('pengguna_id').references(() => pengguna.id),
  kodeBooking: varchar('kode_booking').unique(),
  status: varchar('status').default('pending'), // pending, confirmed, cancelled
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
});

export const peserta = pgTable('peserta', {
  id: serial('id').primaryKey(),
  transaksiId: integer('transaksi_id').references(() => transaksi.id),
  tiketId: integer('tiket_id').references(() => tiketEvent.id),
  kodeTiket: varchar('kode_tiket').unique(), // Khusus untuk QR Code check-in per orang
  namaLengkap: varchar('nama_lengkap'),
  email: varchar('email'),
  noTelepon: varchar('no_telepon'),
  hadir: boolean('hadir').default(false),
  waktuKehadiran: timestamp('waktu_kehadiran'),
});

export const pembicaraEvent = pgTable('pembicara_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  nama: varchar('nama'),
  peran: varchar('peran'), // Keynote Speaker, dll
  urlFoto: varchar('url_foto'),
});

export const jadwalEvent = pgTable('jadwal_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  waktuMulai: timestamp('waktu_mulai'),
  waktuSelesai: timestamp('waktu_selesai'),
  deskripsi: text('deskripsi'), // Sesi Tanya Jawab, Pembukaan, dll
});

// --- R E L A T I O N S ---
// Defines how tables connect to each other for easy querying in Drizzle

export const penggunaRelations = relations(pengguna, ({ many }) => ({
  event: many(event),
  bookmark: many(bookmark),
  notifikasi: many(notifikasi),
  logAdmin: many(logAdmin),
  transaksi: many(transaksi),
}));

export const provinsiRelations = relations(provinsi, ({ many }) => ({
  kota: many(kota),
}));

export const kotaRelations = relations(kota, ({ one, many }) => ({
  provinsi: one(provinsi, {
    fields: [kota.provinsiId],
    references: [provinsi.id],
  }),
  event: many(event),
}));

export const kategoriRelations = relations(kategori, ({ many }) => ({
  event: many(event),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  event: many(eventTag),
}));

export const eventTagRelations = relations(eventTag, ({ one }) => ({
  event: one(event, {
    fields: [eventTag.eventId],
    references: [event.id],
  }),
  tag: one(tag, {
    fields: [eventTag.tagId],
    references: [tag.id],
  }),
}));

export const eventRelations = relations(event, ({ one, many }) => ({
  penyelenggara: one(pengguna, {
    fields: [event.penyelenggaraId],
    references: [pengguna.id],
  }),
  kategori: one(kategori, {
    fields: [event.kategoriId],
    references: [kategori.id],
  }),
  kota: one(kota, {
    fields: [event.kotaId],
    references: [kota.id],
  }),
  bookmark: many(bookmark),
  tag: many(eventTag),
  sosialMedia: many(sosialMediaEvent),
  lampiran: many(lampiranEvent),
  logAdmin: many(logAdmin),
  tiket: many(tiketEvent),
  transaksi: many(transaksi),
  pembicara: many(pembicaraEvent),
  jadwal: many(jadwalEvent),
}));

export const sosialMediaEventRelations = relations(sosialMediaEvent, ({ one }) => ({
  event: one(event, {
    fields: [sosialMediaEvent.eventId],
    references: [event.id],
  }),
}));

export const lampiranEventRelations = relations(lampiranEvent, ({ one }) => ({
  event: one(event, {
    fields: [lampiranEvent.eventId],
    references: [event.id],
  }),
}));

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  pengguna: one(pengguna, {
    fields: [bookmark.penggunaId],
    references: [pengguna.id],
  }),
  event: one(event, {
    fields: [bookmark.eventId],
    references: [event.id],
  }),
}));

export const notifikasiRelations = relations(notifikasi, ({ one }) => ({
  pengguna: one(pengguna, {
    fields: [notifikasi.penggunaId],
    references: [pengguna.id],
  }),
}));

export const logAdminRelations = relations(logAdmin, ({ one }) => ({
  admin: one(pengguna, {
    fields: [logAdmin.adminId],
    references: [pengguna.id],
  }),
  event: one(event, {
    fields: [logAdmin.eventId],
    references: [event.id],
  }),
}));

export const tiketEventRelations = relations(tiketEvent, ({ one, many }) => ({
  event: one(event, {
    fields: [tiketEvent.eventId],
    references: [event.id],
  }),
  peserta: many(peserta),
}));

export const transaksiRelations = relations(transaksi, ({ one, many }) => ({
  event: one(event, {
    fields: [transaksi.eventId],
    references: [event.id],
  }),
  pengguna: one(pengguna, {
    fields: [transaksi.penggunaId],
    references: [pengguna.id],
  }),
  peserta: many(peserta),
}));

export const pesertaRelations = relations(peserta, ({ one }) => ({
  transaksi: one(transaksi, {
    fields: [peserta.transaksiId],
    references: [transaksi.id],
  }),
  tiket: one(tiketEvent, {
    fields: [peserta.tiketId],
    references: [tiketEvent.id],
  }),
}));

export const pembicaraEventRelations = relations(pembicaraEvent, ({ one }) => ({
  event: one(event, {
    fields: [pembicaraEvent.eventId],
    references: [event.id],
  }),
}));

export const jadwalEventRelations = relations(jadwalEvent, ({ one }) => ({
  event: one(event, {
    fields: [jadwalEvent.eventId],
    references: [event.id],
  }),
}));
