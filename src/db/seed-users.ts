import 'dotenv/config';
import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcryptjs';

export async function seedUsers() {
  console.log("🚀 Memulai proses seeding user...");
  
  const userData = [
    // === 3 AKUN UTAMA (WAJIB) ===
    {
      namaLengkap: "Admin",
      email: "poliventsofficial@gmail.com",
      password: "adminpassword123",
      role: 'admin',
      nomorTelepon: "081234567890",
      institution: "Politeknik Negeri Semarang",
    },
    {
      namaLengkap: "Penyelenggara",
      email: "organizer@gmail.com",
      password: "organizerpassword123",
      role: 'organizer',
      nomorTelepon: "081234567891",
      institution: "Politeknik Negeri Semarang",
    },
    {
      namaLengkap: "Pengunjung",
      email: "visitor@gmail.com",
      password: "visitorpassword123",
      role: 'visitor',
      nomorTelepon: "081234567892",
      institution: "Politeknik Negeri Semarang",
    },
    // === 5 VISITOR DUMMY ===
    {
      namaLengkap: "Ahmad Rizki Pratama",
      email: "ahmad.rizki@gmail.com",
      password: "password123",
      role: 'visitor',
      nomorTelepon: "082111222333",
      institution: "Universitas Diponegoro",
      jenisKelamin: "Laki-laki",
    },
    {
      namaLengkap: "Siti Nurhaliza",
      email: "siti.nurhaliza@gmail.com",
      password: "password123",
      role: 'visitor',
      nomorTelepon: "082111222334",
      institution: "Universitas Gadjah Mada",
      jenisKelamin: "Perempuan",
    },
    {
      namaLengkap: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      password: "password123",
      role: 'visitor',
      nomorTelepon: "082111222335",
      institution: "Institut Teknologi Bandung",
      jenisKelamin: "Laki-laki",
    },
    {
      namaLengkap: "Dewi Anggraini",
      email: "dewi.anggraini@gmail.com",
      password: "password123",
      role: 'visitor',
      nomorTelepon: "082111222336",
      institution: "Universitas Indonesia",
      jenisKelamin: "Perempuan",
    },
    {
      namaLengkap: "Fajar Setiawan",
      email: "fajar.setiawan@gmail.com",
      password: "password123",
      role: 'visitor',
      nomorTelepon: "082111222337",
      institution: "Universitas Brawijaya",
      jenisKelamin: "Laki-laki",
    },
  ];

  for (const user of userData) {
    console.log(`📦 Seeding role ${user.role}: ${user.email}...`);
    
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await db.insert(users).values({
      namaLengkap: user.namaLengkap,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      nomorTelepon: user.nomorTelepon,
      institution: user.institution,
      jenisKelamin: (user as { jenisKelamin?: string }).jenisKelamin,
      isTerverifikasi: true,
      emailVerified: new Date(),
      avatarUrl: "/uploads/avatars/fotodummy.jpg",
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        namaLengkap: user.namaLengkap,
        password: hashedPassword,
        role: user.role,
        nomorTelepon: user.nomorTelepon,
        institution: user.institution,
        isTerverifikasi: true,
        emailVerified: new Date(),
        avatarUrl: "/uploads/avatars/fotodummy.jpg",
      }
    });
  }

  console.log("✅ Berhasil seed users!");
}

