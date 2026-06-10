"use client";

import { useEffect, useState, useRef } from "react";
import clsx from "clsx";

const menus = [
  { id: "tipe-event",       label: "Tipe Event" },
  { id: "detail-umum",      label: "Detail Umum" },
  { id: "deskripsi-poster", label: "Deskripsi & Poster" },
  { id: "syarat",           label: "Syarat & Ketentuan" },
  { id: "jadwal-kuota",     label: "Jadwal & Kuota" },
  { id: "link-pendaftaran", label: "Link Pendaftaran" },
];

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState("tipe-event");
  const isClicking = useRef(false);

  const scrollToSection = (id: string) => {
    const container = document.getElementById("detail-scroll") as HTMLElement;
    const target = document.getElementById(id);
    if (!container || !target) return;

    isClicking.current = true;
    setActiveSection(id);

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - containerRect.top + container.scrollTop - 16;

    container.scrollTo({ top: offset, behavior: "smooth" });

    target.style.transition = "box-shadow 0.3s";
    target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.3)";
    setTimeout(() => {
      target.style.boxShadow = "";
    }, 1200);

    setTimeout(() => { isClicking.current = false; }, 800);
  };

  useEffect(() => {
    const container = document.getElementById("detail-scroll") as HTMLElement;
    if (!container) return;

    const handleScroll = () => {
      if (isClicking.current) return;

      let current = menus[0].id;
      const containerRect = container.getBoundingClientRect();
      const containerBottom = container.scrollTop + container.clientHeight;
      const contentHeight = container.scrollHeight;

      if (containerBottom >= contentHeight - 10) {
        setActiveSection(menus[menus.length - 1].id);
        return;
      }

      if (container.scrollTop === 0) {
        setActiveSection(menus[0].id);
        return;
      }

      for (const menu of menus) {
        const el = document.getElementById(menu.id);
        if (!el) continue;

        const elRect = el.getBoundingClientRect();
        const elTopRelative = elRect.top - containerRect.top;

        if (elTopRelative <= containerRect.height / 2) {
          current = menu.id;
        }
      }

      setActiveSection(current);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-2 h-fit sticky top-4">
      <p className="text-xxs font-semibold text-slate-400 uppercase tracking-wider px-3 pt-1 pb-2">
        Navigasi
      </p>
      <div className="flex flex-col gap-0.5">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => scrollToSection(menu.id)}
            className={clsx(
              "px-3 py-2 rounded-xl transition-all text-sm font-medium text-left w-full flex items-center gap-2",
              activeSection === menu.id
                ? "bg-sisc-nav text-white shadow-sm"
                : "hover:bg-gray-100 text-gray-600"
            )}
          >
            <span
              className={clsx(
                "w-1.5 h-1.5 rounded-full shrink-0 transition-all",
                activeSection === menu.id
                  ? "bg-white"
                  : "bg-slate-300"
              )}
            />
            {menu.label}
          </button>
        ))}
      </div>
    </div>
  );
}
