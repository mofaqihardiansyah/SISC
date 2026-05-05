import React from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { EventChart } from '@/components/admin/EventChart';
import { RecentEvents } from '@/components/admin/RecentEvents';
import { 
  FileText, 
  Users, 
  Calendar 
} from 'lucide-react';
import { getDashboardStats, getRecentEvents, getMonthlyGrowth } from '@/lib/actions/dashboard';

export default async function DashboardPage() {
  const [stats, recentEvents, chartData] = await Promise.all([
    getDashboardStats(),
    getRecentEvents(),
    getMonthlyGrowth(),
  ]);

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Gambaran Umum Sistem</h1>
        <p className="text-gray-500 mt-2 font-medium">Lihat status acara dan kinerja platform secara langsung.</p>
      </section>

      {/* Stats Grid - Adjusted to 3 columns for flexibility */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Event Menunggu Persetujuan" 
          value={stats?.pendingApproval?.toString() || "0"} 
          icon={FileText} 
          color="yellow" 
        />
        <StatCard 
          label="Total Penyelenggara Aktif" 
          value={stats?.activeOrganizers?.toLocaleString() || "0"} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          label="Total Event Berjalan" 
          value={stats?.runningEvents?.toLocaleString() || "0"} 
          icon={Calendar} 
          color="purple" 
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
