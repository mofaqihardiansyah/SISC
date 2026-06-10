import { db } from "@/db";
import { event } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import Header from "@/components/penyelenggara/detail-event/Header";
import Sidebar from "@/components/penyelenggara/detail-event/Sidebar";
import Content from "@/components/penyelenggara/detail-event/Content";
import SetMainOverflow from "@/components/penyelenggara/detail-event/SetMainOverflow";
export const dynamic = 'force-dynamic';


type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetailEventPage({ params }: Props) {
  const { id } = await params;

  const detailEvent = await db.query.event.findFirst({
    where: eq(event.id, Number(id)),
    with: {
      kategori: true,
      kota: {
        with: {
          provinsi: true,
        },
      },
    },
  });

  if (!detailEvent) notFound();

  return (
  <>
    <SetMainOverflow />
    <div className="flex flex-col h-full bg-slate-50">

      {/* HEADER â€” diam */}
      <div className="flex-shrink-0 pb-3">
        <Header event={detailEvent} />
      </div>

      {/* BODY */}
      <div className="flex flex-1 gap-4 min-h-0">

        {/* SIDEBAR â€” diam */}
        <div className="w-48 flex-shrink-0">
          <Sidebar />
        </div>

        {/* CONTENT â€” satu-satunya yang scroll */}
        <div className="flex-1 overflow-y-auto pb-8 min-w-0" id="detail-scroll">
          <Content event={detailEvent} />
        </div>

      </div>
    </div>
  </>
);
}