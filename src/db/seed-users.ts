import 'dotenv/config';
import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function seedUsers() {
  console.log("🚀 Memulai proses seeding user...");
  
  const userData = [
    {
      namaLengkap: "Admin",
      email: "poliventsofficial@gmail.com",
      password: "adminpassword123",
      role: 'admin'
    },
    {
      namaLengkap: "Penyelenggara",
      email: "organizer@gmail.com",
      password: "organizerpassword123",
      role: 'organizer'
    },
    {
      namaLengkap: "Pengunjung",
      email: "visitor@gmail.com",
      password: "visitorpassword123",
      role: 'visitor'
    }
  ];

  for (const user of userData) {
    console.log(`📦 Seeding role ${user.role}: ${user.email}...`);
    
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await db.insert(users).values({
      namaLengkap: user.namaLengkap,
      email: user.email,
      password: hashedPassword,
      role: user.role,
      isTerverifikasi: true,
    }).onConflictDoUpdate({
      target: users.email,
      set: {
        namaLengkap: user.namaLengkap,
        password: hashedPassword,
        role: user.role
      }
    });
  }

  console.log("✅ Berhasil seed users!");
  process.exit(0);
}

seedUsers().catch((err) => {
  console.error("❌ Error seeding users:", err);
  process.exit(1);
});
