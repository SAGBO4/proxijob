"use client";

import React from "react";
import { ArrowLeftRight, UserCheck, Briefcase } from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

interface SwitchRoleButtonProps {
  className?: string;
  variant?: "header" | "pill" | "banner";
}

export function SwitchRoleButton({ className, variant = "header" }: SwitchRoleButtonProps) {
  const { currentRole, toggleRole, isClient } = useRole();

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleRole}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all duration-200 active:scale-95 shadow-soft",
          isClient
            ? "bg-client text-white border-client hover:bg-client-hover"
            : "bg-jobber text-slate-900 border-jobber hover:bg-jobber-hover",
          className
        )}
      >
        <ArrowLeftRight className="h-3.5 w-3.5" />
        <span>{isClient ? "Passer en Jobeur" : "Passer en Client"}</span>
      </button>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={cn(
          "flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border transition-all duration-200 shadow-soft",
          isClient
            ? "bg-client-light/70 border-client/20 text-client-dark"
            : "bg-jobber-surface border-jobber/30 text-jobber-dark",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl shadow-soft",
              isClient ? "bg-client text-white" : "bg-jobber text-slate-900"
            )}
          >
            {isClient ? <UserCheck className="h-5 w-5" /> : <Briefcase className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Compte Hybride Actif
            </p>
            <h4 className="font-bold text-sm sm:text-base text-slate-900">
              Vous naviguez actuellement en tant que{" "}
              <span className={cn("font-extrabold", isClient ? "text-client" : "text-amber-800")}>
                {isClient ? "Client (Demandeur)" : "Jobeur (Prestataire Qualifié)"}
              </span>
            </h4>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleRole}
          className={cn(
            "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 active:scale-95 shadow-soft shrink-0",
            isClient
              ? "bg-client text-white hover:bg-client-hover"
              : "bg-jobber text-slate-900 hover:bg-jobber-hover"
          )}
        >
          <ArrowLeftRight className="h-4 w-4" />
          <span>Basculer vers {isClient ? "Espace Jobeur" : "Espace Client"}</span>
        </button>
      </div>
    );
  }

  // Header default variant
  return (
    <button
      type="button"
      onClick={toggleRole}
      title="Bascule instantanée 1-clic de rôle (Client 🔄 Jobeur)"
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 shadow-soft",
        isClient
          ? "border-blue-200 bg-blue-50/80 text-client hover:bg-blue-100 hover:border-client"
          : "border-amber-300 bg-amber-100/90 text-amber-900 hover:bg-amber-200 hover:border-amber-500",
        className
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-lg text-white shadow-soft transition-transform duration-200 group-hover:rotate-180",
          isClient ? "bg-client" : "bg-jobber text-slate-900"
        )}
      >
        <ArrowLeftRight className="h-3 w-3" />
      </span>

      <span className="hidden sm:inline font-medium text-slate-500 text-[11px]">Rôle :</span>
      <span className="font-bold">
        {isClient ? "Client" : "Jobeur"}
      </span>

      <span
        className={cn(
          "h-2 w-2 rounded-full animate-pulse",
          isClient ? "bg-client" : "bg-jobber"
        )}
      />
    </button>
  );
}
