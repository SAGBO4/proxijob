"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  Coins,
  ShieldCheck,
  TrendingUp,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCheck,
  ArrowRight,
  Upload,
  MessageSquare,
  RefreshCw,
} from "lucide-react";
import { formatFCFA, ServiceRequest } from "@/lib/mock-data";
import { SwitchRoleButton } from "@/components/SwitchRoleButton";
import { ProxyTrustBadge } from "@/components/ProxyTrustBadge";
import { ServiceRequestCard } from "@/components/ServiceRequestCard";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { useRole } from "@/context/RoleContext";

export default function JobberDashboardPage() {
  const { user } = useRole();

  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<ServiceRequest[]>([]);
  const [jobberInfo, setJobberInfo] = useState({
    name: user?.name || "Artisan Prestataire",
    trade: "Plomberie & Sanitaire",
    quarter: user?.quarter || "Akpakpa",
    city: user?.city || "Cotonou",
    credits: 25,
    isBoosted: true,
    viewsThisWeek: 48,
    proposalsSent: 6,
    trustBadgeLevel: "CERTIFIED",
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [reqRes, jobberRes] = await Promise.all([
          fetch("/api/demandes"),
          fetch("/api/jobeurs"),
        ]);

        if (reqRes.ok) {
          const reqData = await reqRes.json();
          if (Array.isArray(reqData)) {
            setOpportunities(reqData.filter((r) => r.status === "OPEN"));
          }
        }

        if (jobberRes.ok) {
          const jobbers = await jobberRes.json();
          if (Array.isArray(jobbers) && jobbers.length > 0) {
            const first = jobbers[0];
            setJobberInfo((prev) => ({
              ...prev,
              name: user?.name || first.name,
              trade: first.trade,
              quarter: first.quarter || prev.quarter,
              city: first.city || prev.city,
            }));
          }
        }
      } catch (err) {
        console.error("Erreur chargement dashboard jobeur:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 pb-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* En-tête avec SwitchRoleButton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2.5 py-0.5 rounded-full">
              Espace Artisan & Prestataire
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Tableau de bord Prestataire
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              {jobberInfo.name} • {jobberInfo.trade} ({jobberInfo.quarter}, {jobberInfo.city})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/demandes"
              className="inline-flex items-center gap-1.5 rounded-xl bg-jobber px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 shadow-soft hover:bg-jobber-hover active:scale-[0.98] transition-all"
            >
              <span>Consulter les chantiers</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Bannière de Bascule de Rôle */}
        <SwitchRoleButton variant="banner" />

        {/* Métriques d'activité & Crédits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Crédits de publication */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Solde de Crédits</span>
              <Coins className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {jobberInfo.credits}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Actif
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Permet de répondre à de nouvelles demandes d'interventions locales.
            </p>
          </div>

          {/* Boost de visibilité */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Boost Visibilité Grand Cotonou</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl">
                Actif (7 jours restants)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Votre profil apparaît prioritairement dans les recherches par quartier.
            </p>
          </div>

          {/* Vues du profil */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Consultations Profil</span>
              <Eye className="h-4 w-4 text-client" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {jobberInfo.viewsThisWeek}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +18%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Clients ayant consulté vos avis et votre comparateur Avant/Après.
            </p>
          </div>

          {/* Badge de confiance */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Certification Régalienne</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <ProxyTrustBadge level="LEVEL_3_EXPERT" />
            </div>
            <p className="text-[11px] text-slate-500">
              Pièce CIP & diplôme validés par l'administration ProxiJob.
            </p>
          </div>
        </div>

        {/* Chantiers Réels Disponibles */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Chantiers Ouverts Récents (Neon DB)
              </h2>
              <p className="text-xs text-slate-500">
                Opportunités de prestations publiées par les clients locaux
              </p>
            </div>
            <Link
              href="/demandes"
              className="text-xs font-bold text-client hover:underline flex items-center gap-1"
            >
              <span>Voir toute la bourse</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-border text-slate-500 text-xs">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-client" />
              <span>Chargement des chantiers réels...</span>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-border text-slate-500 text-xs">
              Aucun chantier ouvert pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {opportunities.slice(0, 3).map((req) => (
                <ServiceRequestCard key={req.id} request={req} />
              ))}
            </div>
          )}
        </div>

        {/* Section Portfolio Avant / Après */}
        <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Vos Réalisations "Avant / Après"
              </h2>
              <p className="text-xs text-slate-500">
                Valorisez la qualité de vos finitions pour rassurer les clients de Cotonou et Calavi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <BeforeAfterSlider
                title="Rénovation plomberie sanitaire (Haie Vive)"
                avantUrl="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800"
                apresUrl="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800"
                description="Remplacement tuyauterie et raccordement aux normes"
              />
            </div>

            <div>
              <BeforeAfterSlider
                title="Installation tableau électrique 380V (Fidjrossè)"
                avantUrl="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800"
                apresUrl="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800"
                description="Mise aux normes sécurisée et disjoncteur différentiel"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
