// src/auth.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8), role: z.string().optional() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const userList = await db.select().from(users).where(eq(users.email, email)).limit(1);
          const user = userList[0];

          if (!user || !user.password) {
            if (process.env.NODE_ENV !== 'production') console.log(`[AUTH] Login ditolak: User tidak ditemukan (${email})`);
            return null;
          }

          if (user.diblokir) {
            if (process.env.NODE_ENV !== 'production') console.log(`[AUTH] Login ditolak: Akun ditangguhkan (${email})`);
            throw new Error("BLOCKED");
          }

          if (!user.emailTerverifikasi && user.role !== 'admin') {
            if (process.env.NODE_ENV !== 'production') console.log(`[AUTH] Login ditolak: Email belum diverifikasi (${email})`);
            throw new Error("UNVERIFIED");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            if (process.env.NODE_ENV !== 'production') console.log(`[AUTH] Login sukses: ${email}`);
            return { id: user.id.toString(), email: user.email ?? "", name: user.namaLengkap ?? "", role: user.role ?? undefined, image: user.urlAvatar ?? undefined };
          } else {
            if (process.env.NODE_ENV !== 'production') console.log(`[AUTH] Login ditolak: Password salah (${email})`);
          }
        } else {
          if (process.env.NODE_ENV !== 'production') console.log("[AUTH] Login ditolak: Parsing credentials gagal", parsedCredentials.error);
        }
        return null;
      },
    }),
  ],
});
