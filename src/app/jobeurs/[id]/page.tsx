"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  Phone,
  FileCheck,
  Award,
  ChevronLeft,
  Share2,
  AlertCircle,
  Building,
  UserCheck,
} from "lucide-react";
import { MOCK_JOBBERS, MOCK_CONVERSATIONS, formatFCFA } from "@/lib/mock-data";
import { ProxyTrustBadge } from "@/components/ProxyTrustBadge";
import { RatingStars, MultiCriteriaRating } from "@/components/RatingStars";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { SecureChatModal } from "@/components/SecureChatModal";

export default function JobberDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const jobber = MOCK_JOBBERS.find((j) => j.id === id);

  const [activeTab, setActiveTab] = useState<"about" | "portfolio" | "reviews">("about");
  const [chatOpen, setChatOpen] = useState(false);

  if (!jobber) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-slate-900">Artisan introuvable</h2>
          <p className="mt-2 text-sm text-slate-600">
            Le profil d'artisan demandé n'existe pas ou a été désactivé.
          </p>
          <Link
            href="/jobeurs"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-client px-4 py-2 text-xs font-semibold text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Retour à l'annuaire</span>
          </Link>
        </div>
      </div>
    );
  }

  // Conversation factice pour le chat
  const demoConversation = MOCK_CONVERSATIONS[0];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Barre de retour */}
      <div className="border-b border-border bg-white">
        <div className="container mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/jobeurs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-client transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Retour au catalogue des artisans</span>
          </Link>
        </div>
      </div>

      {/* Profil Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="relative">
                <img
                  src={jobber.avatar}
                  alt={jobber.name}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-2 border-slate-200 shadow-soft"
                />
                {jobber.isAvailable && (
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 border-2 border-white">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {jobber.name}
                  </h1>
                  {jobber.legalStatus === "ENTREPRISE" ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-0.5 text-xs font-bold text-client">
                      <Building className="h-3 w-3" />
                      <span>{jobber.companyName || "Entreprise Enregistrée"}</span>
                    </span>
                  ) : (
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      Artisan Particulier
                    </span>
                  )}
                </div>

                <p className="text-sm sm:text-base font-semibold text-client">
                  {jobber.trade}
                </p>

                {/* Localisation textuelle sans carte (ACC-02 & ACC-03) */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-0.5">
                  <span className="flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-client" />
                    <span>
                      {jobber.quarter}, {jobber.city} • <strong className="text-client font-semibold">~2.4 km de votre position</strong>
                    </span>
                  </span>
                  {jobber.landmark && (
                    <span className="text-slate-500 italic">
                      • Repère : « {jobber.landmark} »
                    </span>
                  )}
                </div>

                {/* Badges de Confiance */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <ProxyTrustBadge level={jobber.trustBadge} variant="compact" />
                  {jobber.ifu && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600">
                      <FileCheck className="h-3 w-3 text-emerald-600" />
                      <span>IFU: {jobber.ifu}</span>
                    </span>
                  )}
                  {jobber.rccm && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600">
                      <span>RCCM: {jobber.rccm}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cartouche d'action principale */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="flex items-center justify-center gap-2 rounded-xl bg-client px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contacter & Devis</span>
              </button>

              <div className="text-center sm:text-right md:text-center text-xs text-slate-500">
                <span>Dès <strong>{formatFCFA(jobber.startingPrice || jobber.hourlyRate)}</strong> / intervention</span>
              </div>
            </div>
          </div>

          {/* Métriques clés */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 border-t border-border pt-6">
            <div className="rounded-xl bg-slate-50 p-3.5 border border-border text-center">
              <span className="block text-xl font-extrabold text-slate-900">
                {jobber.averageRating} ★
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {jobber.totalReviews} avis vérifiés
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-border text-center">
              <span className="block text-xl font-extrabold text-slate-900">
                {jobber.completedJobs}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Missions achevées
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-border text-center">
              <span className="block text-xl font-extrabold text-slate-900">
                {jobber.responseRate}%
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Taux de réponse
              </span>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-border text-center">
              <span className="block text-xl font-extrabold text-slate-900">
                {jobber.responseTime}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Délai moyen
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par Onglets Aérés */}
      <div className="border-b border-border bg-white sticky top-16 z-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("about")}
              className={`py-4 border-b-2 transition-all duration-150 ${
                activeTab === "about"
                  ? "border-client text-client"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Présentation & Compétences
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("portfolio")}
              className={`py-4 border-b-2 transition-all duration-150 flex items-center gap-1.5 ${
                activeTab === "portfolio"
                  ? "border-client text-client"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Portfolio Avant / Après</span>
              <span className="rounded-full bg-blue-100 text-client px-2 py-0.2 text-[10px] font-bold">
                {jobber.portfolio.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`py-4 border-b-2 transition-all duration-150 flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "border-client text-client"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Avis Certifiés</span>
              <span className="rounded-full bg-slate-100 text-slate-700 px-2 py-0.2 text-[10px] font-bold">
                {jobber.reviews.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenu de l'onglet */}
      <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Onglet 1 : Présentation & Spécialités */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                <h3 className="font-bold text-slate-900 text-base mb-3">
                  À propos de {jobber.name}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {jobber.bio}
                </p>
              </div>

              {/* Compétences techniques */}
              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                <h3 className="font-bold text-slate-900 text-base mb-3">
                  Compétences & Spécialités
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobber.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-client" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bannière de Réassurance ProxyTrust V3 */}
              <ProxyTrustBadge level={jobber.trustBadge} variant="banner" />
            </div>

            {/* Colonne latérale : Tarifs & Disponibilité */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft space-y-4">
                <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-border">
                  Conditions d'Intervention
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="block text-slate-500 font-medium">Tarif indicatif de base</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      {formatFCFA(jobber.startingPrice || jobber.hourlyRate)}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-500 font-medium">Disponibilité</span>
                    <span className="font-semibold text-slate-800">
                      {jobber.availabilityDetails}
                    </span>
                  </div>

                  <div>
                    <span className="block text-slate-500 font-medium">Zones d'intervention habituelles</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {jobber.serviceZones.map((zone) => (
                        <span key={zone} className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">
                          {zone}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setChatOpen(true)}
                  className="w-full mt-4 rounded-xl bg-client py-3 text-xs font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
                >
                  Demander un devis gratuit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onglet 2 : Portfolio Avant / Après (ACC-09) */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Réalisations vérifiées sur le terrain
                </h3>
                <p className="text-xs text-slate-600">
                  Faites glisser le curseur pour visualiser la transformation réalisée par l'artisan.
                </p>
              </div>
            </div>

            {jobber.portfolio.length > 0 ? (
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
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white">
                <p className="text-sm text-slate-600">
                  Cet artisan n'a pas encore téléversé de portfolio Avant/Après.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Onglet 3 : Avis Certifiés Post-Mission (ACC-08) */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Avis et Retours Clients Certifiés
                </h3>
                <p className="text-xs text-slate-600">
                  Seuls les clients ayant finalisé une prestation sur ProxiJob peuvent déposer une évaluation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <RatingStars
                  rating={jobber.averageRating}
                  totalReviews={jobber.totalReviews}
                  size="md"
                />
                <button
                  type="button"
                  onClick={() => alert("Erreur 403 Forbidden (ACC-08) : Vous ne pouvez pas déposer d'avis spontané. Les évaluations sont strictement conditionnées à l'achèvement effectif d'une mission contractuelle avec cet artisan.")}
                  className="rounded-xl border border-input px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all shadow-soft"
                >
                  Déposer un avis
                </button>
              </div>
            </div>

            {/* Grille d'évaluation multicritères globale */}
            <MultiCriteriaRating
              qualite={5}
              ponctualite={4.9}
              prix={4.8}
              communication={5}
              readOnly
            />

            {/* Liste des avis individuels */}
            <div className="space-y-4">
              {jobber.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rev.clientName}</span>
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Mission Réalisée</span>
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">{rev.clientQuarter} • {rev.date}</span>
                    </div>

                    <RatingStars rating={rev.rating} size="sm" showText={false} />
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    « {rev.comment} »
                  </p>

                  {/* Droit de réponse du Jobeur */}
                  {rev.jobberReply && (
                    <div className="mt-3 rounded-xl bg-slate-50 p-3.5 border-l-2 border-client text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-700 font-bold">
                        <span>Réponse de {jobber.name} :</span>
                        <span className="text-[10px] text-slate-400 font-normal">{rev.jobberReplyDate}</span>
                      </div>
                      <p className="text-slate-600">{rev.jobberReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Chat Sécurisé */}
      <SecureChatModal
        conversation={demoConversation}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
}
