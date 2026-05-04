import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  leftTitle: string;
}

export default function AuthLayout({ children, leftTitle }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white font-inter">
      {/* Sisi Kiri - Modern Gradient/Solid */}
      <div className="hidden md:flex md:w-1/2 p-16 lg:p-24 flex-col justify-between relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #03428B 0%, #011225 73%)' }}>
        {/* Elemen dekoratif */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="relative z-10 flex items-center gap-3">
          <h1 className="text-2xl font-heading font-black text-white tracking-tight">POLIVENTS</h1>
        </div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-white text-4xl lg:text-5xl font-heading font-black leading-[1.15] mb-8 tracking-tight">
            {leftTitle}
          </h2>
          <p className="text-blue-100 text-lg font-medium max-w-md leading-relaxed opacity-90">
            Bergabunglah dengan ribuan pengguna yang mengelola seminar mereka dengan mudah menggunakan platform modern kami.
          </p>
        </div>

        <div className="relative z-10 flex justify-between items-center text-blue-200/70 text-xs font-medium">
          <p>© 2026 POLIVENTS.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Ketentuan</a>
            <a href="#" className="hover:text-white transition-colors">Privasi</a>
          </div>
        </div>
      </div>

      {/* Sisi Kanan - Form */}
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col p-8 md:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-md mx-auto my-auto py-12">
          {/* Logo Mobile */}
          <div className="md:hidden flex flex-col items-center mb-12">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-4">
              <div className="w-6 h-6 bg-white rounded-md rotate-45" />
            </div>
            <h1 className="text-2xl font-heading font-black text-primary tracking-tight">POLIVENTS</h1>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
