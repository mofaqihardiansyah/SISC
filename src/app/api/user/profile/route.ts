import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

// GET USER
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');
    let userId = Number(session.user.id);

    if (userIdParam && userIdParam !== session.user.id) {
      if (session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
      }
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

// UPDATE USER ATAU PASSWORD
export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');
    let userId = Number(session.user.id);

    if (userIdParam && userIdParam !== session.user.id) {
      if (session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
      }
      userId = Number(userIdParam);
    }

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'User ID tidak valid' }, { status: 400 });
    }

    const body = await req.json();

    // Jika ada passLama atau passBaru, ini berarti ganti password
    if (body.passLama !== undefined || body.passBaru !== undefined) {
      if (!body.passLama || !body.passBaru) {
        return NextResponse.json({ error: 'Kata sandi lama dan baru harus diisi' }, { status: 400 });
      }
      if (body.passBaru.length < 8) {
        return NextResponse.json({ error: 'Kata sandi baru minimal 8 karakter' }, { status: 400 });
      }

      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, userId),
      });

      if (!user) {
        return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
      }

      if (!user.password) {
        return NextResponse.json({ error: 'Akun ini terdaftar via login sosial (misal: Google) dan tidak memiliki kata sandi.' }, { status: 400 });
      }

      const valid = await bcrypt.compare(body.passLama, user.password);
      if (!valid) {
        return NextResponse.json({ error: 'Kata sandi lama salah' }, { status: 400 });
      }

      const hashed = await bcrypt.hash(body.passBaru, 10);
      await db
        .update(users)
        .set({
          password: hashed,
          diperbaruiPada: new Date(),
        })
        .where(eq(users.id, userId));

      return NextResponse.json({ message: 'Kata sandi berhasil diperbarui' });
    }

    // Jika tidak ada parameter password, berarti update profil biasa
    const updateData: Record<string, unknown> = { diperbaruiPada: new Date() };
    if (body.name !== undefined) updateData.namaLengkap = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.phone !== undefined) updateData.nomorTelepon = body.phone;
    if (body.institusi !== undefined) updateData.institusi = body.institusi;
    if (body.urlAvatar !== undefined) updateData.urlAvatar = body.urlAvatar;

    if (Object.keys(updateData).length > 1) {
      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId));
    }

    return NextResponse.json({ message: 'Berhasil update' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal update' }, { status: 500 });
  }
}

// DELETE USER (SOFT DELETE)
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get('userId');
    let userId = Number(session.user.id);

    if (userIdParam && userIdParam !== session.user.id) {
      if (session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
      }
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