import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/auth';

const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  'image/jpeg': [new Uint8Array([0xFF, 0xD8, 0xFF])],
  'image/png': [new Uint8Array([0x89, 0x50, 0x4E, 0x47])],
  'image/webp': [new Uint8Array([0x52, 0x49, 0x46, 0x46])],
  'application/pdf': [new Uint8Array([0x25, 0x50, 0x44, 0x46])],
};

function validateMagicBytes(file: ArrayBuffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return true;
  const view = new Uint8Array(file, 0, 8);
  return signatures.some(sig =>
    sig.every((byte, i) => byte === view[i])
  );
}

const UPLOAD_CONFIG = {
  avatar: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 10 * 1024 * 1024,
    folder: 'avatars',
    label: 'Foto Profil',
  },
  document: {
    allowedTypes: ['application/pdf'],
    maxSize: 20 * 1024 * 1024,
    folder: 'documents',
    label: 'Dokumen',
  },
  banner: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxSize: 20 * 1024 * 1024,
    folder: 'banners',
    label: 'Banner',
  },
  paper: {
    allowedTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
    maxSize: 50 * 1024 * 1024,
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

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Tidak terautentikasi' }, { status: 401 });
    }

    const config = UPLOAD_CONFIG[type as UploadType];

    if (!(config.allowedTypes as readonly string[]).includes(file.type)) {
      return NextResponse.json({
        error: `Tipe file tidak diizinkan untuk ${config.label}. Hanya: ${config.allowedTypes.join(', ')}`
      }, { status: 400 });
    }

    if (file.size > config.maxSize) {
      const maxMB = config.maxSize / (1024 * 1024);
      return NextResponse.json({
        error: `Ukuran file ${config.label} maksimal ${maxMB}MB`
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    if (!validateMagicBytes(bytes, file.type)) {
      return NextResponse.json({
        error: `File ${config.label} tidak valid atau rusak`
      }, { status: 400 });
    }

    const lastDotIndex = file.name.lastIndexOf('.');
    const ext = lastDotIndex !== -1 ? file.name.slice(lastDotIndex + 1).toLowerCase() : 'bin';
    const timestamp = Date.now();
    const userPrefix = session?.user?.id ? session.user.id : `reg_${Math.random().toString(36).substring(2, 10)}`;
    const fileName = `uploads/${config.folder}/${userPrefix}_${timestamp}.${ext}`;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('[UPLOAD WARNING] BLOB_READ_WRITE_TOKEN is not set. Simulating upload success.');
      return NextResponse.json({
        success: true,
        url: `https://dummy-blob-url.com/${fileName}`,
        fileName: fileName,
      });
    }

    const blob = await put(fileName, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      fileName: fileName,
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', error);
    return NextResponse.json({ error: 'Gagal mengupload file' }, { status: 500 });
  }
}
