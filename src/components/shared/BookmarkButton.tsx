"use client";

import { Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface BookmarkButtonProps {
  eventId: string;
  isLoggedIn: boolean;
}

export default function BookmarkButton({ eventId, isLoggedIn }: BookmarkButtonProps) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch(`/api/bookmark?eventId=${eventId}`)
      .then(res => res.json())
      .then(data => setBookmarked(data.bookmarked));
  }, [eventId, isLoggedIn]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/bookmark", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: Number(eventId) }),
    });
    const data = await res.json();
    setBookmarked(data.bookmarked);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="cursor-pointer transition-colors"
    >
      <Bookmark
        className={`w-5 h-5 transition-colors ${
          bookmarked ? "fill-blue-500 text-blue-500" : "text-gray-300 hover:text-blue-500"
        }`}
        fill={bookmarked ? "#3b82f6" : "none"}
      />
    </button>
  );
}