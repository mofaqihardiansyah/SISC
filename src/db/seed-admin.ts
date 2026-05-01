import 'dotenv/config';
import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seedAdmin() {
  console.log("Seeding Admin User...");
  
  const adminEmail = "admin@polivents.com";
  const adminPassword = "adminpassword123";
  
  // Check if admin already exists
  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.email, adminEmail),
  });

  if (existingAdmin) {
    console.log("Admin user already exists. Updating password...");
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await db.update(users)
      .set({ 
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      })
      .where(eq(users.email, adminEmail));
  } else {
    console.log("Creating new admin user...");
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await db.insert(users).values({
      namaLengkap: "Super Admin SISC",
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    });
  }

  console.log("\n-----------------------------------");
  console.log("Admin Seeding Success!");
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  console.log("-----------------------------------\n");
  
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error("Error seeding admin:", err);
  process.exit(1);
});
