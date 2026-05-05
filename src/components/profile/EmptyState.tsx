// File: src/components/profile/EmptyState.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
      <p className="text-6xl mb-4">{icon}</p>
      <p className="text-lg font-semibold text-slate-900 mb-2">{title}</p>
      {description && (
        <p className="text-slate-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <Link
          href={action.href}
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
