import React from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { EventChart } from '@/components/admin/EventChart';
import { RecentEvents } from '@/components/admin/RecentEvents';
import { 
  FileText, 
  Users, 
  Calendar,
  Ticket,
  UserCheck
} from 'lucide-react';
import { getDashboardStats, getRecentEvents, getMonthlyGrowth } from '@/lib/actions/dashboard';

export default async function DashboardPage() {
  const [stats, recentEvents, chartData] = await Promise.all([
    getDashboardStats(),
    getRecentEvents(),
    getMonthlyGrowth(),
  ]);

  return (
    <div className="pt-10 space-y-10 pb-10">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Gambaran Umum Sistem</h1>
        <p className="text-gray-500 mt-2 font-medium">Lihat status acara dan kinerja platform secara langsung.</p>
      </section>

      {/* Stats Grid - Adjusted to 5 columns for more detailed overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          label="Event Menunggu Persetujuan" 
          value={stats?.pendingApproval?.toString() || "0"} 
          icon={FileText} 
          color="yellow" 
        />
        <StatCard 
          label="Total Penyelenggara" 
          value={stats?.activeOrganizers?.toLocaleString() || "0"} 
          icon={UserCheck} 
          color="blue" 
        />
        <StatCard 
          label="Total Event" 
          value={stats?.runningEvents?.toLocaleString() || "0"} 
          icon={Calendar} 
          color="purple" 
        />
        <StatCard 
          label="Total Pengguna" 
          value={stats?.totalUsers?.toLocaleString() || "0"} 
          icon={Users} 
          color="green" 
        />
        <StatCard 
          label="Tiket Terjual" 
          value={stats?.ticketsSold?.toLocaleString() || "0"} 
          icon={Ticket} 
          color="red" 
        />
      </section>

      {/* Main Content Area: Chart & List */}
      <section className="flex flex-col lg:flex-row gap-8 items-start">
        <EventChart data={chartData || []} />
        <RecentEvents events={recentEvents || []} />
      </section>
    </div>
  );
}
