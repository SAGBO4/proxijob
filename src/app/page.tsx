"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Wrench,
  MapPin,
  Star,
  Clock,
  UserCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  Hammer,
  Scissors,
  Car,
  Laptop,
  Home as HomeIcon,
  ChevronRight,
  Shield,
  Smartphone,
  Award,
} from "lucide-react";
import { MOCK_JOBBERS, CATEGORIES, BENIN_COMMUNES } from "@/lib/mock-data";
import { JobberCard } from "@/components/JobberCard";
import { SwitchRoleButton } from "@/components/SwitchRoleButton";
import { useRole } from "@/context/RoleContext";

export default function Home() {
  const { isClient, isJobber, toggleRole } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("Cotonou");

  // Icon mapping for categories
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Hammer":
        return <Hammer className="h-6 w-6 text-client" />;
      case "Scissors":
        return <Scissors className="h-6 w-6 text-amber-600" />;
      case "Car":
        return <Car className="h-6 w-6 text-blue-600" />;
      case "Laptop":
        return <Laptop className="h-6 w-6 text-purple-600" />;
      case "Home":
      default:
        return <HomeIcon className="h-6 w-6 text-emerald-600" />;
    }
  };

  const featuredJobbers = MOCK_JOBBERS.slice(0, 3);

  const testimonials = [
    {
      name: "Mme Clarisse Agbodo",
      role: "Particulière à Cotonou (Haie Vive)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      content:
        "J'avais une fuite d'eau critique sous l'évier un dimanche matin. Grâce à ProxiJob, Sébastien est intervenu en 30 minutes. Le masquage des coordonnées avant de valider le devis m'a mise en totale confiance.",
      rating: 5,
      tag: "Plomberie d'urgence",
    },
    {
      name: "Bio Bio Gounou",
      role: "Technicien Réseau & Utilisateur Hybride",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
      content:
        "La bascule en 1 clic entre mode Client et mode Jobeur est géniale ! Je trouve des chantiers d'installation Wi-Fi près de Fidjrossè la journée, et je commande des services pour ma maison le soir.",
      rating: 5,
      tag: "Profil Hybride Actif",
    },
    {
      name: "Brice Hounnou",
      role: "Gérant Hounnou Énergie SARL (Calavi)",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
      content:
        "La certification ProxyTrust via notre RCCM et IFU a boosté nos demandes de 200%. Les clients savent qu'ils traitent avec des professionnels sérieux et les tarifs sont clairs dès le départ.",
      rating: 5,
      tag: "Électricité & Solaire",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION AVEC DOUBLE ENTRÉE & RECHERCHE SANS CARTE */}
      <section className="relative overflow-hidden py-10 sm:py-20 bg-gradient-to-b from-blue-50/60 via-slate-50/30 to-background border-b border-border/60">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge de réassurance nationale */}
          <div className="inline-flex items-center gap-2 rounded-full border border-client/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-client shadow-soft mb-4 sm:mb-6 transition-transform duration-150 hover:scale-105">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="truncate">Marketplace d'artisans certifiés — Bénin</span>
          </div>

          {/* Titre héroïque dimensionné mobile */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Trouvez un artisan qualifié <br />
            <span className="text-client">à deux pas de chez vous</span>
          </h1>

          <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-xs sm:text-base text-slate-600 leading-relaxed">
            Plomberie, électricité, froid, couture, mécanique ou maçonnerie. Contactez des professionnels vérifiés à Cotonou, Calavi et Porto-Novo <strong>sans carte interactive lourde</strong>.
          </p>

          {/* Onglets Double Entrée : Je cherche un artisan vs Je propose mes services */}
          <div className="mt-6 sm:mt-8 flex justify-center w-full">
            <div className="grid grid-cols-2 w-full max-w-sm sm:w-auto sm:inline-flex rounded-2xl bg-slate-200/70 p-1 sm:p-1.5 shadow-soft-inner gap-1">
              <button
                type="button"
                onClick={() => isJobber && toggleRole()}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isClient
                    ? "bg-client text-white shadow-soft"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Je cherche un artisan</span>
              </button>
              <button
                type="button"
                onClick={() => isClient && toggleRole()}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isJobber
                    ? "bg-jobber text-slate-900 shadow-soft"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                <span className="truncate">Je propose mes services</span>
              </button>
            </div>
          </div>

          {/* Moteur de recherche immédiat de proximité textuel (ACC-02 & ACC-03) */}
          <div className="mx-auto mt-5 sm:mt-6 max-w-3xl rounded-2xl border border-border bg-white p-3 sm:p-4 shadow-soft-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/jobeurs?search=${encodeURIComponent(searchQuery)}&commune=${encodeURIComponent(selectedCommune)}`;
              }}
              className="flex flex-col sm:flex-row gap-2.5 sm:gap-3"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-input px-3.5 py-2.5 sm:py-3 text-left focus-within:border-client bg-white flex-1 min-h-[44px]">
                <Wrench className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Métier (ex: Plombier, Électricien)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs sm:text-sm outline-none placeholder:text-slate-400 bg-transparent text-slate-800"
                />
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-input px-3.5 py-2.5 sm:py-3 text-left focus-within:border-client bg-white sm:w-56 min-h-[44px]">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={selectedCommune}
                  onChange={(e) => setSelectedCommune(e.target.value)}
                  className="w-full text-xs sm:text-sm outline-none bg-transparent text-slate-800 cursor-pointer"
                >
                  {BENIN_COMMUNES.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name} ({c.department})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-client px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all min-h-[44px] shrink-0"
              >
                <Search className="h-4 w-4" />
                <span>Rechercher</span>
              </button>
            </form>

            {/* Suggestions de recherche courantes au Bénin */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Populaires :</span>
              {[
                { label: "Plomberie Akpakpa", search: "Plombier", commune: "Cotonou" },
                { label: "Climatisation Calavi", search: "Climatisation", commune: "Abomey-Calavi" },
                { label: "Électricité Fidjrossè", search: "Électricien", commune: "Cotonou" },
                { label: "Couture Kanvo", search: "Couture", commune: "Cotonou" },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={`/jobeurs?search=${encodeURIComponent(s.search)}&commune=${encodeURIComponent(s.commune)}`}
                  className="rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-client px-2 py-1 text-slate-700 transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bandeau repère & low data */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
              <span>Zéro carte (Économe forfait data)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
              <span>Avis certifiés réels</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
              <span>Paiement libre direct</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. CATÉGORIES DE MÉTIERS POPULAIRES */}
      <section className="py-10 sm:py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-client uppercase tracking-wider mb-1">
                <Award className="h-3.5 w-3.5" />
                <span>Savoir-faire locaux</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900">
                Explorez les métiers d'excellence au Bénin
              </h2>
            </div>
            <Link
              href="/jobeurs"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-client hover:underline self-start sm:self-auto"
            >
              <span>Voir tous les artisans</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/jobeurs?category=${cat.slug}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-slate-50/50 p-3.5 sm:p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-client/40 hover:bg-white hover:shadow-soft-md"
              >
                <div>
                  <div className="mb-2 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-white shadow-soft group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-base group-hover:text-client transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="mt-1 text-[11px] sm:text-xs text-slate-500 line-clamp-2 leading-relaxed hidden sm:block">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-border/80 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-client">
                  <span>{cat.subcategories.length} spécialités</span>
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ARTISANS VÉRIFIÉS DU QUARTIER (FEATURED JOBBERS) */}
      <section className="py-14 sm:py-20 bg-slate-50/60 border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Confiance ProxyTrust certifiée</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Artisans recommandés près de chez vous
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Profils avec pièces officielles vérifiées et avis 100% réels post-prestation.
              </p>
            </div>
            <Link
              href="/jobeurs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-client hover:underline"
            >
              <span>Découvrir tout le catalogue</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobbers.map((jobber) => (
              <JobberCard key={jobber.id} jobber={jobber} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMMENT ÇA MARCHE (DOUBLE PARCOURS CLIENT & JOBEUR) */}
      <section id="comment-ca-marche" className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-client">
              Simplicité & Sécurité
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Comment fonctionne PROXIJOB ?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Un parcours transparent en 3 étapes simples pour particuliers et professionnels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-2xl border border-border bg-slate-50/50 p-6 shadow-soft hover:shadow-soft-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-client text-white font-bold text-lg shadow-soft mb-5">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Décrivez votre besoin
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Remplissez notre formulaire wizard en moins de 90 secondes : précisez votre quartier béninois, le repère visuel (ex : « face pharmacie ») et le degré d'urgence.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border bg-slate-50/50 p-6 shadow-soft hover:shadow-soft-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-jobber text-slate-900 font-bold text-lg shadow-soft mb-5">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Comparez les devis locaux
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Les artisans de proximité vous transmettent des propositions transparentes en FCFA. Échangez en messagerie sécurisée avec masquage algorithmique de vos coordonnées.
              </p>
            </div>

            <div className="relative rounded-2xl border border-border bg-slate-50/50 p-6 shadow-soft hover:shadow-soft-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-lg shadow-soft mb-5">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Validez & Évaluez
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Acceptez le devis en 1 clic : vos coordonnées sont immédiatement débloquées. Une fois l'intervention achevée, laissez une note certifiée pour guider la communauté.
              </p>
            </div>
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href="/demandes/nouvelle"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-client px-6 py-3.5 text-sm font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
            >
              <span>Publier une demande maintenant</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. TÉMOIGNAGES BÉNINOIS (PREUVE SOCIALE) */}
      <section className="py-12 sm:py-20 bg-slate-50 border-t border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              Retours d'expérience
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Adopté par les ménages et artisans au Bénin
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-soft"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-client">
                      {t.tag}
                    </span>
                    <div className="flex text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                    « {t.content} »
                  </p>
                </div>

                <div className="mt-5 sm:mt-6 pt-4 border-t border-border flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BANNIÈRE APPEL À L'ACTION POUR REJOINDRE PROXIJOB */}
      <section className="py-12 sm:py-20 bg-client text-white">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-4xl font-extrabold">
            Vous êtes un artisan qualifié à Cotonou, Calavi ou Porto-Novo ?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs sm:text-base text-blue-100 leading-relaxed">
            Rejoignez notre réseau officiel d'artisans certifiés, valorisez vos réalisations Avant/Après et recevez des opportunités de chantiers qualifiés sans frais cachés.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/demandes"
              className="w-full sm:w-auto text-center rounded-xl bg-jobber px-6 py-3.5 text-sm font-bold text-slate-900 shadow-soft hover:bg-jobber-hover active:scale-[0.98] transition-all"
            >
              Consulter les demandes en cours
            </Link>
            <button
              type="button"
              onClick={toggleRole}
              className="w-full sm:w-auto text-center rounded-xl border border-white/40 bg-white/10 backdrop-blur px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 active:scale-[0.98] transition-all"
            >
              Basculer en Mode {isClient ? "Jobeur" : "Client"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
