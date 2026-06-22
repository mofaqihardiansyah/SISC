'use client';

import React from 'react';
import ExportPageClient from '@/components/shared/ExportPageClient';
import { getOrganizerExportData } from '@/actions/export-data';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function OrganizerExportSection() {
  const fetchData = () => getOrganizerExportData();

  const exportPdf = async (raw: unknown) => {
    const data = raw as Awaited<ReturnType<typeof getOrganizerExportData>>;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Laporan Data Penyelenggara', 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 14, 28);

    doc.setFontSize(12);
    doc.text('Daftar Event', 14, 38);
    autoTable(doc, {
      startY: 42,
      head: [['ID', 'Judul', 'Status', 'Tipe', 'Tanggal Mulai']],
      body: data.myEvents.map((e: { id: number; judul: string | null; status: string | null; jenisEvent: string | null; tanggalMulai: Date | null }) => [
        String(e.id), e.judul || '-', e.status || '-', e.jenisEvent || '-',
        e.tanggalMulai ? new Date(e.tanggalMulai).toLocaleDateString('id-ID') : '-',
      ]),
      theme: 'striped',
    });

    const regY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Pendaftaran', 14, regY);
    autoTable(doc, {
      startY: regY + 4,
      head: [['ID', 'Event', 'Status', 'Total Harga']],
      body: data.myPendaftaran.map((p: { p: { id: number; status: string | null; totalHarga: number | null }; e: { judul: string | null } }) => [
        String(p.p.id), p.e.judul || '-', p.p.status || '-',
        p.p.totalHarga ? `Rp ${p.p.totalHarga.toLocaleString('id-ID')}` : '0',
      ]),
      theme: 'striped',
    });

    const paperY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    if (data.myPapers.length > 0) {
      doc.setFontSize(12);
      doc.text('Paper Submission', 14, paperY);
      autoTable(doc, {
        startY: paperY + 4,
        head: [['ID', 'Judul Paper', 'Status']],
        body: data.myPapers.map((p: { paper_submission: { id: number; judul: string; status: string | null } }) => [
          String(p.paper_submission.id), p.paper_submission.judul,
          p.paper_submission.status || '-',
        ]),
        theme: 'striped',
      });
    }

    doc.save(`Rekap_Data_Penyelenggara_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportExcel = async (raw: unknown) => {
    const data = raw as Awaited<ReturnType<typeof getOrganizerExportData>>;
    const wb = XLSX.utils.book_new();

    const eventsSheet = XLSX.utils.json_to_sheet(data.myEvents.map((e: { id: number; judul: string | null; status: string | null; jenisEvent: string | null; tipePlatform: string | null; tipeHarga: string | null; harga: number | null; tanggalMulai: Date | null }) => ({
      ID: e.id, Judul: e.judul || '', Status: e.status || '',
      'Jenis Event': e.jenisEvent || '', Platform: e.tipePlatform || '',
      'Tipe Harga': e.tipeHarga || '', Harga: e.harga ?? 0,
      'Tanggal Mulai': e.tanggalMulai ? new Date(e.tanggalMulai).toISOString() : '',
    })));
    XLSX.utils.book_append_sheet(wb, eventsSheet, 'Events');

    const pesertaSheet = XLSX.utils.json_to_sheet(data.myPeserta.map((p: { p: { id: number; namaLengkap: string | null; email: string | null; nomorTelepon: string | null }; e: { judul: string | null } }) => ({
      ID: p.p.id, Nama: p.p.namaLengkap || '', Email: p.p.email || '',
      Telepon: p.p.nomorTelepon || '', Event: p.e.judul || '',
    })));
    XLSX.utils.book_append_sheet(wb, pesertaSheet, 'Peserta');

    XLSX.writeFile(wb, `Rekap_Data_Penyelenggara_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-900 mb-4">Export Data</h2>
      <ExportPageClient role="organizer" fetchData={fetchData} exportPdf={exportPdf} exportExcel={exportExcel} />
    </section>
  );
}
