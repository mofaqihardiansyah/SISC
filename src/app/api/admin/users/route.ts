import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, isNull, ilike, or, sql, and, ne } from 'drizzle-orm';
import { auth } from '@/auth';

// GET ALL USERS (admin only) + stats via ?type=stats
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // ── Stats endpoint ──────────────────────────────────────────────
    if (searchParams.get('type') === 'stats') {
      const baseWhere = and(isNull(users.dihapusPada), ne(users.role, 'admin'));

      const [totalResult, suspendedResult, pendingResult] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users).where(baseWhere),
        db.select({ count: sql<number>`count(*)` }).from(users).where(
          and(baseWhere, eq(users.isSuspended, true))
        ),
        db.select({ count: sql<number>`count(*)` }).from(users).where(
          and(baseWhere, eq(users.isApproved, false), eq(users.role, 'organizer'))
        ),
      ]);

      // "Aktif" = lastActiveAt dalam 30 hari terakhir
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(and(baseWhere, sql`${users.lastActiveAt} >= ${thirtyDaysAgo}`));

      return NextResponse.json({
        total: Number(totalResult[0]?.count ?? 0),
        suspended: Number(suspendedResult[0]?.count ?? 0),
        pending: Number(pendingResult[0]?.count ?? 0),
        active: Number(activeResult[0]?.count ?? 0),
      });
    }

    // ── List users ──────────────────────────────────────────────────
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const limit = 5;
    const offset = (page - 1) * limit;

    // Exclude admin selalu
    const conditions = [
      isNull(users.dihapusPada),
      ne(users.role, 'admin'),
    ];

    if (search.trim()) {
      conditions.push(
        or(
          ilike(users.namaLengkap, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )!
      );
    }

    if (role && role !== 'Semua Tipe') {
      conditions.push(eq(users.role, role as 'organizer' | 'visitor'));
    }

    const whereClause = and(...conditions);

    const [allUsers, countResult] = await Promise.all([
      db
        .select({
          id: users.id,
          namaLengkap: users.namaLengkap,
          email: users.email,
          role: users.role,
          isSuspended: users.isSuspended,
          isApproved: users.isApproved,
          dibuatPada: users.dibuatPada,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(whereClause)
        .orderBy(users.dibuatPada)
        .limit(limit)
        .offset(offset),

      db.select({ count: sql<number>`count(*)` }).from(users).where(whereClause),
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