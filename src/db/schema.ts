import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, primaryKey, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const eventStatusEnum = pgEnum('event_status', ['draft', 'pending', 'published', 'rejected']);
export const jenisEventEnum = pgEnum('jenis_event', ['seminar', 'conference']);
export const tipePlatformEnum = pgEnum('tipe_platform', ['online', 'offline', 'hybrid']);
export const tipeHargaEnum = pgEnum('tipe_harga', ['free', 'paid']);
export const paperStatusEnum = pgEnum('paper_status', ['review', 'accepted', 'rejected']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'organizer', 'visitor']);
export const pendaftaranStatusEnum = pgEnum('pendaftaran_status', ['terdaftar', 'menunggu_verifikasi', 'lunas', 'dibatalkan', 'hadir']);
export const jenisKelaminEnum = pgEnum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
export const tipePembayaranEnum = pgEnum('tipe_pembayaran', ['bank_transfer', 'qris']);
export const logScrapingStatusEnum = pgEnum('log_scraping_status', ['pending', 'processing', 'success', 'failed']);

// 1. USERS
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  namaLengkap: varchar('nama_lengkap', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  nomorTelepon: varchar('nomor_telepon', { length: 20 }),
  institusi: varchar('institusi', { length: 255 }),
  pekerjaan: varchar('pekerjaan', { length: 255 }),
  password: varchar('password', { length: 255 }),
  emailTerverifikasi: timestamp('email_terverifikasi'),
  tanggalLahir: timestamp('tanggal_lahir'),
  jenisKelamin: jenisKelaminEnum('jenis_kelamin'),
  role: userRoleEnum('role').default('visitor'),
  disetujui: boolean('disetujui').default(false),
  diblokir: boolean('diblokir').default(false),
  terakhirAktifPada: timestamp('terakhir_aktif_pada'),
  urlAvatar: varchar('url_avatar', { length: 512 }).default("/uploads/avatars/fotodummy.jpg"),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
  dihapusPada: timestamp('dihapus_pada'),
});

// 2. OTP CODES
export const otpCodes = pgTable('otp_codes', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  kedaluwarsaPada: timestamp('kedaluwarsa_pada').notNull(),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

// 3. PROFIL PENYELENGGARA
export const profilPenyelenggara = pgTable('profil_penyelenggara', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  namaInstansi: varchar('nama_instansi', { length: 255 }),
  deskripsiInstansi: text('deskripsi_instansi'),
  urlDokumenLegalitas: varchar('url_dokumen_legalitas', { length: 512 }),
  urlWebsite: varchar('url_website', { length: 255 }),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
});

// 4. PROVINSI
export const provinsi = pgTable('provinsi', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }).unique(),
});

// 5. KOTA
export const kota = pgTable('kota', {
  id: serial('id').primaryKey(),
  provinsiId: integer('provinsi_id').references(() => provinsi.id),
  nama: varchar('nama', { length: 100 }),
}, (t) => ({
  unq: uniqueIndex('kota_provinsi_idx').on(t.provinsiId, t.nama),
}));

// 6. KATEGORI
export const kategori = pgTable('kategori', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }),
  slug: varchar('slug', { length: 100 }).unique(),
  urlIkon: varchar('url_ikon', { length: 512 }),
});

// 7. TAG
export const tag = pgTable('tag', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }).unique(),
});

// 8. EVENT TAG
export const eventTag = pgTable('event_tag', {
  eventId: integer('event_id').notNull().references(() => event.id),
  tagId: integer('tag_id').notNull().references(() => tag.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.eventId, t.tagId] }),
}));

