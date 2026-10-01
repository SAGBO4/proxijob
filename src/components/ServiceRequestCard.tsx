"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, Clock, MapPin, Tag, ChevronRight, User } from "lucide-react";
import type { ServiceRequest } from "@/lib/mock-data";
import { formatFCFA } from "@/lib/mock-data";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

interface ServiceRequestCardProps {
  request: ServiceRequest;
  userDistanceKm?: number;
  onPostulateClick?: (request: ServiceRequest) => void;
  className?: string;
}

export function ServiceRequestCard({
  request,
  userDistanceKm,
  onPostulateClick,
  className,
}: ServiceRequestCardProps) {
  const { isJobber } = useRole();
  const displayDistance = userDistanceKm !== undefined ? userDistanceKm : 3.2;

  const getStatusBadge = () => {
    switch (request.status) {
      case "COMPLETED":
        return {
          label: "Terminée",
          style: "bg-emerald-50 text-emerald-800 border-emerald-200",
        };
      case "IN_PROGRESS":
        return {
          label: "En cours",
          style: "bg-amber-50 text-amber-800 border-amber-200",
        };
      case "DISPUTED":
        return {
          label: "En arbitrage",
          style: "bg-red-50 text-red-800 border-red-200",
        };
      case "OPEN":
      default:
        return {
          label: "Ouverte aux devis",
          style: "bg-blue-50 text-client border-blue-200",
        };
    }
  };

  const status = getStatusBadge();

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-soft transition-all duration-200 hover:border-slate-300 hover:shadow-soft-md",
        request.isUrgent ? "border-l-4 border-l-red-500" : "",
        className
      )}
    >
      <div>
        {/* En-tête : Urgence + Statut + Réf */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {request.isUrgent && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-700 border border-red-200 animate-pulse">
                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                <span>URGENT &lt; 2H</span>
              </span>
            )}

            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                status.style
              )}
            >
              {status.label}
            </span>

            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              {request.subcategory || request.category}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            #{request.id.slice(-6)}
          </span>
        </div>

        {/* Titre & Auteur */}
        <div className="mt-3">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-client transition-colors leading-snug">
            {request.title}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-slate-400" />
              <span>Publiée par {request.clientName}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-400" />
              <span>{request.deadline}</span>
            </span>
          </div>
        </div>

        {/* Localisation sans carte (ACC-02 & ACC-03) */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50/80 px-2.5 py-1 text-client font-medium border border-blue-100">
            <MapPin className="h-3.5 w-3.5 text-client shrink-0" />
            <span>
              {request.quarter}, {request.city} (<strong>~{displayDistance} km</strong>)
            </span>
          </span>

          {request.landmark && (
            <span className="text-slate-500 italic text-[11px]">
              Repère : « {request.landmark} »
            </span>
          )}
        </div>

        {/* Description du besoin */}
        <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {request.description}
        </p>

        {/* Photos associées si existantes */}
        {request.photos && request.photos.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">
              {request.photos.length} photo(s) jointe(s)
            </span>
          </div>
        )}
      </div>

      {/* Pied de Carte : Budget indicatif + Action */}
      <div className="mt-5 pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Budget indicatif Client
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            {formatFCFA(request.estimatedBudget)}
          </span>
          <span className="text-[11px] text-slate-500 ml-1.5 font-medium">
            ({request.proposalsCount} devis reçu{request.proposalsCount > 1 ? "s" : ""})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isJobber ? (
            <button
              type="button"
              onClick={() => onPostulateClick ? onPostulateClick(request) : alert(`Postuler à la demande : ${request.title}`)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-jobber px-4 py-2 text-xs font-bold text-slate-900 shadow-soft hover:bg-jobber-hover active:scale-[0.98] transition-all"
            >
              <span>Envoyer un devis</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <Link
              href={`/demandes`}
              className="inline-flex items-center gap-1 rounded-xl bg-client px-3.5 py-2 text-xs font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
            >
              <span>Consulter l'offre</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
