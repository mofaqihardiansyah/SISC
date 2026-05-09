'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ShoppingCart, DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function TicketsPage() {
  const tickets = [
    {
      id: 'TKT-001',
      eventTitle: 'Seminar PPKS',
      date: '11 April 2026',
      purchaseDate: '05 April 2026',
      price: 'Gratis',
      status: 'verified',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-001',
    },
    {
      id: 'TKT-002',
      eventTitle: 'Workshop Web Development',
      date: '20 April 2026',
      purchaseDate: '10 April 2026',
      price: 'Rp 50.000',
      status: 'pending',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-002',
    },
  ];

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Tiket Saya</h1>
        <p className="text-slate-500 mt-2">Kelola tiket event Anda di sini</p>
      </div>

      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Cari tiket..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Semua Status</option>
          <option>Terverifikasi</option>
          <option>Menunggu</option>
          <option>Digunakan</option>
        </select>
      </div>

      {/* TICKETS LIST */}
      <div className="space-y-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Ticket Info */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                      ID Tiket
                    </p>
                    <p className="text-2xl font-bold text-slate-900">{ticket.id}</p>
                  </div>

                  <div>
                    <p className="text-lg font-bold text-slate-900">{ticket.eventTitle}</p>
                    <div className="space-y-2 text-sm text-slate-600 mt-2">
                      <p className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        {ticket.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-blue-600" />
                        Dibeli pada {ticket.purchaseDate}
                      </p>
                      <p className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        {ticket.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-200">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                        ticket.status === 'verified'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {ticket.status === 'verified' ? (
                        <>
                          <CheckCircle className="w-3 h-3" />
                          Terverifikasi
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          Menunggu
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32" />
                  <p className="text-xs text-slate-500 text-center">
                    Tunjukkan QR Code di pintu masuk
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  Download Tiket
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors">
                  Lihat Detail Event
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-lg mb-4">Anda belum memiliki tiket</p>
          <Link
            href="/events"
            className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Cari Event & Beli Tiket
          </Link>
        </div>
      )}
    </div>
  );
}
