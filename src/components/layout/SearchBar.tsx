"use client";

import { Input } from '@/components/ui/input';
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/jelajah?search=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari seminar atau konferensi"
        className="pl-10 pr-4 py-2 rounded-full text-sm text-black bg-white w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </form>
  );
}