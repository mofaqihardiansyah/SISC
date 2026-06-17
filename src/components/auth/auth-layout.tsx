import React from 'react';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  leftTitle?: string;
}

export default function AuthLayout({ children, leftTitle }: AuthLayoutProps) {
  return (
    <div className="h-[100dvh] w-full flex flex-col md:flex-row overflow-hidden bg-white font-inter">
      <div 
        className="hidden md:flex md:w-[45%] lg:w-1/2 p-12 lg:p-16 flex-col justify-center relative overflow-hidden animate-in fade-in duration-1000 slide-in-from-left-8" 
        style={{ 
          backgroundImage: 'url("/auth-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Dark Overlay (Cleaner) */}
        <div className="absolute inset-0 bg-slate-950/75" />

        <div className="relative z-10 max-w-lg mx-auto mt-[-10%] flex flex-col justify-center">
          <h2 className="text-white text-4xl lg:text-5xl font-heading font-black leading-[1.2] tracking-tight mb-6">
            {leftTitle || "Platform Manajemen Event Terbaik."}
          </h2>
          <p className="text-white/80 text-lg font-medium leading-relaxed">
            Kelola pendaftaran, operasional acara, dan pengalaman peserta dalam satu dasbor pintar. Tingkatkan kualitas acara Anda bersama POLIVENTS.
          </p>
        </div>
      </div>

      {/* Sisi Kanan - Form Area */}
      <div className="w-full md:w-[55%] lg:w-1/2 h-full bg-white flex flex-col px-6 py-8 md:px-12 md:py-12 lg:px-16 lg:py-16 xl:px-20 overflow-y-auto">
        <div className="w-full max-w-md mx-auto flex flex-col flex-1 animate-in fade-in slide-in-from-right-8 duration-700">
          
          {/* Logo untuk Mobile & Desktop di Form */}
          <div className="flex items-center justify-center md:justify-start -mb-4">
            <Image 
              src="/logo_sementara.png" 
              alt="POLIVENTS" 
              width={170} 
              height={55} 
              className="object-contain mix-blend-multiply brightness-[1.08] contrast-[1.15]"
              priority
            />
          </div>
          
          {/* Main Form Content */}
          <div className="w-full -mt-4 md:-mt-8">
            {children}
          </div>

          {/* Footer Form */}
          <div className="mt-auto pt-8 pb-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-micro font-medium">
            <p>© 2026 POLIVENTS.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600 transition-colors">Ketentuan</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</a>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
