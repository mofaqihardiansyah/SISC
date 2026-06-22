'use client';

import React from 'react';
import ExportPageClient from '@/components/shared/ExportPageClient';
import { getAdminExportData } from '@/actions/export-data';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function AdminExportSection() {
  const fetchData = () => getAdminExportData();

  const exportPdf = async (raw: unknown) => {
    const data = raw as Awaited<ReturnType<typeof getAdminExportData>>;
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    doc.text('Laporan Rekapitulasi Data Platform', 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 28);

    doc.setFontSize(12);
    doc.text('Ringkasan Statistik', 14, 38);
    autoTable(doc, {
      startY: 42,
      head: [['Metrik', 'Jumlah']],
      body: [
        ['Total Event', String(data.stats.totalEvents)],
        ['Total Pengguna', String(data.stats.totalUsers)],
        ['Total Penyelenggara', String(data.stats.totalOrganizers)],
        ['Total Pendaftaran', String(data.stats.totalRegistrations)],
      ],
      theme: 'grid',
    });

    const statusY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Event per Status', 14, statusY);
    autoTable(doc, {
      startY: statusY + 4,
      head: [['Status', 'Jumlah']],
      body: data.eventsByStatus.map((s: { status: string | null; count: number }) => [s.status || 'unknown', String(s.count)]),
      theme: 'grid',
    });

    const roleY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Pengguna per Role', 14, roleY);
    autoTable(doc, {
      startY: roleY + 4,
      head: [['Role', 'Jumlah']],
      body: data.usersByRole.map((s: { role: string | null; count: number }) => [s.role || 'unknown', String(s.count)]),
      theme: 'grid',
    });

    const eventsY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    if (data.allEvents.length > 0) {
      doc.setFontSize(12);
      doc.text('Daftar Semua Event', 14, eventsY);
      autoTable(doc, {
        startY: eventsY + 4,
        head: [['ID', 'Judul', 'Status', 'Tipe', 'Tanggal Mulai', 'Penyelenggara']],
        body: data.allEvents.map((e: { id: number; judul: string | null; status: string | null; jenisEvent: string | null; tanggalMulai: Date | null; organizerId: number | null }) => [
          String(e.id), e.judul || '-', e.status || '-', e.jenisEvent || '-',
          e.tanggalMulai ? new Date(e.tanggalMulai).toLocaleDateString('id-ID') : '-',
          String(e.organizerId ?? '-'),
        ]),
        theme: 'striped',
      });
    }

    doc.save(`Rekap_Data_Platform_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportExcel = async (raw: unknown) => {
    const data = raw as Awaited<ReturnType<typeof getAdminExportData>>;
    const wb = XLSX.utils.book_new();

    const eventsSheet = XLSX.utils.json_to_sheet(data.allEvents.map((e: { id: number; judul: string | null; status: string | null; jenisEvent: string | null; tipePlatform: string | null; tipeHarga: string | null; harga: number | null; tanggalMulai: Date | null; deskripsi: string | null; organizerId: number | null }) => ({
      ID: e.id, Judul: e.judul || '', Status: e.status || '',
      'Jenis Event': e.jenisEvent || '', Platform: e.tipePlatform || '',
      'Tipe Harga': e.tipeHarga || '', Harga: e.harga ?? 0,
      'Tanggal Mulai': e.tanggalMulai ? new Date(e.tanggalMulai).toISOString() : '',
      Deskripsi: (e.deskripsi || '').substring(0, 200),
      'ID Penyelegara': e.organizerId ?? '',
    })));
    XLSX.utils.book_append_sheet(wb, eventsSheet, 'Events');

    const usersSheet = XLSX.utils.json_to_sheet(data.allUsers.map((u: { id: number; namaLengkap: string | null; email: string | null; role: string | null; nomorTelepon: string | null; dibuatPada: Date | null }) => ({
      ID: u.id, Nama: u.namaLengkap || '', Email: u.email || '',
      Role: u.role || '', Telepon: u.nomorTelepon || '',
      'Dibuat Pada': u.dibuatPada ? new Date(u.dibuatPada).toISOString() : '',
    })));
    XLSX.utils.book_append_sheet(wb, usersSheet, 'Users');

    const pendaftaranSheet = XLSX.utils.json_to_sheet(data.allPendaftaran.map((p: { id: number; eventId: number | null; userId: number | null; status: string | null; totalHarga: number | null; dibuatPada: Date | null }) => ({
      ID: p.id, 'ID Event': p.eventId ?? '', 'ID User': p.userId ?? '',
      Status: p.status || '', 'Total Harga': p.totalHarga ?? 0,
      'Dibuat Pada': p.dibuatPada ? new Date(p.dibuatPada).toISOString() : '',
    })));
    XLSX.utils.book_append_sheet(wb, pendaftaranSheet, 'Pendaftaran');

    const statsSheet = XLSX.utils.json_to_sheet([
      { Metrik: 'Total Event', Jumlah: data.stats.totalEvents },
      { Metrik: 'Total Pengguna', Jumlah: data.stats.totalUsers },
      { Metrik: 'Total Penyelenggara', Jumlah: data.stats.totalOrganizers },
      { Metrik: 'Total Pendaftaran', Jumlah: data.stats.totalRegistrations },
    ]);
    XLSX.utils.book_append_sheet(wb, statsSheet, 'Statistik');

    XLSX.writeFile(wb, `Rekap_Data_Platform_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Export Data</h2>
      <ExportPageClient role="admin" fetchData={fetchData} exportPdf={exportPdf} exportExcel={exportExcel} />
    </section>
  );
}
