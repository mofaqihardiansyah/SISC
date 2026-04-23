import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  namaLengkap: varchar('nama_lengkap'),
  email: varchar('email').unique(),
  password: varchar('password'),
  nomorTelepon: varchar('nomor_telepon'),
  tanggalLahir: timestamp('tanggal_lahir'),
  jenisKelamin: varchar('jenis_kelamin'), // 'laki-laki', 'perempuan'
  nik: varchar('nik'), // NIK 
  role: varchar('role'), // admin, organizer, visitor
  avatarUrl: varchar('avatar_url'),
  isTerverifikasi: boolean('is_terverifikasi').default(false),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  dihapusPada: timestamp('dihapus_pada'),
});

export const profilPenyelenggara = pgTable('profil_penyelenggara', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).unique(),
  namaInstansi: varchar('nama_instansi'),
  deskripsiInstansi: text('deskripsi_instansi'),
  dokumenLegalitasUrl: varchar('dokumen_legalitas_url'),
  websiteUrl: varchar('website_url'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
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
  iconUrl: varchar('icon_url'),
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
  organizerId: integer('organizer_id').references(() => users.id), // Null jika scraping
  kategoriId: integer('kategori_id').references(() => kategori.id),
  kotaId: integer('kota_id').references(() => kota.id),
  judul: varchar('judul'),
  slug: varchar('slug').unique(),
  deskripsi: text('deskripsi'),
  syaratDanKetentuan: text('syarat_dan_ketentuan'),
  bannerUrl: varchar('banner_url'),
  tanggalMulai: timestamp('tanggal_mulai'),
  tanggalSelesai: timestamp('tanggal_selesai'),
  batasRegistrasi: timestamp('batas_registrasi'),
  
  // Event Classification
  isEventPolines: boolean('is_event_polines').default(false),
  jenisEvent: varchar('jenis_event'), // 'seminar', 'conference'
  tipePlatform: varchar('tipe_platform'), // 'online', 'offline', 'hybrid'
  tipeHarga: varchar('tipe_harga'), // 'free', 'paid'
  harga: integer('harga').default(0), // Nominal harga event jika berbayar
  detailLokasi: text('detail_lokasi'), // Alamat spesifik/Gedung
  linkEksternal: varchar('link_eksternal'), // Link pendaftaran asli
  
  // Contact Info
  namaKontak: varchar('nama_kontak'),
  emailKontak: varchar('email_kontak'),
  teleponKontak: varchar('telepon_kontak'),
  
  // Registration Settings
  kuota: integer('kuota'), // Total kuota maksimal peserta
  maksTiketPerTransaksi: integer('maks_tiket_per_transaksi'),
  satuAkunSatuTransaksi: boolean('satu_akun_satu_transaksi').default(false),
  
  status: varchar('status').default('pending'), // pending, published, rejected, unpublish_request
  hasilScraping: boolean('hasil_scraping').default(false),
  websiteSumber: varchar('website_sumber'), // Asal scraping
  jumlahTayangan: integer('jumlah_tayangan').default(0),
  alasanPenolakan: text('alasan_penolakan'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
  dihapusPada: timestamp('dihapus_pada'),
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
  fileUrl: varchar('file_url'),
  tipeFile: varchar('tipe_file'), // image, pdf
});

