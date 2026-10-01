import React from "react";
import { ShieldCheck, ShieldAlert, Award, Smartphone } from "lucide-react";
import type { TrustLevel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ProxyTrustBadgeProps {
  level: TrustLevel;
  variant?: "compact" | "detailed" | "banner";
  className?: string;
}

export function ProxyTrustBadge({
  level,
  variant = "compact",
  className,
}: ProxyTrustBadgeProps) {
  const getBadgeDetails = () => {
    switch (level) {
      case "LEVEL_3_EXPERT":
        return {
          label: "Expert Agréé ProxyTrust",
          shortLabel: "ProxyTrust Expert",
          description: "Diplôme vérifié & Entreprise enregistrée (RCCM / IFU)",
          bgColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
          iconColor: "text-emerald-600",
          Icon: Award,
        };
      case "LEVEL_2_IDENTITY":
        return {
          label: "Identité Vérifiée ANIP/CIP",
          shortLabel: "ProxyTrust CIP",
          description: "Certificat d'Identification Personnelle (CIP / CNI) vérifié",
          bgColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
          iconColor: "text-emerald-600",
          Icon: ShieldCheck,
        };
      case "LEVEL_1_PHONE":
      default:
        return {
          label: "Téléphone Vérifié",
          shortLabel: "ProxyTrust Tél",
          description: "Numéro de téléphone béninois validé par code SMS OTP",
          bgColor: "bg-blue-50 text-blue-800 border-blue-200",
          iconColor: "text-client",
          Icon: Smartphone,
        };
    }
  };

  const { label, shortLabel, description, bgColor, iconColor, Icon } = getBadgeDetails();

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-soft transition-all duration-150",
          bgColor,
          className
        )}
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", iconColor)} />
        <span>{shortLabel}</span>
      </span>
    );
  }

  if (variant === "detailed") {
    return (
      <div
        className={cn(
          "flex items-start gap-3 p-3.5 rounded-xl border shadow-soft",
          bgColor,
          className
        )}
      >
        <div className="p-2 rounded-lg bg-white/80 shadow-soft shrink-0">
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{label}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-900">
              ProxyTrust V3
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-soft bg-emerald-50 border-emerald-200/80",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-soft">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">Artisan Certifié ProxyTrust Bénin</h4>
            <span className="rounded-full bg-emerald-600 text-white px-2 py-0.5 text-[11px] font-semibold">
              Officiel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Pièce d'identité nationale (CIP/CNI) et références de qualification vérifiées par nos modérateurs.
          </p>
        </div>
      </div>
    </div>
  );
}
