import { auth } from "@/auth";
import DashboardUserMenu from "./DashboardUserMenu";
import BuatEventButton from "./BuatEventButton";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function Header() {
  const session = await auth();
  
  let dbUser = null;
  if (session?.user?.id) {
    dbUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, Number(session.user.id)),
    });
  }

  const user = dbUser ? {
    name: dbUser.namaLengkap || session?.user?.name || "Penyelenggara",
    email: dbUser.email || session?.user?.email,
    image: dbUser.avatarUrl || session?.user?.image,
    role: session?.user?.role,
  } : session?.user;
  
  let isApproved = false;
  if (user?.id) {
    const userId = parseInt(user.id, 10);
    if (!isNaN(userId)) {
      const [dbUser] = await db
        .select({ isApproved: users.isApproved })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);
      isApproved = dbUser?.isApproved || false;
    }
  }

  return (
    <header className="h-20 bg-white border-b border-gray-100 pl-16 pr-4 md:px-8 flex items-center justify-between sticky top-0 z-20 transition-all">
      <div className="truncate pr-4">
        <h1 className="text-xl font-bold font-heading text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <BuatEventButton />

        {user && <DashboardUserMenu user={user} />}
      </div>
    </header>
  );
}