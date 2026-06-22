'use client';

import dynamic from 'next/dynamic';

const AdminExportSection = dynamic(() => import('./AdminExportSection'), { ssr: false });

export default function AdminExportWrapper() {
  return <AdminExportSection />;
}
