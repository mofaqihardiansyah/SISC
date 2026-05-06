"use server";

import { db } from "@/db"; 
import { event } from "@/db/schema";

export async function getEvents() {
  return await db.select().from(event);
}