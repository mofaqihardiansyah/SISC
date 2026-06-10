// Status validasi penyelenggara
// - pending  : belum ada keputusan admin (default saat daftar)
// - approved : admin menyetujui akses
// - rejected : admin menolak akses
export type StatusValidasi = "approved" | "pending" | "rejected";

export interface PenyelenggaraItem {
  id: string;       // ID tampilan, misal "00001"
  rawId: number;    // ID asli dari database (untuk update)
  namaOrganisasi: string;
  email: string;
  noTelepon: string;
  status: StatusValidasi;
  namaLengkap: string;
  deskripsiInstansi: string | null;
  urlDokumenLegalitas: string | null;
  urlWebsite: string | null;
  dibuatPada: string | null;
}