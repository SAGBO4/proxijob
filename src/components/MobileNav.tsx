"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, FileText, User } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { isClient } = useRole();

  const dashboardHref = isClient ? "/dashboard/client" : "/dashboard/jobeur";
  const actionHref = isClient ? "/demandes/nouvelle" : "/demandes";

  const navItems = [
    {
      label: "Accueil",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Jobeurs",
      href: "/jobeurs",
      icon: Search,
      isActive: pathname.startsWith("/jobeurs"),
    },
    {
      label: isClient ? "Poster" : "Chantiers",
      href: actionHref,
      icon: Plus,
      isPrimaryAction: true,
      isActive: pathname === actionHref,
    },
    {
      label: "Demandes",
      href: "/demandes",
      icon: FileText,
      isActive: pathname === "/demandes",
    },
    {
      label: "Mon Espace",
      href: dashboardHref,
      icon: User,
      isActive: pathname.startsWith("/dashboard"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-[0_-4px_16px_rgba(15,23,42,0.06)] pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isPrimaryAction) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5 group"
                aria-label={item.label}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl shadow-soft-md transition-transform duration-150 active:scale-90",
                    isClient ? "bg-client text-white" : "bg-jobber text-slate-900"
                  )}
                >
                  <Icon className="h-6 w-6 stroke-[2.5]" />
                </div>
                <span
                  className={cn(
                    "mt-1 text-[10px] font-bold tracking-tight",
                    item.isActive
                      ? isClient ? "text-client" : "text-amber-800"
                      : "text-slate-600"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-1 transition-colors duration-150",
                item.isActive ? "text-client" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-5 w-5", item.isActive ? "stroke-[2.5]" : "stroke-[1.8]")} />
              <span
                className={cn(
                  "mt-1 text-[10px]",
                  item.isActive ? "font-bold text-client" : "font-medium"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
