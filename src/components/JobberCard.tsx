"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Clock, MessageSquare, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import type { Jobber } from "@/lib/mock-data";
import { formatFCFA } from "@/lib/mock-data";
import { ProxyTrustBadge } from "./ProxyTrustBadge";
import { RatingStars } from "./RatingStars";
import { cn } from "@/lib/utils";

interface JobberCardProps {
  jobber: Jobber;
  userDistanceKm?: number;
  onContactClick?: (jobber: Jobber) => void;
  className?: string;
}

export function JobberCard({
  jobber,
  userDistanceKm,
  onContactClick,
  className,
}: JobberCardProps) {
  const displayDistance = userDistanceKm !== undefined ? userDistanceKm : 2.4;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft-md",
        className
      )}
    >
      <div>
        {/* En-tête : Avatar + Identité + Note */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="relative">
              <img
                src={jobber.avatar}
                alt={jobber.name}
                className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shadow-soft"
              />
              {jobber.isAvailable && (
                <span
                  title="Disponible immédiatement"
                  className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 border-2 border-white"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                </span>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Link
                  href={`/jobeurs/${jobber.id}`}
                  className="font-bold text-slate-900 text-base hover:text-client transition-colors line-clamp-1"
                >
                  {jobber.name}
                </Link>
                {jobber.legalStatus === "ENTREPRISE" && (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                    Pro
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-600">
                {jobber.trade}
              </p>

              {/* Localisation sans carte (ACC-02 & ACC-03) */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                <MapPin className="h-3.5 w-3.5 text-client shrink-0" />
                <span className="truncate">
                  {jobber.quarter}, {jobber.city} •{" "}
                  <strong className="text-client font-semibold">~{displayDistance} km</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Évaluation */}
          <div className="shrink-0 text-right">
            <RatingStars
              rating={jobber.averageRating}
              totalReviews={jobber.totalReviews}
              size="sm"
            />
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
              {jobber.completedJobs} missions finies
            </div>
          </div>
        </div>

        {/* Badges de Confiance & Repère */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <ProxyTrustBadge level={jobber.trustBadge} variant="compact" />

          {jobber.landmark && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 border border-slate-200/80 truncate max-w-[220px]">
              <span>📍 Repère :</span>
              <span className="font-medium truncate">{jobber.landmark}</span>
            </span>
          )}

          {jobber.isAvailable && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 border border-amber-200/60">
              <Zap className="h-3 w-3 text-amber-600" />
              <span>Intervention rapide</span>
            </span>
          )}
        </div>

        {/* Bio concise */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {jobber.headline || jobber.bio}
        </p>

        {/* Compétences / Spécialités */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {jobber.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100/80 px-2 py-0.5 text-[11px] text-slate-700 font-medium"
            >
              {skill}
            </span>
          ))}
          {jobber.skills.length > 3 && (
            <span className="text-[11px] text-slate-400 self-center">
              +{jobber.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Pied de Carte : Tarif + Actions */}
      <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-wider">
            Tarif indicatif
          </span>
          <span className="text-sm font-bold text-slate-900">
            Dès {formatFCFA(jobber.startingPrice || jobber.hourlyRate)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/jobeurs/${jobber.id}`}
            className="rounded-xl border border-input px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Voir profil
          </Link>

          <button
            type="button"
            onClick={() => onContactClick ? onContactClick(jobber) : (window.location.href = `/jobeurs/${jobber.id}?contact=true`)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-client px-3.5 py-2 text-xs font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Contacter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
