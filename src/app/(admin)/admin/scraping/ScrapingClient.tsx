'use client';

import React, { useState } from 'react';
import { publishRawEvent, bulkPublishRawEvents, bulkDeleteRawEvents, cleanRawDataAction, bulkCleanRawData, getLogScraping } from "@/actions/admin-scraping";
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ScrapingManagementProps {
  initialData: any[];
  initialLogs: any[];
}

export default function ScrapingManagement({ initialData, initialLogs }: ScrapingManagementProps) {
  const [data, setData] = useState(initialData);
  const [logs, setLogs] = useState(initialLogs);
  const [isScraping, setIsScraping] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [previewItem, setPreviewItem] = useState<any | null>(null);

  const allSelected = data.length > 0 && selected.size === data.length;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(data.map(d => d.id)));
  };

  const toggleOne = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const triggerScrape = async () => {
    setIsScraping(true);
    try {
      const res = await fetch('/api/cron/scrape', {
        headers: { 'Authorization': 'Bearer dev-secret' }
      });
      if (res.ok) toast.success("Scraping selesai!");
      else toast.error("Gagal: " + res.statusText);
    } finally {
      setIsScraping(false);
    }
  };

  const handlePublish = async (id: number) => {
    const res = await publishRawEvent(id);
    if (res.success) {
      toast.success("Event dipublikasikan!");
      setData(data.filter(d => d.id !== id));
    } else {
      toast.error(res.error || "Gagal");
    }
  };

  const handleBulkPublish = async () => {
    const ids = [...selected];
    if (!ids.length) return toast.error("Pilih data terlebih dahulu");
    const res = await bulkPublishRawEvents(ids);
    if (res.success) {
      toast.success(`${res.count} event dipublikasikan!`);
      setData(data.filter(d => !selected.has(d.id)));
      setSelected(new Set());
    }
  };

  const handleBulkDelete = async () => {
    const ids = [...selected];
    if (!ids.length) return toast.error("Pilih data terlebih dahulu");
    const res = await bulkDeleteRawEvents(ids);
    if (res.success) {
      toast.success(`${res.count} data dihapus!`);
      setData(data.filter(d => !selected.has(d.id)));
      setSelected(new Set());
    }
  };

  const handleClean = async (id: number) => {
    const res = await cleanRawDataAction(id);
    if (res.success) {
      toast.success("Data dibersihkan!");
      setData(data.map(d => d.id === id ? { ...d, data: res.cleaned, status: 'processed' } : d));
    } else {
      toast.error(res.error || "Gagal membersihkan data");
    }
  };

  const handleBulkClean = async () => {
    const ids = [...selected];
    if (!ids.length) return toast.error("Pilih data terlebih dahulu");
    const res = await bulkCleanRawData(ids);
    toast.success(`${res.count} data dibersihkan!`);
    setSelected(new Set());
  };

  const refreshLogs = async () => {
    const fresh = await getLogScraping();
    setLogs(fresh);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manajemen Data Scraping</h1>
        <Button onClick={triggerScrape} loading={isScraping}>Mulai Scraping Baru</Button>
      </div>

      <Tabs defaultValue="data" className="w-full">
        <TabsList>
          <TabsTrigger value="data">Data Scraping ({data.length})</TabsTrigger>
          <TabsTrigger value="logs" onClick={refreshLogs}>Log Scraping ({logs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="pt-4">
          {selected.size > 0 && (
            <div className="flex gap-2 mb-3 items-center">
              <span className="text-sm text-muted-foreground">{selected.size} dipilih</span>
              <Button size="sm" variant="default" onClick={handleBulkPublish}>Terbitkan</Button>
              <Button size="sm" variant="success" onClick={handleBulkClean}>Bersihkan</Button>
              <Button size="sm" variant="destructive" onClick={handleBulkDelete}>Hapus</Button>
            </div>
          )}

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                </th>
                <th className="p-2 border">Judul</th>
                <th className="p-2 border">Sumber</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-2 border">
                    <input type="checkbox" checked={selected.has(item.id)} onChange={() => toggleOne(item.id)} />
                  </td>
                  <td className="p-2 border">
                    <button className="text-left hover:underline" onClick={() => setPreviewItem(item)}>
                      {item.data.judul}
                    </button>
                  </td>
                  <td className="p-2 border text-sm text-muted-foreground">{item.sumber}</td>
                  <td className="p-2 border">
                    <Badge variant={item.status === 'processed' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-2 border">
                    <div className="flex gap-1">
                      <Button size="xs" variant="outline" onClick={() => setPreviewItem(item)}>Lihat</Button>
                      <Button size="xs" variant="outline" onClick={() => handleClean(item.id)}>Bersihkan</Button>
                      <Button size="xs" variant="default" onClick={() => handlePublish(item.id)}>Terbitkan</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Belum ada data scraping</td></tr>
              )}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="logs" className="pt-4">
          <div className="flex justify-end mb-2">
            <Button size="sm" variant="outline" onClick={refreshLogs}>Refresh</Button>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Waktu</th>
                <th className="p-2 border">Target URL</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Jumlah</th>
                <th className="p-2 border">Error</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="border-b">
                  <td className="p-2 border text-sm">{new Date(log.mulaiPada).toLocaleString('id-ID')}</td>
                  <td className="p-2 border text-sm max-w-[200px] truncate">{log.targetUrl}</td>
                  <td className="p-2 border">
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>{log.status}</Badge>
                  </td>
                  <td className="p-2 border text-sm">{log.jumlahData}</td>
                  <td className="p-2 border text-sm text-red-600 max-w-[200px] truncate">{log.errorMessage || '-'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={5} className="p-4 text-center text-muted-foreground">Belum ada log scraping</td></tr>
              )}
            </tbody>
          </table>
        </TabsContent>
      </Tabs>

      <Modal open={!!previewItem} onClose={() => setPreviewItem(null)} title="Preview Data Scraping" className="max-w-2xl">
        {previewItem && (
          <div className="space-y-3 text-sm">
            <div><strong>Judul:</strong> {previewItem.data.judul}</div>
            <div><strong>Sumber:</strong> {previewItem.sumber}</div>
            <div><strong>URL Target:</strong> <a href={previewItem.urlTarget} target="_blank" className="text-blue-600 underline">{previewItem.urlTarget}</a></div>
            <div><strong>Link Eksternal:</strong> <a href={previewItem.data.linkEksternal} target="_blank" className="text-blue-600 underline">{previewItem.data.linkEksternal}</a></div>
            <div><strong>Banner:</strong> {previewItem.data.urlBanner && <img src={previewItem.data.urlBanner} alt="" className="max-h-40 rounded" />}</div>
            <div><strong>Lokasi:</strong> {previewItem.data.detailLokasi || '-'}</div>
            <div><strong>Tanggal (mentah):</strong> {previewItem.data.tanggalMentah || '-'}</div>
            <div><strong>Status:</strong> <Badge>{previewItem.status}</Badge></div>
            {previewItem.data.tanggalMulai && <div><strong>Tanggal Mulai (clean):</strong> {new Date(previewItem.data.tanggalMulai).toLocaleDateString('id-ID')}</div>}
            {previewItem.data.jenisEvent && <div><strong>Jenis Event:</strong> {previewItem.data.jenisEvent}</div>}
            {previewItem.data.tipePlatform && <div><strong>Platform:</strong> {previewItem.data.tipePlatform}</div>}
            <div className="flex gap-2 pt-3">
              <Button size="sm" onClick={() => { handlePublish(previewItem.id); setPreviewItem(null); }}>Terbitkan</Button>
              <Button size="sm" variant="outline" onClick={() => { handleClean(previewItem.id); }}>Bersihkan</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
