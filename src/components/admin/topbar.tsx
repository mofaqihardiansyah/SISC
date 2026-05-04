"use client";

import React from 'react';
import { User } from 'lucide-react';

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-900">Admin POLIVENTS</p>
          <p className="text-[10px] text-gray-500 font-medium">Admin</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 shadow-sm">
          <User className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </header>
  );
}
