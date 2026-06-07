"use client";

import { Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function BuatEventButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    const isBuatEventPage = pathname.includes("/buatevent");
    const isDirtyFn = (window as any).__buatEventIsDirty;
    const showModalFn = (window as any).__buatEventShowModal;

    if (isBuatEventPage && isDirtyFn && isDirtyFn() && showModalFn) {
      showModalFn();
    } else {
      router.push("/penyelenggara/buatevent?reset=" + Date.now());
    }
  };

  return (
    <button
      onClick={handleClick}
      className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
    >
      <Plus className="w-4 h-4" />
      Buat Event Baru
    </button>
  );
}