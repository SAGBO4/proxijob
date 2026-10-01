"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  PlusCircle,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  LogOut,
  LogIn,
  UserPlus,
  User,
} from "lucide-react";
import { SwitchRoleButton } from "./SwitchRoleButton";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { isClient, isJobber, isAdmin, user, isAuthenticated, logout } = useRole();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Trouver un Jobeur", href: "/jobeurs" },
    { label: "Demandes en cours", href: "/demandes" },
    { label: "Comment ça marche", href: "/#comment-ca-marche" },
    { label: "Vidéo Démo Mobile", href: "/video" },
  ];

  const dashboardHref = isAdmin
    ? "/admin"
    : isClient
    ? "/dashboard/client"
    : "/dashboard/jobeur";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo ProxiJob Bénin */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-client text-white shadow-soft transition-transform duration-150 group-hover:scale-105">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center font-extrabold text-xl leading-none tracking-tight">
                <span className="text-client">PROXI</span>
                <span className="text-jobber">JOB</span>
                <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  BJ
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium tracking-tight">
                Services & Proximité
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "transition-colors duration-150 py-1 hover:text-client",
                    isActive ? "text-client font-semibold border-b-2 border-client" : ""
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions Droite */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {/* Commutateur de Rôle 1-Clic */}
              <SwitchRoleButton />

              {/* Bouton Publier / Nouveau Besoin (si Client) ou Trouver chantier */}
              {isClient ? (
                <Link
                  href="/demandes/nouvelle"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-client px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Publier un besoin</span>
                </Link>
              ) : (
                <Link
                  href="/demandes"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-jobber px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 shadow-soft hover:bg-jobber-hover active:scale-[0.98] transition-all"
                >
                  <span>Trouver un chantier</span>
                </Link>
              )}

              {/* Lien Dashboard */}
              <Link
                href={dashboardHref}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-soft",
                  pathname.startsWith("/dashboard")
                    ? "bg-slate-900 text-white border-slate-900"
                    : "border-slate-200 text-slate-700 hover:bg-slate-100"
                )}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden md:inline">
                  {user.name ? user.name.split(" ")[0] : "Dashboard"}
                </span>
              </Link>

              {/* Lien Admin console si habilité */}
              {(isAdmin || user.role === "ADMIN" || user.role === "MODERATOR") && (
                <Link
                  href="/admin"
                  title="Console Admin & Modération"
                  className={cn(
                    "hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-client hover:bg-slate-100 transition-colors",
                    pathname === "/admin" ? "bg-slate-100 text-client border-client" : ""
                  )}
                >
                  <Shield className="h-4 w-4" />
                </Link>
              )}

              {/* Déconnexion */}
              <button
                type="button"
                onClick={logout}
                title="Déconnexion"
                className="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-client transition-colors"
              >
                <LogIn className="h-4 w-4 text-slate-500" />
                <span>Connexion</span>
              </Link>
              <Link
                href="/inscription"
                className="inline-flex items-center gap-1.5 rounded-xl bg-client px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
              >
                <UserPlus className="h-4 w-4" />
                <span>Inscription</span>
              </Link>
            </>
          )}

          {/* Bouton Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu Déroulant Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 shadow-soft-md animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
            >
              <Shield className="h-4 w-4 text-client" />
              <span>Console d'Administration & Modération</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/demandes/nouvelle"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-client px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Publier une demande de service</span>
                </Link>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Mon Espace ({user.name || "Profil"})</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-2.5 text-sm font-semibold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Se déconnecter</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/connexion"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Connexion</span>
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-client px-4 py-2.5 text-sm font-semibold text-white shadow-soft"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Inscription</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
