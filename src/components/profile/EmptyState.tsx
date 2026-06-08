// File: src/components/profile/EmptyState.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  icon = <Inbox size={48} className="mx-auto text-slate-300" />,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
      <div className="mb-4 flex justify-center">{icon}</div>
      <p className="text-lg font-semibold text-slate-900 mb-2">{title}</p>
      {description && (
        <p className="text-slate-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
