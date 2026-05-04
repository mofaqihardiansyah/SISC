import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Ganti spasi dengan -
    .replace(/[^\w-]+/g, '')   // Hapus karakter non-word
    .replace(/--+/g, '-')      // Ganti ganda - dengan tunggal -
    .replace(/^-+/, '')        // Hapus - di awal text
    .replace(/-+$/, '');       // Hapus - di akhir text
}
