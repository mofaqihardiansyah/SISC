import { db } from "@/db";
import { event } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import Header from "@/components/penyelenggara/detail-event/Header";
import Sidebar from "@/components/penyelenggara/detail-event/Sidebar";
import Content from "@/components/penyelenggara/detail-event/Content";

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
    <div className="h-full flex flex-col overflow-hidden bg-[#F8FAFC]">

  {/* HEADER — flex-shrink-0 sudah benar, tidak akan scroll */}
  <div className="flex-shrink-0 px-8 pt-2 pb-6">
    <Header event={detailEvent} />
  </div>

  {/* BODY */}
  <div className="flex-1 min-h-0 overflow-hidden px-8 pb-8">
    <div className="grid grid-cols-[240px_1fr] gap-8 h-full min-h-0">

      {/* SIDEBAR */}
      <div className="sticky top-0 self-start">
        <Sidebar />
      </div>

      {/* CONTENT SCROLL — tambahkan data-scroll */}
      <div
  id="detail-scroll"
  style={{ minHeight: 0 }}
  className="overflow-y-auto pr-2"
>
  <Content event={detailEvent} />
</div>

    </div>
  </div>
</div>
  );
}