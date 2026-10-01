"use client";

import React, { useState } from "react";
import { MapPin, Search, SlidersHorizontal, Navigation, ShieldCheck } from "lucide-react";
import { BENIN_COMMUNES, CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export interface FilterState {
  searchQuery: string;
  commune: string;
  quarter: string;
  radiusKm: number;
  category: string;
  verifiedOnly: boolean;
  minRating: number;
}

interface ProximityFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
  compact?: boolean;
}

export function ProximityFilter({
  filters,
  onFilterChange,
  className,
  compact = false,
}: ProximityFilterProps) {
  const [selectedCommune, setSelectedCommune] = useState(filters.commune);

  const selectedCommuneData = BENIN_COMMUNES.find((c) => c.name === selectedCommune);
  const availableQuarters = selectedCommuneData ? selectedCommuneData.quarters : [];

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCommune(val);
    onFilterChange({
      ...filters,
      commune: val,
      quarter: "", // reset quarter when commune changes
    });
  };

  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...filters,
      quarter: e.target.value,
    });
  };

  const handleRadiusChange = (radius: number) => {
    onFilterChange({
      ...filters,
      radiusKm: radius,
    });
  };

  const radiusOptions = [
    { label: "2 km (Direct)", value: 2 },
    { label: "5 km (Quartier)", value: 5 },
    { label: "10 km (Agglo)", value: 10 },
    { label: "25 km (Grand Pôle)", value: 25 },
  ];

  if (compact) {
    return (
      <div className={cn("rounded-2xl border border-border bg-white p-3 sm:p-4 shadow-soft", className)}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-2 rounded-xl border border-input px-3.5 py-2.5 text-sm focus-within:border-client bg-white">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Métier (Plombier, Électricien...)"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              className="w-full text-sm outline-none placeholder:text-slate-400 bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-input px-3.5 py-2.5 text-sm focus-within:border-client bg-white">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={filters.commune}
              onChange={handleCommuneChange}
              className="w-full text-sm outline-none bg-transparent text-slate-800"
            >
              <option value="">Toutes les communes</option>
              {BENIN_COMMUNES.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name} ({c.department})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-input px-3.5 py-2.5 text-sm focus-within:border-client bg-white">
            <Navigation className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={filters.quarter}
              onChange={handleQuarterChange}
              disabled={!selectedCommune}
              className="w-full text-sm outline-none bg-transparent text-slate-800 disabled:text-slate-400"
            >
              <option value="">{selectedCommune ? "Tous les quartiers" : "Choisissez d'abord une ville"}</option>
              {availableQuarters.map((q) => (
                <option key={q.slug} value={q.name}>
                  {q.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {radiusOptions.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRadiusChange(r.value)}
                className={cn(
                  "px-3 py-2 text-xs font-semibold rounded-xl border transition-all duration-150 whitespace-nowrap active:scale-95",
                  filters.radiusKm === r.value
                    ? "bg-client text-white border-client shadow-soft"
                    : "bg-slate-50 text-slate-700 border-border hover:bg-slate-100"
                )}
              >
                {r.value} km
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Panneau latéral complet de filtres sans carte (Desktop + Drawer Mobile)
  return (
    <div className={cn("rounded-2xl border border-border bg-white p-5 shadow-soft space-y-6", className)}>
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <SlidersHorizontal className="h-4 w-4 text-client" />
          <span>Filtres de Proximité</span>
        </div>
        <button
          type="button"
          onClick={() =>
            onFilterChange({
              searchQuery: "",
              commune: "",
              quarter: "",
              radiusKm: 10,
              category: "",
              verifiedOnly: false,
              minRating: 0,
            })
          }
          className="text-xs text-client font-semibold hover:underline"
        >
          Réinitialiser
        </button>
      </div>

      {/* Recherche par mot-clé */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Métier ou Compétence
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-input px-3.5 py-2.5 text-sm focus-within:border-client bg-white">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Ex: Climatisation, Fuite..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            className="w-full text-sm outline-none placeholder:text-slate-400 bg-transparent"
          />
        </div>
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Secteur d'activité
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm bg-white text-slate-800 focus:border-client outline-none"
        >
          <option value="">Tous les secteurs</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Commune / Ville béninoise */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Commune / Ville
        </label>
        <select
          value={filters.commune}
          onChange={handleCommuneChange}
          className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm bg-white text-slate-800 focus:border-client outline-none"
        >
          <option value="">Toutes les communes</option>
          {BENIN_COMMUNES.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name} ({c.department})
            </option>
          ))}
        </select>
      </div>

      {/* Quartier textuel */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Quartier de référence
        </label>
        <select
          value={filters.quarter}
          onChange={handleQuarterChange}
          disabled={!selectedCommune}
          className="w-full rounded-xl border border-input px-3.5 py-2.5 text-sm bg-white text-slate-800 focus:border-client outline-none disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">{selectedCommune ? "Tous les quartiers" : "Sélectionnez d'abord la commune"}</option>
          {availableQuarters.map((q) => (
            <option key={q.slug} value={q.name}>
              {q.name}
            </option>
          ))}
        </select>
      </div>

      {/* Rayon dynamique sans carte (ACC-04) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold uppercase tracking-wider text-slate-600">
            Rayon de proximité
          </label>
          <span className="font-bold text-client bg-client-light px-2 py-0.5 rounded-md">
            ~{filters.radiusKm} km
          </span>
        </div>
        <input
          type="range"
          min="2"
          max="25"
          step="1"
          value={filters.radiusKm}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="w-full accent-client h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="grid grid-cols-4 gap-1 text-[11px] text-center font-medium">
          {radiusOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleRadiusChange(opt.value)}
              className={cn(
                "py-1 rounded border transition-colors",
                filters.radiusKm === opt.value
                  ? "bg-client text-white border-client"
                  : "bg-slate-50 text-slate-600 border-border hover:bg-slate-100"
              )}
            >
              {opt.value} km
            </button>
          ))}
        </div>
      </div>

      {/* Confiance ProxyTrust V3 */}
      <div className="pt-2 border-t border-border space-y-3">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onFilterChange({ ...filters, verifiedOnly: e.target.checked })}
            className="rounded border-input text-emerald-600 focus:ring-emerald-500 h-4 w-4"
          />
          <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Artisans certifiés ProxyTrust uniquement
          </span>
        </label>

        {/* Note minimale */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600">Note minimale :</span>
          <div className="flex gap-1">
            {[0, 4, 4.5, 4.8].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => onFilterChange({ ...filters, minRating: score })}
                className={cn(
                  "px-2 py-1 rounded text-[11px] font-semibold border transition-all",
                  filters.minRating === score
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : "bg-slate-50 text-slate-600 border-border"
                )}
              >
                {score === 0 ? "Tous" : `${score}★+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info data save */}
      <div className="rounded-xl bg-blue-50/60 p-3 text-[11px] text-blue-900 border border-blue-100 leading-relaxed">
        ⚡ <strong>Sans Carte V1 :</strong> Économise jusqu'à 80% de votre forfait data mobile en se basant sur les repères textuels réels du Bénin.
      </div>
    </div>
  );
}
