import 'dotenv/config';
import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seedUsers() {
  console.log("🚀 Memulai proses seeding user...");
  
  const userData = [
    {
      namaLengkap: "Super Admin SISC",
      email: "poliventsofficial@gmail.com",
      password: "adminpassword123",
      role: 'admin'
    },
    {
      namaLengkap: "Penyelenggara Demo",
      email: "organizer@gmail.com",
      password: "organizerpassword123",
      role: 'organizer'
    },
    {
      namaLengkap: "Pengunjung Demo",
      email: "visitor@gmail.com",
      password: "visitorpassword123",
      role: 'visitor'
    }
  ];

  for (const user of userData) {
    console.log(`📦 Seeding role ${user.role}: ${user.email}...`);
    
    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    const hashedPassword = await bcrypt.hash(user.password, 10);

    if (existingUser) {
      console.log(`  Updating existing user: ${user.email}`);
      await db.update(users)
        .set({ 
          namaLengkap: user.namaLengkap,
          password: hashedPassword,
          role: user.role,
          emailVerified: new Date(),
        })
        .where(eq(users.email, user.email));
    } else {
      console.log(`  Creating new user: ${user.email}`);
      await db.insert(users).values({
        namaLengkap: user.namaLengkap,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        emailVerified: new Date(),
      });
    }
  }

  console.log("\n-----------------------------------");
  console.log("✅ User Seeding Success!");
  console.log("-----------------------------------\n");
  
  process.exit(0);
}

seedUsers().catch(err => {
  console.error("❌ Error seeding users:", err);
  process.exit(1);
});
