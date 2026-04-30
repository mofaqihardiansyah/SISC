import React from 'react';
import { 
  Monitor, 
  Briefcase, 
  Car, 
  TrendingUp, 
  Palette, 
  Cpu, 
  Languages, 
  GraduationCap 
} from 'lucide-react';

const categories = [
  { id: 1, name: "Teknologi", icon: Monitor, bgColor: "bg-orange-500", shadow: "shadow-orange-500/20" },
  { id: 2, name: "Bisnis", icon: Briefcase, bgColor: "bg-blue-500", shadow: "shadow-blue-500/20" },
  { id: 3, name: "Otomotif", icon: Car, bgColor: "bg-yellow-400", shadow: "shadow-yellow-400/20" },
  { id: 4, name: "Ekonomi", icon: TrendingUp, bgColor: "bg-teal-500", shadow: "shadow-teal-500/20" },
  { id: 5, name: "Seni", icon: Palette, bgColor: "bg-purple-500", shadow: "shadow-purple-500/20" },
  { id: 6, name: "Artificial Intelligence", icon: Cpu, bgColor: "bg-orange-600", shadow: "shadow-orange-600/20" },
  { id: 7, name: "Bahasa", icon: Languages, bgColor: "bg-pink-500", shadow: "shadow-pink-500/20" },
  { id: 8, name: "Pendidikan", icon: GraduationCap, bgColor: "bg-yellow-500", shadow: "shadow-yellow-500/20" },
];

export function CategoryList() {
  return (
    <section className="px-6 py-8 w-full max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-6 font-heading text-[#1e293b]">Kategori Event</h2>
      
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="flex flex-col items-center gap-3 cursor-pointer group">
              <div className={`w-20 h-20 rounded-2xl ${cat.bgColor} flex items-center justify-center text-white shadow-lg ${cat.shadow} transition-transform duration-300 group-hover:-translate-y-2`}>
                <Icon className="w-8 h-8" />
              </div>
              <span className="text-xs font-semibold text-center text-gray-700 group-hover:text-[#0C4A8E] transition-colors">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
