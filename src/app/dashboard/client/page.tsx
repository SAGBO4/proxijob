"use client";

import React, { useState, useEffect } from "react";
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
  RefreshCw,
} from "lucide-react";
import {
  MOCK_CONVERSATIONS,
  formatFCFA,
  ServiceRequest,
  Proposal,
  Jobber,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { SwitchRoleButton } from "@/components/SwitchRoleButton";
import { RatingStars, MultiCriteriaRating } from "@/components/RatingStars";
import { SecureChatModal } from "@/components/SecureChatModal";
import { JobberCard } from "@/components/JobberCard";
import { useRole } from "@/context/RoleContext";

export default function ClientDashboardPage() {
  const { user } = useRole();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [favoriteJobbers, setFavoriteJobbers] = useState<Jobber[]>([]);
  const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
  const [chatOpen, setChatOpen] = useState(false);

  // Évaluation modale (ACC-08)
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRequest, setReviewRequest] = useState<ServiceRequest | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Chargement des données réelles
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
          const list = Array.isArray(reqData) ? reqData : (reqData.data || []);
          if (Array.isArray(list)) {
            setRequests(list);
          }
        }

        if (jobberRes.ok) {
          const jobbers = await jobberRes.json();
          const list = Array.isArray(jobbers) ? jobbers : (jobbers.data || []);
          if (Array.isArray(list)) {
            setFavoriteJobbers(list.slice(0, 2));
          }
        }
      } catch (err) {
        console.error("Erreur chargement client dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 pb-24">
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
              Bienvenue, {user.name} • Suivez vos demandes de services et devis reçus en direct.
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

        {/* Métriques d'activité */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Demandes Actives</span>
              <FileText className="h-4 w-4 text-client" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {requests.filter((r) => r.status === "OPEN" || r.status === "IN_PROGRESS").length}
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                En direct
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Besoins en attente de propositions ou en cours d'exécution.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Devis Reçus</span>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {requests.reduce((acc, r) => acc + (r.proposals?.length || 0), 0)}
              </span>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                À comparer
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Propositions tarifaires détaillées reçues d'artisans béninois.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Missions Réalisées</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {requests.filter((r) => r.status === "COMPLETED").length}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Historique
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Prestations clôturées avec succès et prêtes pour évaluation.
            </p>
          </div>
        </div>

        {/* 1. SUIVI DES DEMANDES RÉELLES DU CLIENT */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Vos Demandes en Cours (Neon PostgreSQL)
              </h2>
              <p className="text-xs text-slate-500">
                Consultez le statut de vos besoins et validez les devis reçus.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-border text-slate-500 text-xs">
              <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-client" />
              <span>Chargement des demandes réelles...</span>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-border text-slate-500 text-xs">
              Aucune demande enregistrée pour le moment.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-client bg-blue-50 px-2.5 py-0.5 rounded-full">
                          {(req as unknown as { categoryName?: string }).categoryName || req.category}
                        </span>
                        {((req as unknown as { estUrgent?: boolean }).estUrgent ?? req.isUrgent) && (
                          <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full animate-pulse">
                            Urgence signalée
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-xs font-bold px-2.5 py-0.5 rounded-full",
                            req.status === "OPEN"
                              ? "bg-emerald-100 text-emerald-800"
                              : req.status === "IN_PROGRESS"
                              ? "bg-blue-100 text-blue-800"
                              : req.status === "COMPLETED"
                              ? "bg-slate-100 text-slate-700"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {req.status === "OPEN" && "Recherche d'artisan en cours"}
                          {req.status === "IN_PROGRESS" && "Chantier en cours d'exécution"}
                          {req.status === "COMPLETED" && "Chantier terminé"}
                          {req.status === "CANCELLED" && "Demande annulée"}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 pt-1">{req.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600">{req.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-500">Budget indicatif</span>
                      <p className="text-lg font-extrabold text-slate-900">
                        {((req as unknown as { budgetIndicatif?: number }).budgetIndicatif || req.estimatedBudget)
                          ? formatFCFA((req as unknown as { budgetIndicatif?: number }).budgetIndicatif || req.estimatedBudget)
                          : "À négocier"}
                      </p>
                    </div>
                  </div>

                  {/* Devis associés */}
                  {req.proposals && req.proposals.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Propositions et Devis reçus ({req.proposals.length}) :
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {req.proposals.map((prop) => (
                          <div
                            key={prop.id}
                            className="p-3.5 rounded-xl border border-border bg-slate-50 flex items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="font-bold text-slate-900">{prop.jobberName}</div>
                              <p className="text-slate-500 mt-0.5 line-clamp-1">{prop.message}</p>
                              <div className="mt-1 flex items-center gap-2 font-bold text-slate-800">
                                <span>{formatFCFA((prop as unknown as { montant?: number }).montant || prop.amount || 0)}</span>
                                <span className="text-slate-400 font-normal">•</span>
                                <span className="text-slate-500 font-normal">
                                  Délai : {(prop as unknown as { delaiJours?: number }).delaiJours || prop.delayDays || 1} jours
                                </span>
                              </div>
                            </div>

                            {prop.status === "ACCEPTED" ? (
                              <span className="text-emerald-700 bg-emerald-100 font-bold px-2 py-1 rounded text-[11px]">
                                Accepté
                              </span>
                            ) : req.status === "OPEN" ? (
                              <button
                                type="button"
                                onClick={() => handleAcceptProposal(req.id, prop.id)}
                                className="px-3 py-1.5 rounded-lg bg-client text-white font-bold hover:bg-client-hover transition-colors shadow-soft"
                              >
                                Accepter
                              </button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bouton d'évaluation si terminée */}
                  {req.status === "COMPLETED" && (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenReview(req)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-soft transition-colors"
                      >
                        <Star className="h-3.5 w-3.5 fill-white" />
                        <span>Laisser une évaluation certifiée</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. ARTISANS FAVORIS RECOMMANDÉS */}
        {favoriteJobbers.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Artisans Recommandés à Cotonou & Calavi</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favoriteJobbers.map((jobber) => (
                <JobberCard key={jobber.id} jobber={jobber} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal d'évaluation certifiée */}
      {reviewModalOpen && reviewRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Évaluer la prestation terminée
              </h3>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Chantier : <strong>{reviewRequest.title}</strong>
            </p>

            {reviewSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center space-y-1">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto" />
                <p className="font-bold">Évaluation enregistrée avec succès !</p>
                <p className="text-slate-500">Merci de contribuer à la réputation des artisans locaux.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Note globale :
                  </label>
                  <RatingStars rating={reviewRating} interactive onRatingChange={setReviewRating} />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Votre avis circonstancié :
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    placeholder="Précisez la qualité de finition, le respect des délais..."
                    className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-client"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOpen(false)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-client text-white font-bold hover:bg-client-hover shadow-soft"
                  >
                    Publier l'évaluation
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
