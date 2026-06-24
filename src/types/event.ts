import { event } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Event = InferSelectModel<typeof event> & {
  kotaNama?: string | null;
  kategoriNama?: string | null;
};

export type EventCardItem = {
  id: number;
  judul: string;
  urlBanner: string | null;
  harga: number | null;
  tipeHarga: string | null;
  tipePlatform: string | null;
  jenisEvent: string | null;
  eventPolines: boolean | null;
  tanggalMulai: Date | null;
  penyelenggara: string | null;
  kategoriNama: string | null;
  kotaNama: string | null;
};

export type EventsApiResponse = {
  events: EventCardItem[];
  total: number;
};
