import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface BlockedOrganizerStateProps {
  title: string;
  description: string;
}

export function BlockedOrganizerState({ title, description }: BlockedOrganizerStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 mb-6 shrink-0">
        <Clock className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-snug">
        {title}
      </h2>
      
      <p className="text-xs text-slate-400 mt-3 leading-relaxed">
        {description}
      </p>

      <div className="mt-8">
        <Link 
          href="/penyelenggara/profil"
          className="inline-flex items-center gap-2 bg-sisc-navy hover:bg-sisc-hover text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md transition-colors"
        >
          Lengkapi Dokumen Profil
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
