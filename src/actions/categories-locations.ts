'use server';

import { db } from "@/db";
import { kategori, tag, provinsi, kota } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

const checkAdminAuth = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    throw new Error("Unauthorized");
  }
};

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  return fallback;
};

// ================= KATEGORI ACTIONS =================

export async function addKategoriAction(nama: string) {
  try {
    await checkAdminAuth();
    const slug = slugify(nama);
    await db.insert(kategori).values({
      nama,
      slug,
    });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error adding kategori:", error);
    return { success: false, error: getErrorMessage(error, "Gagal menambah kategori") };
  }
}

export async function editKategoriAction(id: number, nama: string) {
  try {
    await checkAdminAuth();
    const slug = slugify(nama);
    await db.update(kategori)
      .set({ nama, slug })
      .where(eq(kategori.id, id));
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error editing kategori:", error);
    return { success: false, error: getErrorMessage(error, "Gagal mengubah kategori") };
  }
}

export async function deleteKategoriAction(id: number) {
  try {
    await checkAdminAuth();
    await db.delete(kategori).where(eq(kategori.id, id));
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting kategori:", error);
    return { success: false, error: getErrorMessage(error, "Gagal menghapus kategori") };
  }
}

// ================= TAG ACTIONS =================

export async function addTagAction(nama: string) {
  try {
    await checkAdminAuth();
    await db.insert(tag).values({ nama });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error adding tag:", error);
    return { success: false, error: getErrorMessage(error, "Gagal menambah tag") };
  }
}

export async function editTagAction(id: number, nama: string) {
  try {
    await checkAdminAuth();
    await db.update(tag)
      .set({ nama })
      .where(eq(tag.id, id));
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error editing tag:", error);
    return { success: false, error: getErrorMessage(error, "Gagal mengubah tag") };
  }
}

export async function deleteTagAction(id: number) {
  try {
    await checkAdminAuth();
    await db.delete(tag).where(eq(tag.id, id));
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error: getErrorMessage(error, "Gagal menghapus tag") };
  }
}

// ================= PROVINSI ACTIONS =================

export async function addProvinsiAction(nama: string) {
  try {
    await checkAdminAuth();
    await db.insert(provinsi).values({ nama });
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    console.error("Error adding provinsi:", error);
    return { success: false, error: getErrorMessage(error, "Gagal menambah provinsi") };
  }
}

export async function editProvinsiAction(id: number, nama: string) {
  try {
    await checkAdminAuth();
    await db.update(provinsi)
      .set({ nama })
      .where(eq(provinsi.id, id));
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    console.error("Error editing provinsi:", error);
    return { success: false, error: getErrorMessage(error, "Gagal mengubah provinsi") };
  }
}

export async function deleteProvinsiAction(id: number) {
  try {
    await checkAdminAuth();
    await db.delete(provinsi).where(eq(provinsi.id, id));
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    console.error("Error deleting provinsi:", error);
    return { success: false, error: getErrorMessage(error, "Gagal menghapus provinsi. Pastikan tidak ada kota yang terhubung.") };
  }
}

// ================= KOTA ACTIONS =================

export async function addKotaAction(provinsiId: number, nama: string) {
  try {
    await checkAdminAuth();
    await db.insert(kota).values({ provinsiId, nama });
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    console.error("Error adding kota:", error);
    return { success: false, error: getErrorMessage(error, "Gagal menambah kota") };
  }
}

export async function editKotaAction(id: number, provinsiId: number, nama: string) {
  try {
    await checkAdminAuth();
    await db.update(kota)
      .set({ provinsiId, nama })
      .where(eq(kota.id, id));
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    console.error("Error editing kota:", error);
    return { success: false, error: getErrorMessage(error, "Gagal mengubah kota") };
  }
}

export async function deleteKotaAction(id: number) {
  try {
    await checkAdminAuth();
    await db.delete(kota).where(eq(kota.id, id));
    revalidatePath("/admin/locations");
    return { success: true };
  } catch (error) {
    console.error("Error deleting kota:", error);
    return { success: false, error: getErrorMessage(error, "Gagal menghapus kota") };
  }
}
