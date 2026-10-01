"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Star,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Heart,
  Unlock,
  Coins,
} from "lucide-react";
import {
  MOCK_REQUESTS,
  MOCK_CONVERSATIONS,
  MOCK_JOBBERS,
  formatFCFA,
  ServiceRequest,
  Proposal,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { SwitchRoleButton } from "@/components/SwitchRoleButton";
import { RatingStars, MultiCriteriaRating } from "@/components/RatingStars";
import { SecureChatModal } from "@/components/SecureChatModal";
import { JobberCard } from "@/components/JobberCard";
import { useRole } from "@/context/RoleContext";

export default function ClientDashboardPage() {
  const { user } = useRole();

  const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_REQUESTS);
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [chatOpen, setChatOpen] = useState(false);

  // Évaluation modale (ACC-08)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRequest, setReviewRequest] = useState<ServiceRequest | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Accepter un devis (ACC-07 : déclenche le déblocage automatique des coordonnées)
  const handleAcceptProposal = (requestId: string, proposalId: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          return {
            ...r,
            status: "IN_PROGRESS",
            proposals: r.proposals?.map((p) =>
              p.id === proposalId ? { ...p, status: "ACCEPTED" as const } : p
            ),
          };
        }
        return r;
      })
    );

    // Débloquer le chat associé
    setSelectedConversation((prev) => ({
      ...prev,
      isContactUnlocked: true,
    }));

    alert("✅ Proposition acceptée ! Les coordonnées de l'artisan sont désormais visibles en clair.");
  };

  const handleOpenReview = (req: ServiceRequest) => {
    // Vérification de conformité ACC-08
    if (req.status !== "COMPLETED") {
      alert("Erreur 403 : Une évaluation ne peut être déposée que sur une mission terminée.");
      return;
    }
    setReviewRequest(req);
    setReviewModalOpen(true);
    setReviewSuccess(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSuccess(true);
    setTimeout(() => {
      setReviewModalOpen(false);
      setReviewComment("");
    }, 2000);
  };

  const favoriteJobbers = MOCK_JOBBERS.slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* En-tête du Dashboard avec SwitchRoleButton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-client uppercase tracking-wider">
              Espace Particulier & Entreprise
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tableau de bord Client
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Bienvenue, {user.name} • Suivez vos demandes de services et devis reçus.
            </p>
          </div>

          <Link
            href="/demandes/nouvelle"
            className="inline-flex items-center gap-1.5 rounded-xl bg-client px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Déposer un besoin</span>
          </Link>
        </div>

        {/* Bannière de Bascule de Rôle */}
        <SwitchRoleButton variant="banner" />

        {/* 1. SECTION MES DEMANDES ACTIVES & DEVIS REÇUS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-client" />
              <span>Mes demandes de services ({requests.length})</span>
            </h2>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{req.title}</h3>
                      {req.isUrgent && (
                        <span className="rounded bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5">
                          Urgent
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500">
                      {req.quarter}, {req.city} • Publiée le {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-bold border",
                        req.status === "COMPLETED"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : req.status === "IN_PROGRESS"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-blue-50 text-client border-blue-200"
                      )}
                    >
                      {req.status === "COMPLETED"
                        ? "Terminée"
                        : req.status === "IN_PROGRESS"
                        ? "En cours d'intervention"
                        : "En attente de devis"}
                    </span>

                    {/* Déclencheur avis certifié (ACC-08) */}
                    {req.status === "COMPLETED" && (
                      <button
                        type="button"
                        onClick={() => handleOpenReview(req)}
                        className="rounded-xl bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-200 shadow-soft transition-colors"
                      >
                        ★ Évaluer la mission
                      </button>
                    )}
                  </div>
                </div>

                {/* Devis / Propositions reçues */}
                {req.proposals && req.proposals.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Propositions et Devis Reçus ({req.proposals.length})
                    </h4>

                    <div className="space-y-2">
                      {req.proposals.map((prop) => (
                        <div
                          key={prop.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={prop.jobberAvatar}
                              alt={prop.jobberName}
                              className="h-10 w-10 rounded-full object-cover border"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">
                                  {prop.jobberName}
                                </span>
                                <span className="text-xs text-amber-600 font-semibold">
                                  ★ {prop.jobberRating}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                                {prop.message}
                              </p>
                              <span className="text-[11px] text-slate-400">
                                Délai : {prop.delayDays} jour{prop.delayDays > 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end sm:self-center">
                            <div className="text-right">
                              <span className="text-sm sm:text-base font-extrabold text-slate-900">
                                {formatFCFA(prop.amount)}
                              </span>
                            </div>

                            {prop.status === "ACCEPTED" ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                                <Unlock className="h-3.5 w-3.5" />
                                <span>Accepté</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAcceptProposal(req.id, prop.id)}
                                className="rounded-xl bg-client px-3 py-1.5 text-xs font-bold text-white shadow-soft hover:bg-client-hover transition-colors"
                              >
                                Accepter le devis
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setChatOpen(true);
                              }}
                              className="p-2 rounded-xl border border-input bg-white hover:bg-slate-100 text-slate-700"
                              title="Discuter"
                            >
                              <MessageSquare className="h-4 w-4 text-client" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Aucune proposition reçue pour l'instant. Les artisans de votre quartier consultent votre demande.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 2. CONVERSATIONS EN COURS & SÉCURISÉES */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-client" />
              <span>Messagerie Sécurisée Pré-Accord</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_CONVERSATIONS.map((conv) => (
              <div
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv);
                  setChatOpen(true);
                }}
                className="flex items-start justify-between p-4 rounded-2xl border border-border bg-white shadow-soft cursor-pointer hover:border-client/40 hover:shadow-soft-md transition-all"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={conv.jobberAvatar}
                    alt={conv.jobberName}
                    className="h-11 w-11 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{conv.jobberName}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{conv.requestTitle}</p>
                    <p className="text-xs text-slate-700 mt-1 line-clamp-1 italic">
                      « {conv.lastMessage} »
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                  <div className="mt-1">
                    {conv.isContactUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <Unlock className="h-3 w-3" />
                        Contacts débloqués
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                        Coordonnées protégées
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. ARTISANS FAVORIS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            <span>Artisans Favoris</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favoriteJobbers.map((j) => (
              <JobberCard key={j.id} jobber={j} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal Chat */}
      <SecureChatModal
        conversation={selectedConversation}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* Modal Dépôt d'Avis Certifié (ACC-08) */}
      {reviewModalOpen && reviewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft-lg border border-border">
            {reviewSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-lg">Évaluation certifiée enregistrée !</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Merci de contribuer à la réputation et à la confiance sur ProxiJob Bénin.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="font-bold text-slate-900 text-base">
                    Évaluer la prestation : {reviewRequest.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>
                    Conformité ACC-08 : Vous évaluez cette mission car son état est officiellement <strong>TERMINÉ</strong>.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Note globale sur 5 étoiles
                  </label>
                  <RatingStars
                    rating={reviewRating}
                    size="lg"
                    interactive
                    onRatingChange={setReviewRating}
                  />
                </div>

                <MultiCriteriaRating
                  qualite={5}
                  ponctualite={5}
                  prix={5}
                  communication={5}
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Votre avis détaillé
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Précisez la ponctualité, le respect du devis, la propreté du chantier..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full rounded-xl border border-input p-3 text-xs sm:text-sm outline-none focus:border-client"
                  />
                </div>

                <div className="pt-3 border-t border-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="rounded-xl border border-input px-4 py-2 text-xs font-semibold text-slate-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-client px-5 py-2 text-xs font-bold text-white shadow-soft hover:bg-client-hover"
                  >
                    Publier l'évaluation certifiée
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
