"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  AlertCircle,
  MapPin,
  Search,
  Loader2,
} from "lucide-react";
import { BENIN_COMMUNES, calculateDistanceKm, type ServiceRequest } from "@/lib/mock-data";
import { ServiceRequestCard } from "@/components/ServiceRequestCard";
import { useRole } from "@/context/RoleContext";

export default function DemandesPage() {
  const { isClient, isJobber, user } = useRole();

  const [requestsList, setRequestsList] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Chargement réel depuis Neon PostgreSQL via /api/demandes
  useEffect(() => {
    setLoading(true);
    fetch("/api/demandes")
      .then((res) => res.json())
      .then((json) => {
        if (json.data && Array.isArray(json.data)) {
          setRequestsList(json.data);
        }
      })
      .catch((err) => console.error("Erreur chargement demandes:", err))
      .finally(() => setLoading(false));
  }, []);

  // Référence géographique sans carte de l'utilisateur actif (Fidjrossè, Cotonou)
  const userRefCoords = useMemo(() => {
    if (selectedCommune) {
      const communeData = BENIN_COMMUNES.find(
        (c) => c.name.toLowerCase() === selectedCommune.toLowerCase()
      );
      if (communeData) {
        return { lat: communeData.latitude, lon: communeData.longitude };
      }
    }
    return { lat: 6.3591, lon: 2.3789 };
  }, [selectedCommune]);

  const filteredRequests = useMemo(() => {
    return requestsList
      .map((req) => {
        const distance = calculateDistanceKm(
          userRefCoords.lat,
          userRefCoords.lon,
          req.latitude,
          req.longitude
        );
        return { request: req, distance };
      })
      .filter(({ request: req }) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = req.title.toLowerCase().includes(q);
          const matchDesc = req.description.toLowerCase().includes(q);
          const matchQuarter = req.quarter.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchQuarter) return false;
        }

        if (selectedCommune && req.city.toLowerCase() !== selectedCommune.toLowerCase()) {
          return false;
        }

        if (
          selectedCategory &&
          !((req as any).categoryName || req.category || "")
            .toLowerCase()
            .includes(selectedCategory.toLowerCase())
        ) {
          return false;
        }

        if (urgentOnly && !(req as any).estUrgent && !req.isUrgent) {
          return false;
        }

        if (selectedStatus !== "ALL" && req.status !== selectedStatus) {
          return false;
        }

        return true;
      });
  }, [requestsList, searchQuery, selectedCommune, selectedCategory, urgentOnly, selectedStatus, userRefCoords]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête de la bourse des demandes */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-client uppercase tracking-wider mb-1">
              <FileText className="h-3.5 w-3.5" />
              <span>Bourse Locale des Demandes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Besoins & Opportunités d'Intervention
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Découvrez les demandes déposées par des particuliers et entreprises à Cotonou, Calavi et Porto-Novo.
            </p>
          </div>

          <Link
            href="/demandes/nouvelle"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-client px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all shrink-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Publier un nouveau besoin</span>
          </Link>
        </div>

        {/* Barre de filtres rapide */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft mb-6 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus-within:border-client">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher un besoin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm outline-none placeholder:text-slate-400 bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus-within:border-client">
              <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
              <select
                value={selectedCommune}
                onChange={(e) => setSelectedCommune(e.target.value)}
                className="w-full text-xs sm:text-sm outline-none bg-transparent text-slate-800"
              >
                <option value="">Toutes les communes</option>
                {BENIN_COMMUNES.map((c) => (
                  <option key={c.slug} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus-within:border-client">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full text-xs sm:text-sm outline-none bg-transparent text-slate-800"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="OPEN">Ouvertes (en attente)</option>
                <option value="IN_PROGRESS">En cours</option>
                <option value="COMPLETED">Terminées</option>
              </select>
            </div>

            {/* Toggle Urgence < 2h */}
            <label className="flex items-center justify-between sm:justify-start gap-2.5 rounded-xl border border-slate-200 px-3.5 py-2.5 bg-slate-50 cursor-pointer select-none">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={urgentOnly}
                  onChange={(e) => setUrgentOnly(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 h-4 w-4"
                />
                <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Urgences &lt; 2h</span>
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Compteur & Listing */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-client" />
                  Chargement des demandes en cours...
                </span>
              ) : (
                <>
                  {filteredRequests.length} demande{filteredRequests.length > 1 ? "s" : ""} active{filteredRequests.length > 1 ? "s" : ""} dans la base
                </>
              )}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2].map((n) => (
                <div key={n} className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse">
                  <div className="h-5 bg-slate-200 rounded w-2/3 mb-3" />
                  <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                  <div className="h-4 bg-slate-200 rounded w-4/5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {filteredRequests.map(({ request, distance }) => (
                <ServiceRequestCard key={request.id} request={request} userDistanceKm={distance} />
              ))}
            </div>
          )}

          {!loading && filteredRequests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-soft">
              <FileText className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="font-bold text-slate-900 text-base">Aucune demande trouvée</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Modifiez vos critères de recherche ou soyez le premier à poster un besoin dans cette zone.
              </p>
              <Link
                href="/demandes/nouvelle"
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-client px-4 py-2 text-xs font-bold text-white shadow-soft"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Publier une demande</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
