"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface BookmarkButtonProps {
  eventId: string;
  isLoggedIn?: boolean;
  onRemove?: () => void;
  initialBookmarked?: boolean; 
}

export default function BookmarkButton({ 
  eventId,
  onRemove, 
  initialBookmarked = false
}: BookmarkButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={loading}
      aria-label={bookmarked ? "Hapus bookmark" : "Tambah bookmark"}
    >
      <Bookmark
        className={`w-5 h-5 transition-colors ${
          bookmarked ? "fill-blue-600 text-blue-600" : "text-gray-300 hover:text-blue-500"
        }`}
        fill={bookmarked ? "currentColor" : "none"}
      />
    </Button>
  );
}