export const bookmark = pgTable('bookmark', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  eventId: integer('event_id').references(() => event.id),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

export const notifikasi = pgTable('notifikasi', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  judul: varchar('judul'),
  pesan: text('pesan'),
  sudahDibaca: boolean('sudah_dibaca').default(false),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

export const logAdmin = pgTable('log_admin', {
  id: serial('id').primaryKey(),
  adminId: integer('admin_id').references(() => users.id),
  eventId: integer('event_id').references(() => event.id),
  aksi: varchar('aksi'), // approved, rejected, edited
  dataSebelumnya: jsonb('data_sebelumnya'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});



export const transaksi = pgTable('transaksi', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  userId: integer('user_id').references(() => users.id),
  rekeningId: integer('rekening_id').references(() => rekeningEvent.id), // Bank/E-Wallet tujuan transfer dari peserta
  kodeBooking: varchar('kode_booking').unique(),
  totalHarga: integer('total_harga').default(0),
  metodePembayaran: varchar('metode_pembayaran'), // misal: 'transfer_bank', 'gopay', 'qris'
  buktiPembayaranUrl: varchar('bukti_pembayaran_url'),
  status: varchar('status').default('pending'), // pending, menunggu_verifikasi, confirmed, cancelled
  alasanPenolakan: text('alasan_penolakan'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
  diperbaruiPada: timestamp('diperbarui_pada'),
  dihapusPada: timestamp('dihapus_pada'),
});

export const peserta = pgTable('peserta', {
  id: serial('id').primaryKey(),
  transaksiId: integer('transaksi_id').references(() => transaksi.id),
  kodePeserta: varchar('kode_peserta').unique(), // Khusus untuk QR Code check-in per orang
  namaLengkap: varchar('nama_lengkap'),
  email: varchar('email'),
  nomorTelepon: varchar('nomor_telepon'),
  sudahCheckIn: boolean('sudah_check_in').default(false),
  waktuCheckIn: timestamp('waktu_check_in'),
});

export const rekeningEvent = pgTable('rekening_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  namaBank: varchar('nama_bank'), // ex: BCA, Mandiri, Gopay, QRIS
  nomorRekening: varchar('nomor_rekening'), // nomer/id (kosongkan jika payment berupa gambar QR khusus)
  atasNama: varchar('atas_nama'),
  qrCodeUrl: varchar('qr_code_url'), // Untuk upload gambar QR jika disediakan
});

export const komentarEvent = pgTable('komentar_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  userId: integer('user_id').references(() => users.id),
  pesan: text('pesan'),
  dibuatPada: timestamp('dibuat_pada').defaultNow(),
});

export const pembicaraEvent = pgTable('pembicara_event', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => event.id),
  nama: varchar('nama'),
  peran: varchar('peran'), // Keynote Speaker, dll
  fotoUrl: varchar('foto_url'),
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

export const usersRelations = relations(users, ({ one, many }) => ({
  profilPenyelenggara: one(profilPenyelenggara, {
    fields: [users.id],
    references: [profilPenyelenggara.userId],
  }),
  event: many(event),
  bookmark: many(bookmark),
  notifikasi: many(notifikasi),
  logAdmin: many(logAdmin),
  transaksi: many(transaksi),
  komentar: many(komentarEvent),
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
  sosialMedia: many(sosialMediaEvent),
  lampiran: many(lampiranEvent),
  logAdmin: many(logAdmin),
  transaksi: many(transaksi),
  rekening: many(rekeningEvent),
  komentar: many(komentarEvent),
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
  user: one(users, {
    fields: [bookmark.userId],
    references: [users.id],
  }),
  event: one(event, {
    fields: [bookmark.eventId],
    references: [event.id],
  }),
}));

export const notifikasiRelations = relations(notifikasi, ({ one }) => ({
  user: one(users, {
    fields: [notifikasi.userId],
    references: [users.id],
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

export const transaksiRelations = relations(transaksi, ({ one, many }) => ({
  event: one(event, {
    fields: [transaksi.eventId],
    references: [event.id],
  }),
  user: one(users, {
    fields: [transaksi.userId],
    references: [users.id],
  }),
  rekening: one(rekeningEvent, {
    fields: [transaksi.rekeningId],
    references: [rekeningEvent.id],
  }),
  peserta: many(peserta),
}));

export const pesertaRelations = relations(peserta, ({ one }) => ({
  transaksi: one(transaksi, {
    fields: [peserta.transaksiId],
    references: [transaksi.id],
  }),
}));

export const rekeningEventRelations = relations(rekeningEvent, ({ one, many }) => ({
  event: one(event, {
    fields: [rekeningEvent.eventId],
    references: [event.id],
  }),
  transaksi: many(transaksi),
}));

export const komentarEventRelations = relations(komentarEvent, ({ one }) => ({
  event: one(event, {
    fields: [komentarEvent.eventId],
    references: [event.id],
  }),
  user: one(users, {
    fields: [komentarEvent.userId],
    references: [users.id],
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