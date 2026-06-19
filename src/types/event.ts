import { event } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Event = InferSelectModel<typeof event>;
