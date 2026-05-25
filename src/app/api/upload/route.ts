import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { auth } from '@/auth';

// Konfigurasi upload per tipe
const UPLOAD_CONFIG = {
  avatar: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'avatars',
    label: 'Foto Profil',
  },
  document: {
    allowedTypes: ['application/pdf'],
    maxSize: 20 * 1024 * 1024, // 20MB
    folder: 'documents',
    label: 'Dokumen',
  },
  banner: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 20 * 1024 * 1024, // 20MB
    folder: 'banners',
    label: 'Banner',
  },
  paper: {
    allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
    maxSize: 50 * 1024 * 1024, // 50MB
    folder: 'papers',
    label: 'Paper',
  },
} as const;

type UploadType = keyof typeof UPLOAD_CONFIG;

export async function POST(request: Request) {
  try {
    const session = await auth();

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    if (!type || !(type in UPLOAD_CONFIG)) {
      const validTypes = Object.keys(UPLOAD_CONFIG).join(', ');
      return NextResponse.json({ error: `Tipe upload tidak valid. Gunakan: ${validTypes}` }, { status: 400 });
    }

    // Jika tidak terautentikasi, hanya izinkan upload dokumen legalitas ('document') untuk keperluan registrasi
    if (!session?.user?.id && type !== 'document') {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const config = UPLOAD_CONFIG[type as UploadType];

    // Validasi tipe file
    if (!(config.allowedTypes as readonly string[]).includes(file.type)) {
      return NextResponse.json({ 
        error: `Tipe file tidak diizinkan untuk ${config.label}. Hanya: ${config.allowedTypes.join(', ')}` 
      }, { status: 400 });
    }

    // Validasi ukuran file
    if (file.size > config.maxSize) {
      const maxMB = config.maxSize / (1024 * 1024);
      return NextResponse.json({ 
        error: `Ukuran file ${config.label} maksimal ${maxMB}MB` 
      }, { status: 400 });
    }

    // Generate nama file unik
    const lastDotIndex = file.name.lastIndexOf('.');
    const ext = lastDotIndex !== -1 ? file.name.slice(lastDotIndex + 1).toLowerCase() : 'bin';
    const timestamp = Date.now();
    const userPrefix = session?.user?.id ? session.user.id : `reg_${Math.random().toString(36).substring(2, 10)}`;
    const fileName = `${userPrefix}_${timestamp}.${ext}`;

    // Pastikan folder tujuan ada
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', config.folder);
    await mkdir(uploadDir, { recursive: true });

    // Tulis file
    const filePath = path.join(uploadDir, fileName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // URL yang bisa diakses dari browser
    const fileUrl = `/uploads/${config.folder}/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 });
  }
}
