"use client";

import { Search, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface SuggestionEvent {
  id: number;
  judul: string;
}

export default function SearchInput() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || ""; // Mengambil parameter ?q= dari URL

  const [inputValue, setInputValue] = useState(q);
  const [suggestions, setSuggestions] = useState<SuggestionEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Event Listener untuk menutup dropdown saat klik di luar kotak pencarian
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetching data dengan efek Debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        // Memanfaatkan endpoint events yang sudah ada
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          const eventsArray = Array.isArray(data) ? data : (data.events || []);
          // Filter maksimal 5 event yang sesuai input
          const filtered = eventsArray
            .filter((event: SuggestionEvent) => event.judul.toLowerCase().includes(inputValue.toLowerCase()))
            .slice(0, 5);
          setSuggestions(filtered);
        }
      } catch (error) {
        console.error("Gagal memuat saran:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Jeda 300ms agar tidak spam request setiap 1 huruf diketik
    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300); 

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (inputValue.trim()) {
      router.push(`/jelajah?q=${encodeURIComponent(inputValue)}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari seminar atau konferensi"
          className="pl-10 pr-4 py-2 rounded-full text-sm text-black bg-white w-[300px] outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          autoComplete="off"
        />
      </form>

      {/* DROPDOWN AUTO COMPLETE */}
      {isOpen && inputValue.trim().length >= 2 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm font-medium">Mencari...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((event) => (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setInputValue(event.judul);
                      setIsOpen(false);
                      router.push(`/jelajah?q=${encodeURIComponent(event.judul)}`);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <Search className="inline w-3.5 h-3.5 mr-2.5 text-gray-400" />
                    <span className="line-clamp-1 inline-block align-middle w-[230px]">{event.judul}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              Tidak ada event ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
}