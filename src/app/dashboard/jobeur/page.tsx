"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Coins,
  ShieldCheck,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCheck,
  ArrowRight,
  Upload,
  MessageSquare,
} from "lucide-react";
import {
  MOCK_JOBBERS,
  MOCK_REQUESTS,
  formatFCFA,
  ServiceRequest,
} from "@/lib/mock-data";
import { SwitchRoleButton } from "@/components/SwitchRoleButton";
import { ProxyTrustBadge } from "@/components/ProxyTrustBadge";
import { ServiceRequestCard } from "@/components/ServiceRequestCard";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { useRole } from "@/context/RoleContext";

export default function JobberDashboardPage() {
  const { user } = useRole();

  // On prend le profil de Brice Hounnou ou Sébastien Dossou comme référence
  const jobber = MOCK_JOBBERS[0];

  // Opportunités ouvertes
  const nearbyOpportunities = MOCK_REQUESTS.filter((r) => r.status === "OPEN");

  // Devis envoyés factices
  const [proposals, setProposals] = useState([
    {
      id: "prop_1",
      requestTitle: "Fuite importante sous évier cuisine (Haie Vive)",
      amount: 18500,
      status: "ACCEPTED",
      date: "28/09/2026",
      clientName: "Koffi Mensah",
      clientPhone: "+229 96 11 22 33", // Unlocked !
    },
    {
      id: "prop_2",
      requestTitle: "Installation inverseur automatique groupe électrogène",
      amount: 42000,
      status: "PENDING",
      date: "01/10/2026",
      clientName: "Koffi Mensah",
      clientPhone: "[Masqué avant accord]",
    },
  ]);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
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
              {jobber.name} • {jobber.trade} ({jobber.quarter}, {jobber.city})
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
                {jobber.credits}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Actif
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Permet de répondre à 25 demandes d'interventions supplémentaires.
            </p>
          </div>

          {/* Boost de visibilité */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Boost Visibilité Grand Cotonou</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-amber-900">
                Pack 7 jours
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Profil mis en avant dans les quartiers prioritaires ({jobber.serviceZones.slice(0, 2).join(", ")}).
            </p>
          </div>

          {/* Taux de Réponse */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Réactivité & Réponse</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {jobber.responseRate}%
              </span>
              <span className="text-xs text-slate-500 font-medium">{jobber.responseTime}</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Badge Réactif attribué sur les fiches de recherche.
            </p>
          </div>

          {/* ProxyTrust Badge Status */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Certification Officielle</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <ProxyTrustBadge level={jobber.trustBadge} variant="compact" />
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Identité ANIP/CIP validée par nos modérateurs.
            </p>
          </div>
        </div>

        {/* 1. OPPORTUNITÉS LOCALES À PROXIMITÉ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Opportunités locales à proximité (Grand Cotonou)
              </h2>
              <p className="text-xs text-slate-500">
                Demandes publiées récemment dans vos zones d'intervention.
              </p>
            </div>
            <Link
              href="/demandes"
              className="text-xs font-semibold text-client hover:underline"
            >
              Voir toutes les demandes
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nearbyOpportunities.map((req) => (
              <ServiceRequestCard key={req.id} request={req} />
            ))}
          </div>
        </div>

        {/* 2. SUIVI DES DEVIS ENVOYÉS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Mes Devis & Propositions Transmises ({proposals.length})
          </h2>

          <div className="rounded-2xl border border-border bg-white shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="p-4">Demande Client</th>
                    <th className="p-4">Montant Proposé</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Contact Client</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {proposals.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        {prop.requestTitle}
                      </td>
                      <td className="p-4 font-extrabold text-slate-900">
                        {formatFCFA(prop.amount)}
                      </td>
                      <td className="p-4">
                        {prop.status === "ACCEPTED" ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Accepté</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-900 px-2 py-0.5 font-bold">
                            <Clock className="h-3 w-3" />
                            <span>En attente</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {prop.status === "ACCEPTED" ? (
                          <span className="font-semibold text-emerald-700">
                            📞 {prop.clientPhone}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">
                            {prop.clientPhone}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500">
                        {prop.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. MON PORTFOLIO AVANT / APRÈS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Mon Portfolio Avant / Après (Chantiers Témoins)
              </h2>
              <p className="text-xs text-slate-500">
                Vos réalisations sont inspectables par les clients via notre slider interactif.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert("Simulation d'ajout de nouvelle réalisation Avant/Après")}
              className="inline-flex items-center gap-1.5 rounded-xl border border-input bg-white px-3.5 py-2 text-xs font-bold text-slate-800 shadow-soft hover:bg-slate-50"
            >
              <Upload className="h-3.5 w-3.5 text-client" />
              <span>Ajouter une réalisation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobber.portfolio.map((item) => (
              <BeforeAfterSlider
                key={item.id}
                title={item.title}
                description={item.description}
                avantUrl={item.avantUrl}
                apresUrl={item.apresUrl}
                date={item.date}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
