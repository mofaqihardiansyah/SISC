import { event } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Event = InferSelectModel<typeof event> & {
  kotaNama?: string | null;
  kategoriNama?: string | null;
};
