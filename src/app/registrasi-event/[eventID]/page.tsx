import React from 'react';
import { db } from "@/db";
import { event } from "@/db/schema";
import { eq } from "drizzle-orm";
import FormRegistrasi from './FormRegistrasi';

// Next.js 15 mewajibkan params di-await karena bersifat asynchronous
export default async function RegistrasiEventPage({ 
  params 
}: { 
  params: Promise<{ eventID: string }> 
}) {
  
  // 1. Await params untuk mengambil eventID dari URL
  const { eventID } = await params;

  // 2. Ambil data event berdasarkan ID (pastikan dikonversi ke Number)
  const dataEvent = await db.query.event.findFirst({
    where: eq(event.id, Number(eventID)),
  });

  // Jika event tidak ada di database
  if (!dataEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-red-500">Oops! Event Tidak Ditemukan</h1>
          <p className="text-gray-600 mt-2">Pastikan ID event yang kamu masukkan benar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Main Content memanggil Client Component Form */}
      <main className="mx-auto mt-12 max-w-4xl px-4">
        {/* Teruskan eventID hasil await ke component FormRegistrasi */}
        <FormRegistrasi eventId={eventID} dataEvent={dataEvent} />
      </main>
    </div>
  );
}