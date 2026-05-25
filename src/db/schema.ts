import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, primaryKey, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const eventStatusEnum = pgEnum('event_status', ['draft', 'pending', 'published', 'rejected']);
export const jenisEventEnum = pgEnum('jenis_event', ['seminar', 'conference']);
export const tipePlatformEnum = pgEnum('tipe_platform', ['online', 'offline', 'hybrid']);
export const tipeHargaEnum = pgEnum('tipe_harga', ['free', 'paid']);
export const paperStatusEnum = pgEnum('paper_status', ['review', 'accepted', 'rejected']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'organizer', 'visitor']);
export const pendaftaranStatusEnum = pgEnum('pendaftaran_status', ['terdaftar', 'dibatalkan', 'hadir']);
export const jenisKelaminEnum = pgEnum('jenis_kelamin', ['Laki-laki', 'Perempuan']);

// 1. USERS
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  namaLengkap: varchar('nama_lengkap', { length: 255 }),
  email: varchar('email', { length: 255 }).unique(),
  nomorTelepon: varchar('nomor_telepon', { length: 20 }),
  institution: varchar('institution', { length: 255 }),
  pekerjaan: varchar('pekerjaan', { length: 255 }),
  password: varchar('password', { length: 255 }),
  emailVerified: timestamp('email_verified'),
  tanggalLahir: timestamp('tanggal_lahir'),
  jenisKelamin: jenisKelaminEnum('jenis_kelamin'),
  role: userRoleEnum('role').default('visitor'),
  isApproved: boolean('is_approved').default(false),
  isSuspended: boolean('is_suspended').default(false),
  lastActiveAt: timestamp('last_active_at'),
  avatarUrl: varchar('avatar_url', { length: 512 }).default("/uploads/avatars/fotodummy.jpg"),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
  dihapusPada: timestamp('dihapus_pada'),
});

// 2. OTP CODES
export const otpCodes = pgTable('otp_codes', {
  id: serial('id').primaryKey(),
  email: varchar('email').notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

// 3. PROFIL PENYELENGGARA
export const profilPenyelenggara = pgTable('profil_penyelenggara', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  namaInstansi: varchar('nama_instansi', { length: 255 }),
  deskripsiInstansi: text('deskripsi_instansi'),
  dokumenLegalitasUrl: varchar('dokumen_legalitas_url', { length: 512 }),
  websiteUrl: varchar('website_url', { length: 255 }),
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
});

// 6. KATEGORI
export const kategori = pgTable('kategori', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }),
  slug: varchar('slug', { length: 100 }).unique(),
  iconUrl: varchar('icon_url', { length: 512 }),
});

// 7. TAG
export const tag = pgTable('tag', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 100 }).unique(),
});

// 8. EVENT TAG (Many-to-Many Bridge)
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
  bannerUrl: varchar('banner_url', { length: 512 }),
  penyelenggara: varchar('penyelenggara', { length: 255 }),
  tanggalMulai: timestamp('tanggal_mulai').notNull(),
  tanggalSelesai: timestamp('tanggal_selesai'),
  batasRegistrasi: timestamp('batas_registrasi'),
  isEventPolines: boolean('is_event_polines').default(false),
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
  namaPembicara: varchar('nama_pembicara', { length: 255 }),
  peranPembicara: varchar('peran_pembicara', { length: 100 }),
  fotoPembicaraUrl: varchar('foto_pembicara_url', { length: 512 }),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
  dihapusPada: timestamp('dihapus_pada'),
}, (table) => ({
  organizerIdx: index('organizer_idx').on(table.organizerId),
  kategoriIdx: index('kategori_idx').on(table.kategoriId),
  statusIdx: index('status_idx').on(table.status),
}));

// 10. LAMPIRAN EVENT
export const lampiranEvent = pgTable('lampiran_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  fileUrl: varchar('file_url', { length: 512 }),
  tipeFile: varchar('tipe_file', { length: 50 }),
});

// 11. BOOKMARK
export const bookmark = pgTable('bookmark', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  eventId: integer('event_id').references(() => event.id),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
}, (t) => ({
  unq: uniqueIndex('bookmark_user_event_idx').on(t.userId, t.eventId),
}));

