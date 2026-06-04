import { StatCard } from "@/components/penyelenggara/stat-card";
import { EventChart } from "@/components/penyelenggara/EventChart";
import { Users, Calendar, Archive, Clock, Eye, Coins, Ticket } from "lucide-react";
import { db } from "@/db";
import { event, peserta, pendaftaran, tayanganLog, users } from "@/db/schema";
import { count, eq, and, lt, gte, sql, sum } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ViewChart } from "@/components/penyelenggara/ViewChart";
import { PendapatanChart } from "@/components/penyelenggara/PendapatanChart";

export default async function PenyelenggaraDashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) redirect("/login");

  const [dbUser] = await db
    .select({ isApproved: users.isApproved })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  const isApproved = dbUser?.isApproved || false;

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
    .where(eq(event.organizerId, userId));

  const [eventPendingResult] = await db
    .select({ total: count() })
    .from(event)
    .where(and(eq(event.organizerId, userId), eq(event.status, "pending")));

  const [totalTayanganResult] = await db
    .select({ total: sum(event.jumlahTayangan) })
    .from(event)
    .where(eq(event.organizerId, userId));

  const [totalPendapatanResult] = await db
    .select({ total: sum(event.harga) })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(and(
      eq(event.organizerId, userId),
      eq(pendaftaran.status, "terdaftar")
    ));

  const today = new Date();
  const tahun = today.getFullYear();
  const bulan = today.getMonth();
  const jumlahHari = new Date(tahun, bulan + 1, 0).getDate();
  const awalBulan = new Date(tahun, bulan, 1);

  // Grafik Peserta
  const rawData = await db
    .select({
      tanggal: sql<string>`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`,
      jumlah: count(),
    })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(and(eq(event.organizerId, userId), gte(pendaftaran.dibuatPada, awalBulan)))
    .groupBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`);

  const dataMap = Object.fromEntries(rawData.map(r => [r.tanggal, r.jumlah]));

  const grafikData = Array.from({ length: jumlahHari }, (_, i) => {
    const d = new Date(tahun, bulan, i + 1);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    return { tanggal: label, jumlah: dataMap[key] ?? 0 };
  });

  // Grafik Pendapatan
  const rawPendapatan = await db
    .select({
      tanggal: sql<string>`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`,
      jumlah: sum(event.harga),
    })
    .from(pendaftaran)
    .innerJoin(event, eq(pendaftaran.eventId, event.id))
    .where(and(
      eq(event.organizerId, userId),
      eq(pendaftaran.status, "terdaftar"),
      gte(pendaftaran.dibuatPada, awalBulan)
    ))
    .groupBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${pendaftaran.dibuatPada}, 'YYYY-MM-DD')`);

  const pendapatanMap = Object.fromEntries(
    rawPendapatan.map(r => [r.tanggal, Number(r.jumlah ?? 0)])
  );

  const grafikPendapatan = Array.from({ length: jumlahHari }, (_, i) => {
    const d = new Date(tahun, bulan, i + 1);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    return { tanggal: label, jumlah: pendapatanMap[key] ?? 0 };
  });

  // Grafik Tayangan (dari tayanganLog)
  const rawTayanganData = await db
    .select({
      tanggal: sql<string>`TO_CHAR(${tayanganLog.tanggal}, 'YYYY-MM-DD')`,
      jumlah: count(),
    })
    .from(tayanganLog)
    .innerJoin(event, eq(tayanganLog.eventId, event.id))
    .where(and(
      eq(event.organizerId, userId),
      gte(tayanganLog.tanggal, awalBulan)
    ))
    .groupBy(sql`TO_CHAR(${tayanganLog.tanggal}, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${tayanganLog.tanggal}, 'YYYY-MM-DD')`);

  const tayanganMap = Object.fromEntries(
    rawTayanganData.map(r => [r.tanggal, Number(r.jumlah ?? 0)])
  );

  const grafikTayanganData = Array.from({ length: jumlahHari }, (_, i) => {
    const d = new Date(tahun, bulan, i + 1);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    return { tanggal: label, jumlah: tayanganMap[key] ?? 0 };
  });

  const recentEvents = await db.query.event.findMany({
    where: eq(event.organizerId, userId),
    orderBy: (event, { desc }) => [desc(event.dibuatPada)],
    limit: 5,
  });

  const pastEvents = await db.query.event.findMany({
    where: and(
      eq(event.organizerId, userId),
      lt(event.tanggalSelesai, new Date())
    ),
    orderBy: (event, { desc }) => [desc(event.tanggalSelesai)],
    limit: 5,
  });

  return (
    <div className="space-y-8">
      {!isApproved && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 animate-pulse">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-amber-800">Akun Menunggu Persetujuan Admin</h3>
              <p className="text-sm text-amber-700/80 mt-1 leading-relaxed">
                Akun penyelenggara Anda saat ini sedang dalam antrean verifikasi oleh tim verifikator kami. Fitur pembuatan dan pengelolaan event saat ini dinonaktifkan.
                Silakan lengkapi profil organisasi dan unggah dokumen legalitas Anda di menu <Link href="/penyelenggara/profil" className="underline hover:text-amber-900 font-bold transition-colors">Profil Akun</Link> untuk mempercepat proses persetujuan.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch">
        <StatCard title="Total Peserta" value={totalPesertaResult.total.toLocaleString()} trend="+0%" icon={Users} className="h-full" />
        <StatCard title="Event Aktif" value={`${eventAktifResult.total.toLocaleString()} Event`} trend="Real-time" icon={Calendar} className="h-full" />
        <StatCard title="Total Event" value={`${eventLaluResult.total.toLocaleString()} Event`} icon={Archive} className="h-full" />
        <StatCard title="Event Pending" value={`${eventPendingResult.total.toLocaleString()} Review`} icon={Clock} className="h-full" />
        <StatCard title="Total Tayangan" value={(totalTayanganResult.total ?? 0).toLocaleString()} icon={Eye} className="h-full" />
        <StatCard title="Total Pendapatan" value={`Rp ${Number(totalPendapatanResult?.total ?? 0).toLocaleString('id-ID')}`} icon={Coins} className="h-full" />
      </div>

      {/* GRAFIK PESERTA */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <EventChart initialData={grafikData} />
      </div>

      {/* GRAFIK PENDAPATAN + TAYANGAN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <PendapatanChart initialData={grafikPendapatan} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <ViewChart initialData={grafikTayanganData} />
        </div>
      </div>

      {/* RECENT EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900 mb-4">Event Terbaru</h3>
          <div className="space-y-3">
            {recentEvents.length > 0 ? recentEvents.map((ev) => (
              <Link key={ev.id} href={`/penyelenggara/detail-event/${ev.id}`}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden relative shrink-0">
                    {ev.bannerUrl ? (
                      <Image src={ev.bannerUrl} alt={ev.judul || ""} fill className="object-cover" />
                    ) : (
                      <Ticket className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{ev.judul}</h4>
                    <p className="text-xs text-gray-400">
                      {ev.tanggalMulai ? new Date(ev.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Tanggal belum diatur'}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${ev.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                  {ev.status}
                </span>
              </Link>
            )) : (
              <div className="text-center py-8">
                <Ticket className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Belum ada event.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base font-extrabold text-gray-900 mb-4">Event Lalu</h3>
          <div className="space-y-3">
            {pastEvents.length > 0 ? pastEvents.map((ev) => (
              <Link key={ev.id} href={`/penyelenggara/detail-event/${ev.id}`}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden relative shrink-0">
                    {ev.bannerUrl ? (
                      <Image src={ev.bannerUrl} alt={ev.judul || ""} fill className="object-cover opacity-70" />
                    ) : (
                      <Ticket className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 group-hover:text-blue-600 transition-colors line-clamp-1">{ev.judul}</h4>
                    <p className="text-xs text-gray-400">
                      {ev.tanggalSelesai ? new Date(ev.tanggalSelesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 bg-gray-100 text-gray-500">
                  Selesai
                </span>
              </Link>
            )) : (
              <div className="text-center py-8">
                <Ticket className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Belum ada event lalu.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}