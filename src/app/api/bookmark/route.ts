import { db } from '@/db';
import { bookmark } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ bookmarked: false });

  const { searchParams } = new URL(req.url);
  const eventId = Number(searchParams.get('eventId'));

  const existing = await db
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.userId, Number(session.user.id)), eq(bookmark.eventId, eventId)))
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

  const existing = await db
    .select()
    .from(bookmark)
    .where(and(eq(bookmark.userId, userId), eq(bookmark.eventId, eventId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(bookmark)
      .where(and(eq(bookmark.userId, userId), eq(bookmark.eventId, eventId)));
    return NextResponse.json({ bookmarked: false });
  } else {
    await db.insert(bookmark).values({ userId, eventId });
    return NextResponse.json({ bookmarked: true });
  }
}