// 9. EVENT
export const event = pgTable('event', {
  id: serial('id').primaryKey(),
  organizerId: integer('organizer_id').references(() => users.id),
  kategoriId: integer('kategori_id').references(() => kategori.id),
  kotaId: integer('kota_id').references(() => kota.id),
  judul: varchar('judul', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique(),
  deskripsi: text('deskripsi'),
  syaratDanKetentuan: text('syarat_dan_ketentuan'),
  urlBanner: varchar('url_banner', { length: 512 }),
  penyelenggara: varchar('penyelenggara', { length: 255 }),
  tanggalMulai: timestamp('tanggal_mulai').notNull(),
  tanggalSelesai: timestamp('tanggal_selesai'),
  batasRegistrasi: timestamp('batas_registrasi'),
  eventPolines: boolean('event_polines').default(false),
  jenisEvent: jenisEventEnum('jenis_event'),
  tipePlatform: tipePlatformEnum('tipe_platform'),
  tipeHarga: tipeHargaEnum('tipe_harga'),
  harga: integer('harga').default(0),
  detailLokasi: text('detail_lokasi'),
  linkEksternal: varchar('link_eksternal', { length: 512 }),
  namaKontak: varchar('nama_kontak', { length: 255 }),
  emailKontak: varchar('email_kontak', { length: 255 }),
  teleponKontak: varchar('telepon_kontak', { length: 20 }),
  kuota: integer('kuota'),
  maksTiketPerTransaksi: integer('maks_tiket_per_transaksi'),
  satuAkunSatuTransaksi: boolean('satu_akun_satu_transaksi').default(false),
  status: eventStatusEnum('status').default('pending'),
  hasilScraping: boolean('hasil_scraping').default(false),
  websiteSumber: varchar('website_sumber', { length: 255 }),
  jumlahTayangan: integer('jumlah_tayangan').default(0),
  alasanPenolakan: text('alasan_penolakan'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
  dihapusPada: timestamp('dihapus_pada'),
}, (table) => ({
  organizerIdx: index('organizer_idx').on(table.organizerId),
  kategoriIdx: index('kategori_idx').on(table.kategoriId),
  statusIdx: index('status_idx').on(table.status),
}));

// 10. INFO PEMBAYARAN (global)
export const infoPembayaran = pgTable('info_pembayaran', {
  id: serial('id').primaryKey(),
  tipe: tipePembayaranEnum('tipe').notNull(),
  namaBank: varchar('nama_bank', { length: 100 }),
  nomorRekening: varchar('nomor_rekening', { length: 50 }),
  pemilikRekening: varchar('pemilik_rekening', { length: 255 }),
  urlGambarQris: varchar('url_gambar_qris', { length: 512 }),
  aktif: boolean('aktif').default(true),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
});

// 11. PEMBICARA
export const pembicara = pgTable('pembicara', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => event.id),
  nama: varchar('nama', { length: 255 }).notNull(),
  peran: varchar('peran', { length: 100 }),
  urlFoto: varchar('url_foto', { length: 512 }),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
});

