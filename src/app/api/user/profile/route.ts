import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';

// GET USER
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');
    let userId: number;

    if (!userIdParam) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
      }
      userId = Number(session.user.id);
    } else {
      userId = Number(userIdParam);
    }

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });

    if (!user) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// UPDATE USER
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');
    let userId: number;

    if (!userIdParam) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
      }
      userId = Number(session.user.id);
    } else {
      userId = Number(userIdParam);
    }

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }

    const body = await req.json();

    await db
      .update(users)
      .set({
        namaLengkap: body.name ?? '',
        email: body.email ?? '',
        nomorTelepon: body.phone ?? '',
        institution: body.institution ?? '',
        diperbaruiPada: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: 'Berhasil update' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal update' }, { status: 500 });
  }
}

// DELETE USER (SOFT DELETE)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');
    let userId: number;

    if (!userIdParam) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
      }
      userId = Number(session.user.id);
    } else {
      userId = Number(userIdParam);
    }

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }

    await db
      .update(users)
      .set({
        dihapusPada: new Date(),
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: 'Akun berhasil dihapus' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal menghapus akun' }, { status: 500 });
  }
}