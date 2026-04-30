"use server";

import { db } from "@/db";
import { users, profilPenyelenggara, otpCodes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Helper to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to send email (mock for now)
async function sendOTPEmail(email: string, code: string) {
  console.log(`Sending OTP ${code} to ${email}`);
  // In real implementation, use Resend or Nodemailer here
}

export async function registerUser(values: any, role: 'visitor' | 'organizer') {
  // 1. Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, values.email),
  });

  if (existingUser) {
    return { error: "Email sudah terdaftar." };
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(values.password, 10);

  try {
    // 3. Create user
    const [newUser] = await db.insert(users).values({
      namaLengkap: values.namaLengkap,
      email: values.email,
      nomorTelepon: values.nomorTelepon,
      password: hashedPassword,
      role: role,
    }).returning();

    // 4. If organizer, create profile
    if (role === 'organizer') {
      await db.insert(profilPenyelenggara).values({
        userId: newUser.id,
        namaInstansi: values.namaInstansi,
        deskripsiInstansi: values.deskripsiInstansi,
        dokumenLegalitasUrl: values.dokumenLegalitasUrl || "",
      });
    }

    // 5. Generate and save OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.insert(otpCodes).values({
      email: values.email,
      code: otp,
      expiresAt: expiresAt,
    });

    // 6. Send OTP
    await sendOTPEmail(values.email, otp);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat mendaftar." };
  }
}

export async function verifyOtpAction(email: string, code: string) {
  const otpRecord = await db.query.otpCodes.findFirst({
    where: and(
      eq(otpCodes.email, email),
      eq(otpCodes.code, code)
    ),
  });

  if (!otpRecord) {
    return { error: "Kode OTP salah." };
  }

  if (otpRecord.expiresAt < new Date()) {
    return { error: "Kode OTP sudah kedaluwarsa." };
  }

  // Update user verification status
  await db.update(users)
    .set({ emailVerified: new Date() })
    .where(eq(users.email, email));

  // Delete OTP code
  await db.delete(otpCodes).where(eq(otpCodes.id, otpRecord.id));

  return { success: true };
}

export async function resendOtpAction(email: string) {
  // Delete old OTPs for this email
  await db.delete(otpCodes).where(eq(otpCodes.email, email));

  // Generate and save new OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.insert(otpCodes).values({
    email: email,
    code: otp,
    expiresAt: expiresAt,
  });

  // Send OTP
  await sendOTPEmail(email, otp);

  return { success: true };
}