// 12. LAMPIRAN EVENT
export const lampiranEvent = pgTable('lampiran_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  urlFile: varchar('url_file', { length: 512 }),
  tipeFile: varchar('tipe_file', { length: 50 }),
  urutan: integer('urutan').default(0),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

// 13. LOG ADMIN
export const logAdmin = pgTable('log_admin', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => users.id),
  eventId: integer('event_id').references(() => event.id),
  aksi: varchar('aksi', { length: 100 }),
  dataSebelumnya: jsonb('data_sebelumnya'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

// 14. FAVORIT
export const favorit = pgTable('favorit', {
  userId: integer('user_id').notNull().references(() => users.id),
  eventId: integer('event_id').notNull().references(() => event.id),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
}, (t) => [
  primaryKey({ columns: [t.userId, t.eventId] })
]);

// 15. PENDAFTARAN (mencakup registrasi + pembayaran)
export const pendaftaran = pgTable('pendaftaran', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  userId: integer('user_id').references(() => users.id),
  kodePendaftaran: varchar('kode_pendaftaran', { length: 50 }).unique(),
  status: pendaftaranStatusEnum('status').default('terdaftar'),
  metodePembayaranId: integer('metode_pembayaran_id').references(() => infoPembayaran.id),
  buktiPembayaran: text('bukti_pembayaran'),
  totalHarga: integer('total_harga').default(0),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
  dihapusPada: timestamp('dihapus_pada'),
});

// 16. PESERTA
export const peserta = pgTable('peserta', {
  id: serial('id').primaryKey(),
  pendaftaranId: integer('pendaftaran_id').references(() => pendaftaran.id),
  userId: integer('user_id').references(() => users.id),
  kodePeserta: varchar('kode_peserta', { length: 50 }).unique(),
  namaLengkap: varchar('nama_lengkap', { length: 255 }),
  email: varchar('email', { length: 255 }),
  nomorTelepon: varchar('nomor_telepon', { length: 20 }),
  jenisKelamin: jenisKelaminEnum('jenis_kelamin'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
});

// 17. PAPER SUBMISSION
export const paperSubmission = pgTable('paper_submission', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  judul: varchar('judul', { length: 255 }).notNull(),
  kataKunci: varchar('kata_kunci', { length: 255 }),
  track: varchar('track', { length: 255 }),
  urlFile: varchar('url_file', { length: 512 }).notNull(),
  status: paperStatusEnum('status').default('review'),
  komentarPenolakan: text('komentar_penolakan'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
});

// 18. PENULIS PAPER
export const penulisPaper = pgTable('penulis_paper', {
  id: serial('id').primaryKey(),
  paperSubmissionId: integer('paper_submission_id').notNull().references(() => paperSubmission.id),
  nama: varchar('nama', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  institusi: varchar('institusi', { length: 255 }),
  urutan: integer('urutan').default(0),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

// 19. JADWAL EVENT
export const jadwalEvent = pgTable('jadwal_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  waktuMulai: timestamp('waktu_mulai'),
  waktuSelesai: timestamp('waktu_selesai'),
  deskripsi: text('deskripsi'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

// 20. RAW SCRAPED DATA
export const rawScrapedData = pgTable('raw_scraped_data', {
  id: serial('id').primaryKey(),
  sumber: varchar('sumber', { length: 255 }).notNull(),
  urlTarget: varchar('url_target', { length: 512 }),
  data: jsonb('data').notNull(),
  statusIntegrasi: boolean('status_integrasi').default(false),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

// 21. LOG SCRAPING
export const logScraping = pgTable('log_scraping', {
  id: serial('id').primaryKey(),
  targetUrl: varchar('target_url', { length: 512 }),
  sumber: varchar('sumber', { length: 255 }),
  status: logScrapingStatusEnum('status').default('pending'),
  jumlahData: integer('jumlah_data').default(0),
  errorMessage: text('error_message'),
  mulaiPada: timestamp('mulai_pada').defaultNow(),
  selesaiPada: timestamp('selesai_pada'),
});

// ── RELATIONS ─────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  profilPenyelenggara: one(profilPenyelenggara, {
    fields: [users.id],
    references: [profilPenyelenggara.userId],
  }),
  event: many(event),
  logAdmin: many(logAdmin),
  pendaftaran: many(pendaftaran),
  paperSubmission: many(paperSubmission),
  favorit: many(favorit),
  peserta: many(peserta),
}));

export const profilPenyelenggaraRelations = relations(profilPenyelenggara, ({ one }) => ({
  user: one(users, {
    fields: [profilPenyelenggara.userId],
    references: [users.id],
  }),
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
  organizer: one(users, {
    fields: [event.organizerId],
    references: [users.id],
  }),
  kategori: one(kategori, {
    fields: [event.kategoriId],
    references: [kategori.id],
  }),
  kota: one(kota, {
    fields: [event.kotaId],
    references: [kota.id],
  }),
  tag: many(eventTag),
  pembicara: many(pembicara),
  lampiran: many(lampiranEvent),
  logAdmin: many(logAdmin),
  pendaftaran: many(pendaftaran),
  jadwal: many(jadwalEvent),
  paperSubmission: many(paperSubmission),
  favorit: many(favorit),
}));

export const pembicaraRelations = relations(pembicara, ({ one }) => ({
  event: one(event, {
    fields: [pembicara.eventId],
    references: [event.id],
  }),
}));

export const lampiranEventRelations = relations(lampiranEvent, ({ one }) => ({
  event: one(event, {
    fields: [lampiranEvent.eventId],
    references: [event.id],
  }),
}));

export const logAdminRelations = relations(logAdmin, ({ one }) => ({
  admin: one(users, {
    fields: [logAdmin.adminId],
    references: [users.id],
  }),
  event: one(event, {
    fields: [logAdmin.eventId],
    references: [event.id],
  }),
}));

export const favoritRelations = relations(favorit, ({ one }) => ({
  user: one(users, {
    fields: [favorit.userId],
    references: [users.id],
  }),
  event: one(event, {
    fields: [favorit.eventId],
    references: [event.id],
  }),
}));

export const infoPembayaranRelations = relations(infoPembayaran, ({ many }) => ({
  pendaftaran: many(pendaftaran),
}));

export const pendaftaranRelations = relations(pendaftaran, ({ one, many }) => ({
  event: one(event, {
    fields: [pendaftaran.eventId],
    references: [event.id],
  }),
  user: one(users, {
    fields: [pendaftaran.userId],
    references: [users.id],
  }),
  metodePembayaran: one(infoPembayaran, {
    fields: [pendaftaran.metodePembayaranId],
    references: [infoPembayaran.id],
  }),
  peserta: many(peserta),
}));

export const pesertaRelations = relations(peserta, ({ one }) => ({
  pendaftaran: one(pendaftaran, {
    fields: [peserta.pendaftaranId],
    references: [pendaftaran.id],
  }),
  user: one(users, {
    fields: [peserta.userId],
    references: [users.id],
  }),
}));

export const paperSubmissionRelations = relations(paperSubmission, ({ one, many }) => ({
  event: one(event, {
    fields: [paperSubmission.eventId],
    references: [event.id],
  }),
  user: one(users, {
    fields: [paperSubmission.userId],
    references: [users.id],
  }),
  penulis: many(penulisPaper),
}));

export const penulisPaperRelations = relations(penulisPaper, ({ one }) => ({
  paperSubmission: one(paperSubmission, {
    fields: [penulisPaper.paperSubmissionId],
    references: [paperSubmission.id],
  }),
}));

export const jadwalEventRelations = relations(jadwalEvent, ({ one }) => ({
  event: one(event, {
    fields: [jadwalEvent.eventId],
    references: [event.id],
  }),
}));