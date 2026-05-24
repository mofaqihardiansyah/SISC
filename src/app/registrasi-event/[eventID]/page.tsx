import React from 'react';
import { db } from "@/db";
import { event } from "@/db/schema";
import { eq } from "drizzle-orm";
import FormRegistrasi from './FormRegistrasi';
import { auth } from "@/auth"; 
import { redirect } from "next/navigation";

export default async function RegistrasiEventPage({ 
  params 
}: { 
  params: Promise<{ eventID: string }> 
}) {
  
  // 1. Cek session login user
  const session = await auth();
  
  if (!session || !session.user) {
    redirect("/login"); 
  }

  // 2. Ambil eventID dari URL
  const { eventID } = await params;

  // 3. Ambil data event dari database
  const dataEvent = await db.query.event.findFirst({
    where: eq(event.id, Number(eventID)),
  });

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
      <main className="mx-auto mt-12 max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Sekarang kita ikut passing property 'harga' ke form */}
        <FormRegistrasi 
          eventId={eventID} 
          dataEvent={{
            judul: dataEvent.judul,
            linkEksternal: dataEvent.linkEksternal,
            kategori: dataEvent.kategori,
            harga: dataEvent.harga // <-- Ambil nilai harga dari DB (contoh: 0 atau 50000)
          }} 
          currentUser={session.user} 
        />
      </main>
    </div>
  );
}