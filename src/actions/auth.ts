"use server";

import { db } from "@/db";
import { users, profilPenyelenggara, otpCodes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dns from "dns";
import { AUTH, SITE } from "@/lib/constants";

// Paksa Node.js menggunakan Google DNS & Cloudflare DNS untuk memintas DNS ISP lokal yang bermasalah/timeout
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Gagal menyetel DNS resolver kustom:", e);
}

import crypto from "crypto";

// Helper to generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Helper to send email using Nodemailer
async function sendOTPEmail(email: string, code: string) {
  console.log(`[DEV] Sending OTP ${code} to ${email}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("EMAIL_USER or EMAIL_PASS is not set in environment variables. Email will not be sent.");
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${AUTH.EMAIL_SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Kode Verifikasi (OTP) ${SITE.NAME}`,
      text: `Kode verifikasi Anda adalah: ${code}. Kode ini akan kedaluwarsa dalam 10 menit.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #03428B; text-align: center;">${SITE.NAME}</h2>
          <p style="font-size: 16px; color: #333;">Halo,</p>
          <p style="font-size: 16px; color: #333;">Berikut adalah kode verifikasi Anda:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #03428B;">${code}</span>
          </div>
          <p style="font-size: 14px; color: #666;">Kode ini akan kedaluwarsa dalam 10 menit. Jangan bagikan kode ini kepada siapa pun.</p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">Terima kasih,<br>Tim ${SITE.NAME}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

interface RegisterValues {
  email: string;
  password?: string;
  namaLengkap?: string;
  nomorTelepon?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  institution?: string;
  pekerjaan?: string;
  namaInstansi?: string;
  deskripsiInstansi?: string;
  dokumenLegalitasUrl?: string;
}

export async function registerUser(values: RegisterValues, role: 'visitor' | 'organizer') {
  // 1. Check if user already exists
  const existingUsers = await db.select().from(users).where(eq(users.email, values.email)).limit(1);
  const existingUser = existingUsers[0];

  if (existingUser) {
    return { error: "Email sudah terdaftar." };
  }

  // 2. Hash password
  if (!values.password) {
    return { error: "Kata sandi wajib diisi." };
  }
  const hashedPassword = await bcrypt.hash(values.password, 10);

  try {
    // 3. Create user
    const [newUser] = await db.insert(users).values({
      namaLengkap: values.namaLengkap || values.namaInstansi,
      email: values.email,
      nomorTelepon: values.nomorTelepon,
      tanggalLahir: values.tanggalLahir ? new Date(values.tanggalLahir) : null,
      jenisKelamin: values.jenisKelamin as 'Laki-laki' | 'Perempuan',
      institution: values.institution || values.namaInstansi, // Use namaInstansi as fallback for organizer
      pekerjaan: values.pekerjaan,
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

    // 6. Send OTP (Background)
    sendOTPEmail(values.email, otp);

    return { success: true };
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return { error: "Terjadi kesalahan saat mendaftar. Silakan coba lagi." };
  }
}

const otpRateLimit = new Map<string, { attempts: number; lockUntil: number }>();

export async function verifyOtpAction(email: string, code: string) {
  const rateLimit = otpRateLimit.get(email) || { attempts: 0, lockUntil: 0 };
  
  if (Date.now() < rateLimit.lockUntil) {
    return { error: "Terlalu banyak percobaan gagal. Silakan coba lagi nanti." };
  }

  const otpRecords = await db.select().from(otpCodes).where(and(
    eq(otpCodes.email, email),
    eq(otpCodes.code, code)
  )).limit(1);
  const otpRecord = otpRecords[0];

  if (!otpRecord) {
    rateLimit.attempts += 1;
    if (rateLimit.attempts >= 3) {
      rateLimit.lockUntil = Date.now() + 10 * 60 * 1000; // Lock for 10 minutes
    }
    otpRateLimit.set(email, rateLimit);
    return { error: "Kode OTP salah." };
  }

  // Jika berhasil, reset rate limit
  otpRateLimit.delete(email);

  if (otpRecord.expiresAt < new Date()) {
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

  // Send OTP (Background)
  sendOTPEmail(email, otp);

  return { success: true };
}

export async function requestPasswordReset(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    // Return success anyway to prevent email enumeration
    return { success: true };
  }

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

  // Send OTP (Background)
  sendOTPEmail(email, otp);

  return { success: true };
}

export async function verifyResetOtpAction(email: string, code: string) {
  const rateLimit = otpRateLimit.get(email) || { attempts: 0, lockUntil: 0 };
  
  if (Date.now() < rateLimit.lockUntil) {
    return { error: "Terlalu banyak percobaan gagal. Silakan coba lagi nanti." };
  }

  const otpRecord = await db.query.otpCodes.findFirst({
    where: and(
      eq(otpCodes.email, email),
      eq(otpCodes.code, code)
    ),
  });

  if (!otpRecord) {
    rateLimit.attempts += 1;
    if (rateLimit.attempts >= 3) {
      rateLimit.lockUntil = Date.now() + 10 * 60 * 1000;
    }
    otpRateLimit.set(email, rateLimit);
    return { error: "Kode OTP salah." };
  }

  // Jangan reset rate limit di sini karena kita masih butuh otp valid untuk final step
  if (otpRecord.expiresAt < new Date()) {
    return { error: "Kode OTP sudah kedaluwarsa." };
  }

  // Do not delete OTP here, because we still need it for the final resetPassword step!
  return { success: true };
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const rateLimit = otpRateLimit.get(email) || { attempts: 0, lockUntil: 0 };
  
  if (Date.now() < rateLimit.lockUntil) {
    return { error: "Terlalu banyak percobaan gagal. Silakan coba lagi nanti." };
  }

  const otpRecord = await db.query.otpCodes.findFirst({
    where: and(
      eq(otpCodes.email, email),
      eq(otpCodes.code, code)
    ),
  });

  if (!otpRecord) {
    rateLimit.attempts += 1;
    if (rateLimit.attempts >= 3) {
      rateLimit.lockUntil = Date.now() + 10 * 60 * 1000;
    }
    otpRateLimit.set(email, rateLimit);
    return { error: "Kode OTP salah." };
  }

  // Jika berhasil, reset rate limit
  otpRateLimit.delete(email);

  if (otpRecord.expiresAt < new Date()) {
    return { error: "Kode OTP sudah kedaluwarsa." };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update user password
  await db.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.email, email));

  // Delete OTP code
  await db.delete(otpCodes).where(eq(otpCodes.id, otpRecord.id));

  return { success: true };
}
