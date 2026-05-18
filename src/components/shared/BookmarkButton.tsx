"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  eventId: string;
  isLoggedIn: boolean;
  onRemove?: () => void;
  // Tambahkan prop ini untuk menentukan status awal tanpa nunggu API
  initialBookmarked?: boolean; 
}

export default function BookmarkButton({ 
  eventId, 
  isLoggedIn, 
  onRemove, 
  initialBookmarked = false // Default ke false jika tidak diisi
}: BookmarkButtonProps) {
  const router = useRouter();
  
  // SOLUSI POIN 1: Gunakan initialBookmarked sebagai state awal
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Jika initialBookmarked diberikan (seperti di hal favorit), tidak perlu fetch ulang
    if (!isLoggedIn || initialBookmarked) return;

    fetch(`/api/bookmark?eventId=${eventId}`)
      .then(res => res.json())
      .then(data => setBookmarked(data.bookmarked));
  }, [eventId, isLoggedIn, initialBookmarked]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: Number(eventId) }),
      });
      const data = await res.json();
      
      setBookmarked(data.bookmarked);

      // SOLUSI POIN 2: Panggil onRemove jika status jadi tidak ter-bookmark
      if (!data.bookmarked && onRemove) {
        onRemove();
      }
    } catch (error) {
      console.error("Gagal update bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="cursor-pointer transition-all active:scale-90"
    >
      <Bookmark
        className={`w-5 h-5 transition-colors ${
          bookmarked ? "fill-blue-600 text-blue-600" : "text-gray-300 hover:text-blue-500"
        }`}
        fill={bookmarked ? "currentColor" : "none"}
      />
    </button>
  );
}