"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, MoreVertical, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarContext';

export type MenuItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  exactMatch?: boolean;
  subItems?: {
    label: string;
    href: string;
    icon: React.ElementType;
    exactMatch?: boolean;
  }[];
};

interface SidebarProps {
  roleTitle: string;
  menuItems: MenuItem[];
}

export function Sidebar({ roleTitle, menuItems }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { isCollapsed } = useSidebar();
  
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveSub = item.subItems.some((sub) => {
          return sub.exactMatch
            ? pathname === sub.href
            : pathname === sub.href || pathname.startsWith(sub.href + '/');
        });
        if (hasActiveSub) {
          initial[item.label] = true;
        }
      }
    });
    return initial;
  });

  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems) {
        const hasActiveSub = item.subItems.some((sub) => {
          return sub.exactMatch
            ? pathname === sub.href
            : pathname === sub.href || pathname.startsWith(sub.href + '/');
        });
        if (hasActiveSub) {
          setOpenDropdowns((prev) => ({ ...prev, [item.label]: true }));
        }
      }
    });
  }, [pathname, menuItems]);

  if (pathname !== prevPathname) {
    setIsOpen(false);
    setPrevPathname(pathname);
  }

  return (
    <>
      <Button
        variant="default"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-2.5 left-4 z-60"
        aria-label={isOpen ? "Tutup menu" : "Buka menu"}
      >
        {isOpen ? <MoreVertical className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-400 flex flex-col h-screen border-r border-slate-800 transition-all duration-300 ease-in-out md:sticky md:top-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo Section */}
        <div className="pt-5 pb-3 px-5 hidden md:block overflow-hidden whitespace-nowrap">
          <h1 className={cn("text-lg font-extrabold text-white tracking-wider", isCollapsed ? "opacity-0" : "opacity-100")}>
            POLIVENTS
          </h1>
          <p className={cn("text-nano text-slate-500 font-semibold uppercase tracking-widest mt-0.5", isCollapsed ? "opacity-0" : "opacity-100")}>{roleTitle}</p>
        </div>
        
        <div className="h-16 md:hidden"></div>
 
        {/* Navigation */}
        <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            if (item.subItems) {
              const isDropdownOpen = !!openDropdowns[item.label] && !isCollapsed;
              const hasActiveSub = item.subItems.some((sub) => {
                return sub.exactMatch
                  ? pathname === sub.href
                  : pathname === sub.href || pathname.startsWith(sub.href + '/');
              });

              return (
                <div key={item.label} className="space-y-1">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setOpenDropdowns((prev) => ({
                        ...prev,
                        [item.label]: !prev[item.label],
                      }));
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group font-medium text-xs",
                      hasActiveSub
                        ? "text-white bg-slate-800"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <item.icon className={cn(
                        "w-4 h-4 transition-colors duration-200",
                        hasActiveSub ? "text-white" : "text-slate-500 group-hover:text-white"
                      )} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && <ChevronDown className={cn(
                      "w-3.5 h-3.5 text-slate-500 transition-transform duration-200 group-hover:text-white",
                      isDropdownOpen && "transform rotate-180 text-white"
                    )} />}
                  </Button>

                  {!isCollapsed && (
                    <div className={cn(
                      "grid transition-all duration-200 ease-in-out overflow-hidden",
                      isDropdownOpen ? "grid-rows-[1fr] opacity-100 mt-0.5" : "grid-rows-[0fr] opacity-0 mt-0"
                    )}>
                      <div className="min-h-0 ml-3 pl-2.5 border-l border-slate-800/80 space-y-0.5 bg-slate-950/20 rounded-r-lg py-1">
                        {item.subItems.map((sub) => {
                          const isSubActive = sub.exactMatch
                            ? pathname === sub.href
                            : pathname === sub.href || pathname.startsWith(sub.href + '/');

                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "flex items-center gap-2 px-2.5 py-2 rounded-md transition-all duration-200 group",
                                isSubActive
                                  ? "bg-white text-slate-900 font-semibold shadow-md shadow-white/5"
                                  : "text-slate-400 font-medium hover:bg-slate-800/80 hover:text-white"
                              )}
                            >
                              <sub.icon className={cn(
                                "w-3.5 h-3.5",
                                isSubActive ? "text-slate-900" : "text-slate-500 group-hover:text-white"
                              )} />
                              <span className="text-micro">{sub.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            if (!item.href) return null;

            const isActive = item.exactMatch
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
 
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive 
                    ? "bg-white text-slate-900 font-semibold shadow-md shadow-white/5" 
                    : "text-slate-400 font-medium hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4",
                  isActive ? "text-slate-900" : "text-slate-500 group-hover:text-white"
                )} />
                {!isCollapsed && <span className="text-xs">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
