"use client";

import React, { useState } from 'react';
import { 
  Search, 
  LayoutDashboard, 
  Ticket, 
  User, 
  Bookmark, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  CircleUser
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventFavoritPage() {
  const [activeTab, setActiveTab] = useState("seminar");

  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      
      {/* SIDEBAR - Menggunakan warna brand-dark sesuai global.css */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col shadow-xl">
        <div className="p-8">
          <h1 className="text-2xl font-heading font-bold tracking-wider">POLIVENTS</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem icon={<Search size={20} />} label="Jelajah Event" />
          <NavItem icon={<Ticket size={20} />} label="Tiket Saya" />
          <NavItem icon={<User size={20} />} label="Akun & Privasi" />
          <NavItem icon={<Bookmark size={20} />} label="Event Favorit" active />
          <NavItem icon={<HelpCircle size={20} />} label="Bantuan" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">
        {/* TOPBAR - Menggunakan warna primary #03428B */}
        <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center px-10 shadow-md">
          <h2 className="text-xl font-heading font-semibold">Pengaturan Akun</h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-medium opacity-90">Faqih Ardi..</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-slate-200">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Faqih" alt="profile" />
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-10">
          <div className="mb-6">
             <h3 className="text-2xl font-heading font-bold text-slate-800">Event Favorit</h3>
             <div className="h-1 w-full bg-slate-100 mt-4"></div>
          </div>
          
          {/* TABS - Menggunakan Tabs dari Shadcn UI sesuai preferensi tim kamu */}
          <Tabs defaultValue="seminar" className="w-full mb-8">
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
              <TabsTrigger 
                value="seminar" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-bold text-lg pb-2 px-0"
              >
                Seminar
              </TabsTrigger>
              <TabsTrigger 
                value="conferences" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary font-bold text-lg pb-2 px-0 text-slate-400"
              >
                Conferences
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* GRID KARTU EVENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EventCard />
            <EventCard />
            <EventCard />
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end mt-16 items-center gap-4 text-slate-500 font-medium">
             <ChevronLeft size={20} className="cursor-pointer hover:text-primary" />
             <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded shadow-md">1</span>
             <span className="cursor-pointer hover:text-primary">2</span>
             <span className="cursor-pointer hover:text-primary">3</span>
             <span className="cursor-pointer hover:text-primary">4</span>
             <span>...</span>
             <span className="cursor-pointer hover:text-primary">18</span>
             <ChevronRight size={20} className="cursor-pointer hover:text-primary" />
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
      active 
      ? 'bg-white text-brand-dark shadow-lg font-bold' 
      : 'text-slate-400 hover:bg-white/10 hover:text-white'
    }`}>
      {icon}
      <span className="text-sm tracking-wide">{label}</span>
    </div>
  );
}

function EventCard() {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden group hover:-translate-y-1 transition-all duration-300">
      {/* Gambar Poster */}
      <div className="h-48 bg-slate-900 relative">
        <img 
          src="https://png.pngtree.com/thumb_back/fh260/background/20210903/pngtree-high-end-black-gold-atmosphere-science-and-technology-exhibition-board-background-image_785661.jpg" 
          alt="Event Poster" 
          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Detail Konten */}
      <div className="p-6 space-y-2">
        <h4 className="text-lg font-bold text-slate-800">Nama Event</h4>
        <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">Tanggal Event</p>
        
        <div className="pt-4 flex justify-between items-end border-b border-slate-200 pb-3">
          <span className="text-lg font-black text-slate-900 leading-none">Harga</span>
          <Bookmark size={20} className="text-slate-900 cursor-pointer hover:fill-current" fill="black" />
        </div>

        {/* Pembuat Event */}
        <div className="flex items-center gap-3 pt-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-900 flex items-center justify-center">
             <CircleUser size={18} className="text-slate-900" />
          </div>
          <span className="text-xs font-bold text-slate-700">Nama Pembuat Event</span>
        </div>
      </div>
    </div>
  );
}