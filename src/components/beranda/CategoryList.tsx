import React from 'react';
import { 
  Monitor, 
  Briefcase, 
  Car, 
  TrendingUp, 
  Palette, 
  Cpu, 
  Languages, 
  GraduationCap,
  Tag,
  LucideIcon
} from 'lucide-react';

interface Category {
  id: number;
  nama: string | null;
  slug: string | null;
  iconUrl?: string | null;
}

interface CategoryListProps {
  categories: Category[];
}

// Icon and Color mapping helper
const getCategoryStyles = (name: string | null) => {
  const n = name?.toLowerCase() || "";
  
  const mapping: Record<string, { icon: LucideIcon; bgColor: string; shadow: string }> = {
    "teknologi": { icon: Monitor, bgColor: "bg-orange-500", shadow: "shadow-orange-500/20" },
    "bisnis": { icon: Briefcase, bgColor: "bg-blue-500", shadow: "shadow-blue-500/20" },
    "otomotif": { icon: Car, bgColor: "bg-yellow-400", shadow: "shadow-yellow-400/20" },
    "ekonomi": { icon: TrendingUp, bgColor: "bg-teal-500", shadow: "shadow-teal-500/20" },
    "seni": { icon: Palette, bgColor: "bg-purple-500", shadow: "shadow-purple-500/20" },
    "artificial intelligence": { icon: Cpu, bgColor: "bg-orange-600", shadow: "shadow-orange-600/20" },
    "bahasa": { icon: Languages, bgColor: "bg-pink-500", shadow: "shadow-pink-500/20" },
    "pendidikan": { icon: GraduationCap, bgColor: "bg-yellow-500", shadow: "shadow-yellow-500/20" },
  };

  return mapping[n] || { icon: Tag, bgColor: "bg-gray-500", shadow: "shadow-gray-500/20" };
};

export function CategoryList({ categories }: CategoryListProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="px-6 py-8 w-full max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-6 font-heading text-[var(--brand-dark)]">Kategori Event</h2>
      
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {categories.map((cat) => {
          const { icon: Icon, bgColor, shadow } = getCategoryStyles(cat.nama);
          return (
            <div key={cat.id} className="flex flex-col items-center gap-3 cursor-pointer group">
              <div className={`w-20 h-20 rounded-2xl ${bgColor} flex items-center justify-center text-white shadow-lg ${shadow} transition-transform duration-300 group-hover:-translate-y-2`}>
                <Icon className="w-8 h-8" />
              </div>
              <span className="text-xs font-semibold text-center text-gray-700 group-hover:text-[var(--sisc-blue)] transition-colors">
                {cat.nama}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
