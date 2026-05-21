import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, isNull, ilike, or, sql } from 'drizzle-orm';
import { auth } from '@/auth';

// GET ALL USERS (admin only)
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = 5;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [isNull(users.dihapusPada)];

    if (search.trim()) {
      conditions.push(
        or(
          ilike(users.namaLengkap, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )!
      );
    }

    if (role && role !== 'Semua Tipe') {
      conditions.push(eq(users.role, role as 'admin' | 'organizer' | 'visitor'));
    }

    const whereClause = conditions.length === 1 ? conditions[0] : sql`${conditions.reduce((a, b) => sql`${a} AND ${b}`)}`;

    const [allUsers, countResult] = await Promise.all([
      db
        .select({
          id: users.id,
          namaLengkap: users.namaLengkap,
          email: users.email,
          role: users.role,
          dibuatPada: users.dibuatPada,
          avatarUrl: users.avatarUrl,
          nomorTelepon: users.nomorTelepon,
          institution: users.institution,
        })
        .from(users)
        .where(whereClause)
        .orderBy(users.dibuatPada)
        .limit(limit)
        .offset(offset),

      db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(whereClause),
    ]);

    const total = Number(countResult[0]?.count ?? 0);

    return NextResponse.json({
      users: allUsers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// DELETE USER (SOFT DELETE) by admin
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId'));

    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }

    await db
      .update(users)
      .set({ dihapusPada: new Date() })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}