import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/auth';
import bcrypt from 'bcryptjs';

// GET — ambil data admin yang sedang login
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const admin = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
      columns: {
        id: true,
        namaLengkap: true,
        email: true,
        urlAvatar: true,
      },
    });

    if (!admin) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// PATCH — update nama & email admin
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { namaLengkap, email, urlAvatar } = await req.json();

    if (!namaLengkap || !email) {
      return NextResponse.json({ error: 'Nama dan email wajib diisi' }, { status: 400 });
    }

    await db
      .update(users)
      .set({ namaLengkap, email, urlAvatar, diperbaruiPada: new Date() })
      .where(eq(users.email, session.user.email));

    return NextResponse.json({ message: 'Profil berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal memperbarui profil' }, { status: 500 });
  }
}

// PUT — ganti password admin
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const { passLama, passBaru, passKonfirm } = await req.json();

    if (!passLama || !passBaru || !passKonfirm) {
      return NextResponse.json({ error: 'Semua field kata sandi wajib diisi' }, { status: 400 });
    }

    if (passBaru !== passKonfirm) {
      return NextResponse.json({ error: 'Konfirmasi kata sandi tidak cocok' }, { status: 400 });
    }

    if (passBaru.length < 8) {
      return NextResponse.json({ error: 'Kata sandi baru minimal 8 karakter' }, { status: 400 });
    }

    const admin = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!admin?.password) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const valid = await bcrypt.compare(passLama, admin.password);
    if (!valid) {
      return NextResponse.json({ error: 'Kata sandi lama salah' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(passBaru, 10);
    await db
      .update(users)
      .set({ password: hashed, diperbaruiPada: new Date() })
      .where(eq(users.email, session.user.email));

    return NextResponse.json({ message: 'Kata sandi berhasil diperbarui' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Gagal memperbarui kata sandi' }, { status: 500 });
  }
}
