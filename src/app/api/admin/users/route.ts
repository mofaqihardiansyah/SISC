import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, isNull, ilike, or, sql, and, ne, inArray } from 'drizzle-orm';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // ── Stats ──────────────────────────────────────────────────────
    if (searchParams.get('type') === 'stats') {
      const baseWhere = and(isNull(users.dihapusPada), ne(users.role, 'admin'));
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [totalResult, suspendedResult, pendingResult, activeResult] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(users).where(baseWhere),
        db.select({ count: sql<number>`count(*)` }).from(users).where(and(baseWhere, eq(users.isSuspended, true))),
        db.select({ count: sql<number>`count(*)` }).from(users).where(and(baseWhere, eq(users.isApproved, false), eq(users.role, 'organizer'))),
        db.select({ count: sql<number>`count(*)` }).from(users).where(and(baseWhere, sql`${users.lastActiveAt} >= ${thirtyDaysAgo}`)),
      ]);

      return NextResponse.json({
        total: Number(totalResult[0]?.count ?? 0),
        suspended: Number(suspendedResult[0]?.count ?? 0),
        pending: Number(pendingResult[0]?.count ?? 0),
        active: Number(activeResult[0]?.count ?? 0),
      });
    }

    // ── Detail user by id ──────────────────────────────────────────
    const userId = searchParams.get('userId');
    if (userId) {
      const user = await db
        .select({
          id: users.id,
          namaLengkap: users.namaLengkap,
          email: users.email,
          role: users.role,
          isSuspended: users.isSuspended,
          isApproved: users.isApproved,
          avatarUrl: users.avatarUrl,
          nomorTelepon: users.nomorTelepon,
          institution: users.institution,
          pekerjaan: users.pekerjaan,
          jenisKelamin: users.jenisKelamin,
          tanggalLahir: users.tanggalLahir,
          dibuatPada: users.dibuatPada,
          lastActiveAt: users.lastActiveAt,
        })
        .from(users)
        .where(eq(users.id, Number(userId)))
        .limit(1);

      if (!user[0]) return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
      return NextResponse.json(user[0]);
    }

    // ── List users ─────────────────────────────────────────────────
    const search = searchParams.get('search') ?? '';
    const role = searchParams.get('role') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? '1'));
    const sortBy = searchParams.get('sortBy') ?? 'dibuatPada';
    const sortDir = searchParams.get('sortDir') ?? 'desc';
    const limit = 5;
    const offset = (page - 1) * limit;

    const conditions = [isNull(users.dihapusPada), ne(users.role, 'admin')];

    if (search.trim()) {
      conditions.push(or(ilike(users.namaLengkap, `%${search}%`), ilike(users.email, `%${search}%`))!);
    }
    if (role && role !== 'Semua Tipe') {
      conditions.push(eq(users.role, role as 'organizer' | 'visitor'));
    }

    const whereClause = and(...conditions);

    // Sort column mapping
    const sortColumn =
      sortBy === 'namaLengkap' ? users.namaLengkap :
      sortBy === 'role' ? users.role :
      users.dibuatPada;

    const orderClause = sortDir === 'asc' ? sql`${sortColumn} asc nulls last` : sql`${sortColumn} desc nulls last`;

    const [allUsers, countResult] = await Promise.all([
      db.select({
        id: users.id,
        namaLengkap: users.namaLengkap,
        email: users.email,
        role: users.role,
        isSuspended: users.isSuspended,
        isApproved: users.isApproved,
        dibuatPada: users.dibuatPada,
        avatarUrl: users.avatarUrl,
      }).from(users).where(whereClause).orderBy(orderClause).limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(users).where(whereClause),
    ]);

    return NextResponse.json({
      users: allUsers,
      total: Number(countResult[0]?.count ?? 0),
      page,
      totalPages: Math.ceil(Number(countResult[0]?.count ?? 0) / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Bulk delete
    const ids = searchParams.get('ids');
    if (ids) {
      const idList = ids.split(',').map(Number).filter((n) => !isNaN(n) && n > 0);
      if (idList.length === 0) return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
      await db.update(users).set({ dihapusPada: new Date() }).where(inArray(users.id, idList));
      return NextResponse.json({ message: `${idList.length} pengguna berhasil dihapus` });
    }

    // Single delete
    const userId = Number(searchParams.get('userId'));
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }
    await db.update(users).set({ dihapusPada: new Date() }).where(eq(users.id, userId));
    return NextResponse.json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus pengguna' }, { status: 500 });
  }
}