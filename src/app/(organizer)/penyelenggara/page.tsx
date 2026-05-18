import { StatCard } from "@/components/penyelenggara/stat-card";
import { EventChart } from "@/components/penyelenggara/EventChart"; // ← tambah
import { Users, Ticket, CalendarCheck } from "lucide-react";        // ← hapus TrendingUp
import { db } from "@/db";
import { event, peserta, pendaftaran } from "@/db/schema";
import { count, eq, and, lt, gte, sql } from "drizzle-orm";         // ← tambah gte, sql
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function PenyelenggaraDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) redirect("/login");

  const [totalPesertaResult] = await db
    .select({ total: count() })
    .from(peserta)
    .innerJoin(pendaftaran, eq(peserta.pendaftaranId, pendaftaran.id))
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(eq(event.organizerId, userId));

  const [eventAktifResult] = await db
    .select({ total: count() })
    .from(event)
    .where(and(eq(event.organizerId, userId), eq(event.status, "published")));

  const [eventLaluResult] = await db
    .select({ total: count() })
    .from(event)
    .where(and(eq(event.organizerId, userId), lt(event.tanggalSelesai, new Date())));

  // ← query grafik baru
  const awalBulanIni = new Date();
  awalBulanIni.setDate(1);
  awalBulanIni.setHours(0, 0, 0, 0);

  const grafikData = await db
    .select({
      tanggal: sql<string>`TO_CHAR(${pendaftaran.dibuatPada}, 'DD Mon')`,
      jumlah: count(),
    })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(and(eq(event.organizerId, userId), gte(pendaftaran.dibuatPada, awalBulanIni)))
    .groupBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'DD Mon')`)
    .orderBy(sql`MIN(${pendaftaran.dibuatPada})`);

  const recentEvents = await db.query.event.findMany({
    where: eq(event.organizerId, userId),
    orderBy: (event, { desc }) => [desc(event.dibuatPada)],
    limit: 5,
  });

  return (
    <div className="space-y-8">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Peserta" 
          value={totalPesertaResult.total.toLocaleString()} 
          trend="+0%" 
          icon={Users} 
        />
        <StatCard 
          title="Event Aktif" 
          value={eventAktifResult.total.toLocaleString()} 
          trend="Real-time" 
          icon={Ticket} 
        />
        <StatCard 
          title="Total Event Lalu" 
          value={eventLaluResult.total.toLocaleString()} 
          icon={CalendarCheck} 
        />
      </div>

      {/* CHART AREA */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-heading">Grafik Peserta Bulan Ini</h3>
            <p className="text-sm text-gray-400 font-medium">Data pendaftaran real-time</p>
          </div>
          <select className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-bold outline-none">
            <option>Bulan Ini</option>
            <option>Bulan Lalu</option>
            <option>Tahun Ini</option>
          </select>
        </div>

        {/* CHART — ganti placeholder lama dengan ini */}
        <div className="h-[300px] w-full">
          {grafikData.length > 0 ? (
            <EventChart data={grafikData} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <p className="font-bold">Belum ada data pendaftaran bulan ini</p>
            </div>
          )}
        </div>
      </div>

      {/* RECENT EVENTS SECTION */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 font-heading mb-6">Event Terbaru Anda</h3>
        <div className="space-y-4">
          {recentEvents.length > 0 ? recentEvents.map((ev) => (
  <Link key={ev.id} href={`/penyelenggara/detail-event/${ev.id}`} className="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden relative">
        {ev.bannerUrl ? (
          <Image src={ev.bannerUrl} alt={ev.judul || ""} fill className="object-cover" />
        ) : (
          <Ticket className="w-6 h-6" />
        )}
      </div>
      <div>
        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{ev.judul}</h4>
        <p className="text-xs text-gray-400 font-medium">
          {ev.tanggalMulai ? new Date(ev.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal belum diatur'}
        </p>
      </div>
    </div>
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${ev.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
      {ev.status}
    </span>
  </Link>
)) : (
            <div className="text-center py-12">
              <Ticket className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">Belum ada event yang dibuat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}