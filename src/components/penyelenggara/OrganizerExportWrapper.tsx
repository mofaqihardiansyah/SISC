'use client';

import dynamic from 'next/dynamic';

const OrganizerExportSection = dynamic(() => import('./OrganizerExportSection'), { ssr: false });

export default function OrganizerExportWrapper() {
  return <OrganizerExportSection />;
}
