export type StatusValidasi = "approved" | "pending" | "rejected";

export interface PenyelenggaraItem {
  id: string;       // ID tampilan, misal "00001"
  rawId: number;    // ID asli dari database (untuk update)
  namaOrganisasi: string;
  email: string;
  noTelepon: string;
  status: StatusValidasi;
  alasanPenolakan?: string | null;
  namaLengkap: string;
  deskripsiInstansi: string | null;
  urlDokumenLegalitas: string | null;
  urlWebsite: string | null;
  dibuatPada: string | null;
}