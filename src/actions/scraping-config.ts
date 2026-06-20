'use server';

import { db } from "@/db";
import { scrapingSources, scrapingValidationRules, scrapingAutoApprovalRules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

const checkAdminAuth = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error("Unauthorized");
  }
};

export async function getScrapingSources() {
  await checkAdminAuth();
  try {
    const data = await db.select().from(scrapingSources).orderBy(scrapingSources.name);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching scraping sources:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengambil sumber scraping" };
  }
}

export async function createScrapingSource(data: {
  name: string;
  baseUrl: string;
  urlPattern?: string;
  scraperType?: 'cheerio' | 'crawlee_playwright';
  cronSchedule?: string;
  maxResultsPerRun?: number;
  rateLimitDelayMs?: number;
  maxConcurrentRequests?: number;
}) {
  await checkAdminAuth();
  try {
    const [source] = await db.insert(scrapingSources).values({
      name: data.name,
      baseUrl: data.baseUrl,
      urlPattern: data.urlPattern,
      scraperType: data.scraperType,
      cronSchedule: data.cronSchedule,
      maxResultsPerRun: data.maxResultsPerRun,
      rateLimitDelayMs: data.rateLimitDelayMs,
      maxConcurrentRequests: data.maxConcurrentRequests,
    }).returning();
    return { success: true, data: source };
  } catch (error) {
    console.error("Error creating scraping source:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal membuat sumber scraping" };
  }
}

export async function updateScrapingSource(id: number, data: {
  name?: string;
  baseUrl?: string;
  urlPattern?: string | null;
  scraperType?: 'cheerio' | 'crawlee_playwright';
  cronSchedule?: string | null;
  isActive?: boolean;
  maxResultsPerRun?: number;
  rateLimitDelayMs?: number;
  maxConcurrentRequests?: number;
}) {
  await checkAdminAuth();
  try {
    const [source] = await db.update(scrapingSources)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(scrapingSources.id, id))
      .returning();
    if (!source) return { success: false, error: "Sumber scraping tidak ditemukan" };
    return { success: true, data: source };
  } catch (error) {
    console.error("Error updating scraping source:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal memperbarui sumber scraping" };
  }
}

export async function deleteScrapingSource(id: number) {
  await checkAdminAuth();
  try {
    await db.delete(scrapingSources).where(eq(scrapingSources.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting scraping source:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal menghapus sumber scraping" };
  }
}

export async function toggleSourceActive(id: number) {
  await checkAdminAuth();
  try {
    const [source] = await db.select().from(scrapingSources).where(eq(scrapingSources.id, id));
    if (!source) return { success: false, error: "Sumber scraping tidak ditemukan" };
    const [updated] = await db.update(scrapingSources)
      .set({ isActive: !source.isActive, updatedAt: new Date() })
      .where(eq(scrapingSources.id, id))
      .returning();
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error toggling source active state:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengubah status sumber scraping" };
  }
}

export async function getValidationRules() {
  await checkAdminAuth();
  try {
    const data = await db.select().from(scrapingValidationRules).orderBy(scrapingValidationRules.fieldName);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching validation rules:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengambil aturan validasi" };
  }
}

export async function updateValidationRule(id: number, data: {
  fieldName?: string;
  isRequired?: boolean;
  minLength?: number | null;
  maxLength?: number | null;
  regexPattern?: string | null;
  confidenceThreshold?: number;
}) {
  await checkAdminAuth();
  try {
    const [rule] = await db.update(scrapingValidationRules)
      .set(data)
      .where(eq(scrapingValidationRules.id, id))
      .returning();
    if (!rule) return { success: false, error: "Aturan validasi tidak ditemukan" };
    return { success: true, data: rule };
  } catch (error) {
    console.error("Error updating validation rule:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal memperbarui aturan validasi" };
  }
}

export async function getAutoApprovalRules() {
  await checkAdminAuth();
  try {
    const data = await db.select().from(scrapingAutoApprovalRules).orderBy(scrapingAutoApprovalRules.ruleName);
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching auto-approval rules:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal mengambil aturan persetujuan otomatis" };
  }
}

export async function updateAutoApprovalRule(id: number, data: {
  ruleName?: string;
  conditionType?: string;
  thresholdValue?: number;
  autoPublish?: boolean;
  enabled?: boolean;
}) {
  await checkAdminAuth();
  try {
    const [rule] = await db.update(scrapingAutoApprovalRules)
      .set(data)
      .where(eq(scrapingAutoApprovalRules.id, id))
      .returning();
    if (!rule) return { success: false, error: "Aturan persetujuan otomatis tidak ditemukan" };
    return { success: true, data: rule };
  } catch (error) {
    console.error("Error updating auto-approval rule:", error);
    return { success: false, error: error instanceof Error ? error.message : "Gagal memperbarui aturan persetujuan otomatis" };
  }
}
