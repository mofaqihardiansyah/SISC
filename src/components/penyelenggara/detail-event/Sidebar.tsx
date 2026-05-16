"use client";

import { useEffect, useState, useRef } from "react";
import clsx from "clsx";

const menus = [
  { id: "deskripsi", label: "Deskripsi" },
  { id: "pendaftaran", label: "Pendaftaran" },
  { id: "syarat", label: "Syarat & Ketentuan" },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("deskripsi");
  const isclicking = useRef(false); // ← cegah scroll event saat klik

  const scrollToSection = (id: string) => {
    const container = document.getElementById("detail-scroll") as HTMLElement;
    const section = document.getElementById(id);
    if (!container || !section) return;

    isclicking.current = true;
    setActiveSection(id); // langsung set aktif saat diklik

    const sectionRect = section.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const offset = container.scrollTop + sectionRect.top - containerRect.top - 16;

    container.scrollTo({ top: offset, behavior: "smooth" });

    // Setelah animasi scroll selesai, baru aktifkan scroll-spy lagi
    setTimeout(() => {
      isclicking.current = false;
    }, 800);
  };

  useEffect(() => {
    const container = document.getElementById("detail-scroll") as HTMLElement;
    if (!container) return;

    const handleScroll = () => {
      if (isclicking.current) return; // skip saat sedang klik

      const containerRect = container.getBoundingClientRect();

      for (let i = menus.length - 1; i >= 0; i--) {
        const el = document.getElementById(menus[i].id);
        if (!el) continue;

        const elTop = el.getBoundingClientRect().top - containerRect.top;

        if (elTop <= 50) {
          setActiveSection(menus[i].id);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="sticky top-4 h-fit">
      <div className="bg-white rounded-2xl border p-3">
        <div className="flex flex-col gap-1">
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => scrollToSection(menu.id)}
              className={clsx(
                "px-4 py-3 rounded-xl transition-all font-medium text-left w-full",
                activeSection === menu.id
                  ? "bg-[#13254C] text-white"
                  : "hover:bg-gray-100 text-gray-600"
              )}
            >
              {menu.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}