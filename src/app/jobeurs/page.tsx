"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowUpDown,
  Filter,
  X,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { MOCK_JOBBERS, BENIN_COMMUNES, calculateDistanceKm } from "@/lib/mock-data";
import { JobberCard } from "@/components/JobberCard";
import { ProximityFilter, FilterState } from "@/components/ProximityFilter";

function JobeursContent() {
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialCommune = searchParams.get("commune") || "";
  const initialCategory = searchParams.get("category") || "";

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearch,
    commune: initialCommune,
    quarter: "",
    radiusKm: 15,
    category: initialCategory,
    verifiedOnly: false,
    minRating: 0,
  });

  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "price_asc">("relevance");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Référence géographique sans carte pour le calcul Haversine (ACC-03, ACC-04)
  const userRefCoords = useMemo(() => {
    if (filters.commune) {
      const communeData = BENIN_COMMUNES.find(
        (c) => c.name.toLowerCase() === filters.commune.toLowerCase()
      );
      if (communeData) {
        if (filters.quarter) {
          const quarterData = communeData.quarters.find(
            (q) => q.name.toLowerCase() === filters.quarter.toLowerCase()
          );
          if (quarterData) return { lat: quarterData.latitude, lon: quarterData.longitude };
        }
        return { lat: communeData.latitude, lon: communeData.longitude };
      }
    }
    // Barycentre par défaut de l'utilisateur actif (Fidjrossè, Cotonou)
    return { lat: 6.3591, lon: 2.3789 };
  }, [filters.commune, filters.quarter]);

  // Filtrage dynamique sans carte (ACC-02, ACC-03, ACC-04)
  const filteredJobbers = useMemo(() => {
    return MOCK_JOBBERS.map((jobber) => {
      const distance = calculateDistanceKm(
        userRefCoords.lat,
        userRefCoords.lon,
        jobber.latitude,
        jobber.longitude
      );
      return { jobber, distance };
    })
      .filter(({ jobber, distance }) => {
        // 1. Recherche textuelle libre
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchName = jobber.name.toLowerCase().includes(query);
          const matchTrade = jobber.trade.toLowerCase().includes(query);
          const matchSkills = jobber.skills.some((s) => s.toLowerCase().includes(query));
          const matchHeadline = jobber.headline.toLowerCase().includes(query);
          if (!matchName && !matchTrade && !matchSkills && !matchHeadline) {
            return false;
          }
        }

        // 2. Commune
        if (filters.commune && jobber.city.toLowerCase() !== filters.commune.toLowerCase()) {
          return false;
        }

        // 3. Quartier
        if (filters.quarter && !jobber.quarter.toLowerCase().includes(filters.quarter.toLowerCase())) {
          return false;
        }

        // 4. Catégorie
        if (filters.category && jobber.categorySlug !== filters.category) {
          return false;
        }

        // 5. ProxyTrust vérifié uniquement
        if (filters.verifiedOnly && (!jobber.isVerified || jobber.trustBadge === "LEVEL_1_PHONE")) {
          return false;
        }

        // 6. Note minimale
        if (filters.minRating > 0 && jobber.averageRating < filters.minRating) {
          return false;
        }

        // 7. Rayon de proximité dynamique sans carte (ACC-04)
        if (filters.radiusKm && distance > filters.radiusKm) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") {
          return b.jobber.averageRating - a.jobber.averageRating;
        }
        if (sortBy === "price_asc") {
          return a.jobber.startingPrice - b.jobber.startingPrice;
        }
        // Par défaut pertinence : plus grand nombre de missions réussies
        return b.jobber.completedJobs - a.jobber.completedJobs;
      });
  }, [filters, sortBy, userRefCoords]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête de la page */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-client uppercase tracking-wider mb-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>Répertoire Géolocalisé Sans Carte</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Artisans & Professionnels de Proximité
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Trouvez les meilleurs spécialistes à Cotonou, Calavi et Porto-Novo avec repères réels.
              </p>
            </div>

            {/* Tri & Déclencheur Drawer Mobile */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 rounded-xl border border-input bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-soft"
              >
                <SlidersHorizontal className="h-4 w-4 text-client" />
                <span>Filtres ({filteredJobbers.length})</span>
              </button>

              <div className="flex items-center gap-2 rounded-xl border border-input bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span className="hidden sm:inline text-slate-500">Trier par :</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent outline-none font-bold text-slate-900 cursor-pointer"
                >
                  <option value="relevance">Pertinence & Missions</option>
                  <option value="rating">Meilleures notes (★)</option>
                  <option value="price_asc">Tarif croissant</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grille Principale 2 Colonnes Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Colonne Gauche : Filtres de Proximité Desktop */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <ProximityFilter filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Colonne Droite : Résultats */}
          <main className="lg:col-span-8 space-y-5">
            {/* Compteur de résultats */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 bg-white p-3.5 rounded-xl border border-border shadow-soft">
              <span>
                <strong>{filteredJobbers.length}</strong> artisan{filteredJobbers.length > 1 ? "s" : ""} trouvé{filteredJobbers.length > 1 ? "s" : ""}{" "}
                {filters.commune ? `à ${filters.commune}` : "au Bénin"}
              </span>

              {filters.verifiedOnly && (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  ProxyTrust uniquement
                </span>
              )}
            </div>

            {/* Liste des cartes Jobeurs */}
            {filteredJobbers.length > 0 ? (
              <div className="space-y-4">
                {filteredJobbers.map(({ jobber, distance }) => (
                  <JobberCard key={jobber.id} jobber={jobber} userDistanceKm={distance} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-soft">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-client mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Aucun artisan ne correspond à ces critères
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Essayez d'élargir le rayon de recherche, de sélectionner une autre commune ou de réinitialiser vos filtres.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setFilters({
                      searchQuery: "",
                      commune: "",
                      quarter: "",
                      radiusKm: 15,
                      category: "",
                      verifiedOnly: false,
                      minRating: 0,
                    })
                  }
                  className="mt-5 rounded-xl bg-client px-5 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-client-hover transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Drawer Mobile pour Filtres */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm h-full bg-white p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <SlidersHorizontal className="h-4 w-4 text-client" />
                  <span>Filtrer les Jobeurs</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ProximityFilter filters={filters} onFilterChange={setFilters} />
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full rounded-xl bg-client py-3 text-xs font-bold text-white shadow-soft"
              >
                Voir les {filteredJobbers.length} résultats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JobeursPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50/50 py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-client border-r-transparent" />
            <p className="text-xs font-semibold text-slate-500">Chargement de l'annuaire des artisans...</p>
          </div>
        </div>
      }
    >
      <JobeursContent />
    </Suspense>
  );
}
