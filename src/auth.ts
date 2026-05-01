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
          .object({ email: z.string().email(), password: z.string().min(6), role: z.string().optional() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, role } = parsedCredentials.data;
          const user = await db.query.users.findFirst({
            where: eq(users.email, email)
          });

          if (!user || !user.password) return null;

          // Periksa role jika dikirim dari client (contoh: tab Visitor/Organizer/Admin)
          if (role && user.role !== role) {
            console.log(`[AUTH] Login ditolak: Role tidak cocok. Meminta: ${role}, Aktual: ${user.role}`);
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return { id: user.id.toString(), email: user.email ?? "", name: user.namaLengkap ?? "" };
        }
        return null;
      },
    }),
  ],
});