// 12. LOG ADMIN
export const logAdmin = pgTable('log_admin', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => users.id),
  eventId: integer('event_id').references(() => event.id),
  aksi: varchar('aksi', { length: 100 }),
  dataSebelumnya: jsonb('data_sebelumnya'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

// 13. PENDAFTARAN
export const pendaftaran = pgTable('pendaftaran', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  userId: integer('user_id').references(() => users.id),
  kodePendaftaran: varchar('kode_pendaftaran', { length: 50 }).unique(),
  status: pendaftaranStatusEnum('status').default('terdaftar'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
  dihapusPada: timestamp('dihapus_pada'),
});

// 14. PESERTA
export const peserta = pgTable('peserta', {
  id: serial('id').primaryKey(),
  pendaftaranId: integer('pendaftaran_id').references(() => pendaftaran.id),
  kodePeserta: varchar('kode_peserta', { length: 50 }).unique(),
  namaLengkap: varchar('nama_lengkap', { length: 255 }),
  email: varchar('email', { length: 255 }),
  nomorTelepon: varchar('nomor_telepon', { length: 20 }),
  jenisKelamin: jenisKelaminEnum('jenis_kelamin'),
});

// 15. PAPER SUBMISSION
export const paperSubmission = pgTable('paper_submission', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  judul: varchar('judul', { length: 255 }).notNull(),
  penulis: text('penulis').notNull(),
  fileUrl: varchar('file_url', { length: 512 }).notNull(),
  status: paperStatusEnum('status').default('review'),
  komentarPenolakan: text('komentar_penolakan'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
});

// 16. JADWAL EVENT
export const jadwalEvent = pgTable('jadwal_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  waktuMulai: timestamp('waktu_mulai'),
  waktuSelesai: timestamp('waktu_selesai'),
  deskripsi: text('deskripsi'),
});

// RELATIONS DEFINITIONS
export const usersRelations = relations(users, ({ one, many }) => ({
  profilPenyelenggara: one(profilPenyelenggara, {
    fields: [users.id],
    references: [profilPenyelenggara.userId],
  }),
  event: many(event),
  bookmark: many(bookmark),
  logAdmin: many(logAdmin),
  pendaftaran: many(pendaftaran),
  paperSubmission: many(paperSubmission),
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
  bookmark: many(bookmark),
  tag: many(eventTag),
  lampiran: many(lampiranEvent),
  logAdmin: many(logAdmin),
  pendaftaran: many(pendaftaran),
  jadwal: many(jadwalEvent),
  paperSubmission: many(paperSubmission),
}));

export const lampiranEventRelations = relations(lampiranEvent, ({ one }) => ({
  event: one(event, {
    fields: [lampiranEvent.eventId],
    references: [event.id],
  }),
}));

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  user: one(users, {
    fields: [bookmark.userId],
    references: [users.id],
  }),
  event: one(event, {
    fields: [bookmark.eventId],
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

export const pendaftaranRelations = relations(pendaftaran, ({ one, many }) => ({
  event: one(event, {
    fields: [pendaftaran.eventId],
    references: [event.id],
  }),
  user: one(users, {
    fields: [pendaftaran.userId],
    references: [users.id],
  }),
  peserta: many(peserta),
}));

export const pesertaRelations = relations(peserta, ({ one }) => ({
  pendaftaran: one(pendaftaran, {
    fields: [peserta.pendaftaranId],
    references: [pendaftaran.id],
  }),
}));

export const paperSubmissionRelations = relations(paperSubmission, ({ one }) => ({
  event: one(event, {
    fields: [paperSubmission.eventId],
    references: [event.id],
  }),
  user: one(users, {
    fields: [paperSubmission.userId],
    references: [users.id],
  }),
}));

export const jadwalEventRelations = relations(jadwalEvent, ({ one }) => ({
  event: one(event, {
    fields: [jadwalEvent.eventId],
    references: [event.id],
  }),
}));

export const tayanganLog = pgTable('tayangan_log', {
  eventId: integer('event_id').references(() => event.id),
  tanggal: timestamp('tanggal').defaultNow().notNull(),
}, (t) => ({
  idx: index('tayangan_log_idx').on(t.eventId, t.tanggal),
}));

export const tayanganLogRelations = relations(tayanganLog, ({ one }) => ({
  event: one(event, {
    fields: [tayanganLog.eventId],
    references: [event.id],
  }),
}));