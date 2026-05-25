import React from 'react';
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import FormRegistrasi from './FormRegistrasi';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { event, pendaftaran, users } from "@/db/schema";

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

  // 2. Await params untuk mengambil eventID dari URL
  const { eventID } = await params;

  // 3. Ambil data event & data user secara paralel
  const [dataEvent, userData] = await Promise.all([
    db.query.event.findFirst({
      where: eq(event.id, Number(eventID)),
      with: {
        kategori: true,
      },
    }),
    db.query.users.findFirst({
      where: eq(users.id, Number(session.user.id)),
    })
  ]);

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

  // 4. Cek apakah user sudah terdaftar di event ini
  const existingPendaftaran = await db
    .select()
    .from(pendaftaran)
    .where(
      and(
        eq(pendaftaran.eventId, Number(eventID)),
        eq(pendaftaran.userId, Number(session.user.id))
      )
    )
    .limit(1);

  if (existingPendaftaran.length > 0) {
    const kategori = dataEvent.kategori?.nama?.toLowerCase() || "";
    const judul = dataEvent.judul?.toLowerCase() || "";
    const isConference = kategori === "conference" || kategori === "konferensi" || judul.includes("conference") || judul.includes("konferensi");

    if (isConference) {
      redirect(`/profile/submit-paper?eventId=${eventID}`);
    } else {
      redirect(`/event/${eventID}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <main className="mx-auto mt-12 max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <FormRegistrasi 
          eventId={eventID} 
          dataEvent={{
            judul: dataEvent.judul,
            linkEksternal: dataEvent.linkEksternal,
            kategori: dataEvent.kategori?.nama,
            harga: dataEvent.harga,
            namaBank: dataEvent.namaBank,
            nomorRekening: dataEvent.nomorRekening,
            pemilikRekening: dataEvent.pemilikRekening,
            namaBankAlternatif: dataEvent.namaBankAlternatif,
            nomorRekeningAlternatif: dataEvent.nomorRekeningAlternatif,
            pemilikRekeningAlternatif: dataEvent.pemilikRekeningAlternatif,
          }} 
          currentUser={{
            name: userData?.namaLengkap,
            email: userData?.email,
            nomorTelepon: userData?.nomorTelepon,
            jenisKelamin: userData?.jenisKelamin
          }} 
        />
      </main>
    </div>
  );
}