'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export function PageHeader({ title }: { title: string }) {
  const pathname = usePathname() || '';
  const router = useRouter();
  const segments = pathname.split('/').filter(Boolean);
  const showBack = segments.length > 1;

  return (
    <div className="mb-6">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}