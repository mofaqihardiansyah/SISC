import { db } from '@/db';
import { favorit } from '@/db/schema'; // 👈 1. Diubah dari bookmark menjadi favorit
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ bookmarked: false });

  const { searchParams } = new URL(req.url);
  const eventId = Number(searchParams.get('eventId'));

  // 👈 2. Query disesuaikan menggunakan tabel favorit dan camelCase (userId -> userId, eventId -> eventId)
  const existing = await db
    .select()
    .from(favorit)
    .where(and(eq(favorit.userId, Number(session.user.id)), eq(favorit.eventId, eventId)))
    .limit(1);

  return NextResponse.json({ bookmarked: existing.length > 0 });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { eventId } = await req.json();
  const userId = Number(session.user.id);

  // 👈 3. Pengecekan status menggunakan tabel favorit
  const existing = await db
    .select()
    .from(favorit)
    .where(and(eq(favorit.userId, userId), eq(favorit.eventId, eventId)))
    .limit(1);

  if (existing.length > 0) {
    // Jika sudah ada di favorit, lakukan hapus (un-favorit)
    await db
      .delete(favorit)
      .where(and(eq(favorit.userId, userId), eq(favorit.eventId, eventId)));
    return NextResponse.json({ bookmarked: false });
  } else {
    // Jika belum ada, masukkan data baru ke tabel favorit
    await db.insert(favorit).values({ userId, eventId });
    return NextResponse.json({ bookmarked: true });
  }
}