import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  leftTitle: string;
}

export default function AuthLayout({ children, leftTitle }: AuthLayoutProps) {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-white">
      {/* Left Side - Vertical Linear Gradient */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-[#0C4A8E] to-[#041d3d] p-16 lg:p-24 flex-col justify-center relative overflow-hidden">
        {/* Abstract Background pattern */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px]" />
        </div>
        
        <div className="relative z-10 max-w-xl">
          <h1 className="text-white text-5xl lg:text-7xl font-black leading-[1.1] mb-12 tracking-tight">
            {leftTitle}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-16 h-[2px] bg-primary" />
            <p className="text-white/80 text-sm font-bold tracking-[0.2em] uppercase">POLIVENTS</p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 h-full bg-white flex flex-col p-8 md:p-12 lg:p-16 overflow-y-auto">
        <div className="w-full max-w-md mx-auto my-auto py-12">
          <div className="mb-12">
            <h2 className="text-2xl font-black tracking-tight text-[#0C4A8E]">POLIVENTS</h2>
          </div>
          {children}
        </div>
        
        <div className="mt-auto pt-8 w-full border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
          <p>© 2024 POLIVENTS Editorial.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0C4A8E] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#0C4A8E] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
